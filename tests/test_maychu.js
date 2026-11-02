// Chay may chu that tren Sheet gia, co mo phong Sheets tu doi chuoi ngay thang thanh Date.
const test = require('node:test');
const assert = require('node:assert');
const fs = require('fs');
const path = require('path');
const vm = require('vm');

function dungMayChu(tuDoiNgay = false) {
  const tab = {};
  const props = {};
  const taoTab = ten => {
    const o = [];
    const sh = {
      getDataRange: () => ({ getValues: () => o.map(h => h.slice()) }),
      getLastRow: () => o.length,
      getMaxRows: () => 1000,
      setFrozenRows() {},
      getRange: (r, c, nr, nc) => ({
        setNumberFormat() { return this; },
        setValues(v) {
          v.forEach((h, i) => { o[r - 1 + i] = o[r - 1 + i] || []; h.forEach((x, k) => { o[r - 1 + i][c - 1 + k] = tuDoiNgay && /^\d{4}-\d{2}-\d{2}$/.test(x) ? new Date(x + 'T00:00:00+07:00') : x; }); });
        },
      }),
    };
    return (tab[ten] = { sh, o });
  };
  const ctx = {
    JSON, Date, Set, Array, String, Number, Object, Math, console,
    ContentService: { MimeType: { JSON: 'j' }, createTextOutput: t => ({ t, setMimeType() { return this; } }) },
    SpreadsheetApp: { getActive: () => ({ getSheetByName: t => (tab[t] ? tab[t].sh : null), insertSheet: t => taoTab(t).sh }) },
    PropertiesService: { getScriptProperties: () => ({ getProperty: k => (k in props ? props[k] : null), setProperty: (k, v) => { props[k] = v; } }) },
    LockService: { getScriptLock: () => ({ waitLock() {}, releaseLock() {} }) },
    Utilities: { formatDate: d => new Date(d.getTime() + 7 * 3600e3).toISOString().slice(0, 10) },
  };
  vm.createContext(ctx);
  const goc = path.join(__dirname, '..', 'apps-script');
  vm.runInContext(fs.readFileSync(path.join(goc, 'Gop.js'), 'utf8').replace(/if \(typeof module[^\n]*/, ''), ctx);
  vm.runInContext(fs.readFileSync(path.join(goc, 'Code.js'), 'utf8'), ctx);
  const goi = g => JSON.parse(vm.runInContext('doPost', ctx)({ postData: { contents: JSON.stringify(g) } }).t);
  return { goi, tab, props };
}

const K = 'a'.repeat(40);

test('khoa sai bi tu choi, khoa dau tien mo he thong', () => {
  const m = dungMayChu();
  assert.equal(m.goi({ k: 'ngan' }).loi, 'khoa');
  assert.ok(m.goi({ k: K, tien: {} }).ok);
  assert.equal(m.goi({ k: 'b'.repeat(40), tien: { xp: 999 } }).loi, 'khoa');
  assert.equal(m.goi({ k: K }).tien.xp, 0);
});

test('hai may khong lam mat tien do cua nhau', () => {
  const m = dungMayChu();
  m.goi({ k: K, tien: { xp: 100, stars: { a: 3, b: 1 }, box: { 猫: 2 }, boxT: { 猫: 50 }, exams: { D1: { pct: 80 } } } });
  const r = m.goi({ k: K, tien: { xp: 40, stars: { b: 2, c: 1 }, box: { 猫: 0 }, boxT: { 猫: 90 }, exams: { D1: { pct: 60 } } } }).tien;
  assert.equal(r.xp, 100);
  assert.deepEqual(r.stars, { a: 3, b: 2, c: 1 });
  assert.equal(r.box['猫'], 0, 'lan hoc moi hon thang');
  assert.equal(r.exams.D1.pct, 80);
});

test('luot tuoi cay khong mat khi hai may cung hoc', () => {
  const m = dungMayChu();
  m.goi({ k: K, tien: { vuon: { n: 9, d: '2026-11-02', hom: 3 } } });
  const r = m.goi({ k: K, tien: { vuon: { n: 7, d: '2026-11-02', hom: 4 } } }).tien.vuon;
  assert.deepEqual(r, { n: 9, d: '2026-11-02', hom: 4 });
  assert.equal(m.goi({ k: K, tien: { vuon: { n: 10, d: '2026-11-03', hom: 1 } } }).tien.vuon.hom, 1);
});

test('nap bai: chi them, chay lai khong trung, sai dang bi chan', () => {
  const m = dungMayChu();
  const bai = { id: 'b1', loai: 'riddle', data: ['a'], ngay: '2026-11-08' };
  assert.equal(m.goi({ k: K, nap: { kho: [bai] } }).them, 1);
  assert.equal(m.goi({ k: K, nap: { kho: [bai] } }).them, 0);
  assert.equal(m.goi({ k: K, nap: { kho: [{ id: 'x', loai: 'la', data: 1 }] } }).ok, false);
  assert.equal(m.goi({ k: K, nap: { kho: [{ id: 'y', loai: 'tip', data: 'x'.repeat(50000) }] } }).ok, false);
  const r = m.goi({ k: K, rev: 0 });
  assert.equal(r.kho.length, 1);
  assert.equal(m.goi({ k: K, rev: r.rev }).kho, null, 'khong doi thi khong gui lai');
});

test('tat bai bang cot bat = 0', () => {
  const m = dungMayChu();
  m.goi({ k: K, nap: { kho: [{ id: 'b1', loai: 'tip', data: [1] }, { id: 'b2', loai: 'tip', data: [2] }] } });
  m.tab.KHO_BAI.o[1][4] = '0';
  assert.deepEqual(m.goi({ k: K, rev: 0 }).kho.map(x => x.id), ['b2']);
});

test('lich theo ngay van doc dung khi Sheets tu doi ngay thanh Date', () => {
  const m = dungMayChu(true);
  m.goi({ k: K, nap: { lich: [{ ngay: '2026-11-03', bai: 'Người thân', tro: 'snake,fish', loi: 'Cố lên' }] } });
  assert.deepEqual(m.goi({ k: K, ngay: '2026-11-03' }).lich, { bai: 'Người thân', tro: 'snake,fish', loi: 'Cố lên' });
  assert.equal(m.goi({ k: K, ngay: '2026-11-04' }).lich, null);
  m.goi({ k: K, nap: { lich: [{ ngay: '2026-11-03', bai: 'Khác' }] } });
  assert.equal(m.tab.LICH.o.length, 2, 'cung ngay thi sua, khong them dong');
  assert.equal(m.goi({ k: K, ngay: '2026-11-03' }).lich.bai, 'Khác');
});

test('ngay sai dang khong nap', () => {
  assert.equal(dungMayChu().goi({ k: K, nap: { lich: [{ ngay: '3/11' }] } }).ok, false);
});
