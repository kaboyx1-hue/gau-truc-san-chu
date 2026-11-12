// Logic thuan cua viec hoc: chuoi ngay, bac nho cach quang, cham giong noi. Khong dung DOM de kiem thu bang node.
const HOC = (() => {
  // Ngay la chuoi yyyy-mm-dd (gio may, giong today() trong app.js)
  const soNgay = (a, b) => Math.round((Date.parse(b + 'T00:00:00Z') - Date.parse(a + 'T00:00:00Z')) / 864e5);

  // Chuoi ngay: hom qua co hoc thi cong 1, bo tu mot ngay tro len thi ve 1, ngay hoc dau tien la 1
  const chuoiMoi = (last, chuoi, hom) => {
    if (!last) return 1;
    const k = soNgay(last, hom);
    return k <= 0 ? chuoi : k === 1 ? chuoi + 1 : 1;
  };
  // Con so hien tren thanh tren: da bo qua hom qua thi chuoi coi nhu dut
  const chuoiHienTai = (chuoi, last, hom) => (last && soNgay(last, hom) <= 1 ? Math.max(chuoi, 1) : 0);

  // Bac nho 0..3. Hen on lai sau 1, 3, 7 ngay ke tu luc dat bac. Bac 0 chua hoc nen luon den han.
  const KHOANG = [0, 1, 3, 7];
  const denHan = (bac, ngayDat, hom) => !bac || !ngayDat || soNgay(ngayDat, hom) >= KHOANG[bac];
  // Tra ve bac moi va doi=true khi phai ghi lai ngay dat bac. Tra loi dung ngoai han thi khong tinh, nen lam di lam lai trong mot buoi khong len bac.
  const capNhat = (bac, ngayDat, hom, dung) => {
    if (!dung) return { bac: bac ? 1 : 0, doi: true };
    if (denHan(bac, ngayDat, hom)) return { bac: Math.min(3, bac + 1), doi: true };
    return { bac, doi: false };
  };

  // May ghi so thanh chu so (3点, 2个, 20). So tu 0 den 99 doc thanh chu Han, tu 100 tro len va so co so 0 dau doc tung chu so (nam, so dien thoai).
  const CH = '零一二三四五六七八九';
  const soHan = n => n < 10 ? CH[n] : n < 20 ? '十' + (n % 10 ? CH[n % 10] : '') : CH[(n / 10) | 0] + '十' + (n % 10 ? CH[n % 10] : '');
  const chuanSo = s => String(s == null ? '' : s).replace(/\d+/g, m => m.length > 1 && m[0] === '0' || +m >= 100 ? [...m].map(d => CH[d]).join('') : soHan(+m));

  // Chi so chu Han voi nhau, 两 va 二 coi nhu mot. p la ty le khop (0 den 1), trung la cac vi tri chu cua cau can noi da khop
  const hz = s => String(s || '').replace(/[^一-鿿]/g, '').replace(/两/g, '二');
  function soKhop(dich, noi) {
    const a = hz(dich), b = hz(chuanSo(noi)), m = a.length, n = b.length;
    if (!m || !n) return { p: 0, trung: new Set };
    const d = Array.from({ length: m + 1 }, () => new Array(n + 1).fill(0));
    for (let i = m - 1; i >= 0; i--) for (let j = n - 1; j >= 0; j--) d[i][j] = a[i] === b[j] ? d[i + 1][j + 1] + 1 : Math.max(d[i + 1][j], d[i][j + 1]);
    const trung = new Set;
    let i = 0, j = 0;
    while (i < m && j < n) { if (a[i] === b[j]) { trung.add(i); i++; j++; } else if (d[i + 1][j] >= d[i][j + 1]) i++; else j++; }
    return { p: 2 * d[0][0] / (m + n), trung };
  }

  return { soNgay, chuoiMoi, chuoiHienTai, denHan, capNhat, chuanSo, soKhop };
})();
if (typeof module !== 'undefined') module.exports = HOC;
