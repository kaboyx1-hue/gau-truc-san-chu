// May chu cua Gau Truc San Chu: tien do, lich theo ngay va kho bai moi nam trong Google Sheet cua chinh script nay.
// Khong co khoa trong file nay. Khoa rieng duoc giu trong Script Properties.

const MUC_TIEN = ['xp', 'streak', 'last', 'stars', 'box', 'boxT', 'exams', 'q', 'vuon'];
const LOAI_BAI = ['bai', 'riddle', 'order', 'tip', 'speak', 'chat'];
const COT_KHO = ['id', 'loai', 'data', 'ngay', 'bat'], COT_LICH = ['ngay', 'bai', 'tro', 'loi_nhan'], COT_TIEN = ['muc', 'gia_tri'];
const TOI_DA_NAP = 200, TOI_DA_O = 45000;

function doGet() {
  return ContentService.createTextOutput('Gau Truc San Chu dang chay.');
}

function doPost(e) {
  try {
    return tra_(xuLy_(JSON.parse(e.postData.contents)));
  } catch (loi) {
    return tra_({ ok: false, loi: String(loi && loi.message || loi) });
  }
}

function tra_(o) {
  return ContentService.createTextOutput(JSON.stringify(o)).setMimeType(ContentService.MimeType.JSON);
}

function xuLy_(goi) {
  const khoa = goi && goi.k;
  if (typeof khoa !== 'string' || !/^[\w-]{32,128}$/.test(khoa)) return { ok: false, loi: 'khoa' };
  const lock = LockService.getScriptLock();
  lock.waitLock(25000);
  try {
    const kho = PropertiesService.getScriptProperties();
    const daCo = kho.getProperty('KHOA');
    if (!daCo) kho.setProperty('KHOA', khoa); // link rieng dau tien mo he thong
    else if (daCo !== khoa) return { ok: false, loi: 'khoa' };

    if (goi.nap) return napBai_(goi.nap, kho);

    const tien = gopTienDo(docTien_(), goi.tien || {});
    ghiTien_(tien);
    const rev = Number(kho.getProperty('REV_KHO')) || 0;
    return { ok: true, tien, lich: lichNgay_(String(goi.ngay || '')), rev, kho: rev !== Number(goi.rev) ? docKho_() : null };
  } finally {
    lock.releaseLock();
  }
}

function bang_(ten, cot) {
  const ss = SpreadsheetApp.getActive();
  let sh = ss.getSheetByName(ten);
  if (!sh) {
    sh = ss.insertSheet(ten);
    sh.getRange(1, 1, sh.getMaxRows(), cot.length).setNumberFormat('@'); // Sheets khong duoc tu doi ngay thang, so
    sh.getRange(1, 1, 1, cot.length).setValues([cot]);
    sh.setFrozenRows(1);
  }
  return sh;
}

function docTien_() {
  const o = {};
  bang_('TIEN_DO', COT_TIEN).getDataRange().getValues().slice(1).forEach(d => {
    try { o[d[0]] = JSON.parse(d[1]); } catch (e) { /* o hong thi bo qua, cac may van con ban cua minh */ }
  });
  return o;
}

function ghiTien_(t) {
  const hang = MUC_TIEN.map(m => [m, JSON.stringify(t[m] === undefined ? null : t[m])]);
  hang.forEach(h => { if (h[1].length > TOI_DA_O) throw new Error('muc qua lon: ' + h[0]); });
  bang_('TIEN_DO', COT_TIEN).getRange(2, 1, hang.length, 2).setValues(hang);
}

function chuoiNgay_(v) {
  return v instanceof Date ? Utilities.formatDate(v, 'Asia/Ho_Chi_Minh', 'yyyy-MM-dd') : String(v);
}

// Hang trong LICH do Claude xep truoc hoac chu sua tay. Khong co hang thi trang tu xoay theo ngay.
function lichNgay_(ngay) {
  const d = bang_('LICH', COT_LICH).getDataRange().getValues().slice(1).find(h => chuoiNgay_(h[0]) === ngay);
  return d ? { bai: String(d[1] || ''), tro: String(d[2] || ''), loi: String(d[3] || '') } : null;
}

function docKho_() {
  const ra = [];
  bang_('KHO_BAI', COT_KHO).getDataRange().getValues().slice(1).forEach(d => {
    if (String(d[4]) === '0') return; // cot bat = 0 la tat bai loi ma khong can xoa
    try { ra.push({ id: String(d[0]), loai: String(d[1]), data: JSON.parse(d[2]) }); } catch (e) { /* bo qua hang hong */ }
  });
  return ra;
}

// Nap bai moi: chi them, trung id thi bo qua de chay lai khong tao trung.
function napBai_(nap, kho) {
  const ds = Array.isArray(nap.kho) ? nap.kho : [], lich = Array.isArray(nap.lich) ? nap.lich : [];
  if (ds.length > TOI_DA_NAP || lich.length > 60) return { ok: false, loi: 'qua nhieu' };
  for (const m of ds) {
    if (!m || typeof m.id !== 'string' || !m.id || !LOAI_BAI.includes(m.loai)) return { ok: false, loi: 'bai sai dang: ' + (m && m.id) };
    const chu = JSON.stringify(m.data);
    if (!chu || chu.length > TOI_DA_O) return { ok: false, loi: 'bai qua lon: ' + m.id };
  }
  for (const l of lich) if (!/^\d{4}-\d{2}-\d{2}$/.test(String(l && l.ngay))) return { ok: false, loi: 'ngay sai' };

  const sh = bang_('KHO_BAI', COT_KHO);
  const co = new Set(sh.getDataRange().getValues().slice(1).map(d => String(d[0])));
  let them = 0;
  for (const m of ds) {
    if (co.has(m.id)) continue;
    co.add(m.id);
    sh.getRange(sh.getLastRow() + 1, 1, 1, COT_KHO.length).setValues([[m.id, m.loai, JSON.stringify(m.data), String(m.ngay || ''), '1']]);
    them++;
  }
  if (them) kho.setProperty('REV_KHO', String((Number(kho.getProperty('REV_KHO')) || 0) + 1));

  const sl = bang_('LICH', COT_LICH);
  const cu = sl.getDataRange().getValues().slice(1).map(h => chuoiNgay_(h[0]));
  for (const l of lich) {
    const dong = [l.ngay, String(l.bai || ''), String(l.tro || ''), String(l.loi || '')], i = cu.indexOf(l.ngay);
    if (i >= 0) sl.getRange(i + 2, 1, 1, COT_LICH.length).setValues([dong]);
    else { sl.getRange(sl.getLastRow() + 1, 1, 1, COT_LICH.length).setValues([dong]); cu.push(l.ngay); }
  }
  return { ok: true, them, lich: lich.length };
}
