// Kiem logic hoc: chuoi ngay, bac nho cach quang, cham giong noi so, va thanh trang tri cua ban do.
const test = require('node:test');
const assert = require('node:assert');
const fs = require('fs');
const path = require('path');
const HOC = require('../hoc.js');

test('chuoi ngay: ngay dau la 1, hom qua co hoc thi cong 1, bo ngay thi ve 1', () => {
  assert.equal(HOC.chuoiMoi('', 0, '2026-11-10'), 1);
  assert.equal(HOC.chuoiMoi('2026-11-09', 4, '2026-11-10'), 5);
  assert.equal(HOC.chuoiMoi('2026-11-10', 4, '2026-11-10'), 4);
  assert.equal(HOC.chuoiMoi('2026-11-08', 4, '2026-11-10'), 1);
  assert.equal(HOC.chuoiMoi('2026-09-01', 5, '2026-11-12'), 1);
  assert.equal(HOC.chuoiMoi('2026-02-28', 3, '2026-03-01'), 4, 'qua thang van tinh dung ngay lien tiep');
});

test('chuoi hien tren thanh tren: bo qua hom qua thi hien 0, ngay dau tien hien 1', () => {
  assert.equal(HOC.chuoiHienTai(5, '2026-11-11', '2026-11-12'), 5);
  assert.equal(HOC.chuoiHienTai(5, '2026-11-12', '2026-11-12'), 5);
  assert.equal(HOC.chuoiHienTai(5, '2026-11-10', '2026-11-12'), 0);
  assert.equal(HOC.chuoiHienTai(0, '2026-11-12', '2026-11-12'), 1, 'du lieu cu ngay dau dang la 0');
  assert.equal(HOC.chuoiHienTai(0, '', '2026-11-12'), 0);
});

test('bac nho: ba lan dung lien tiep trong mot buoi chi len mot bac', () => {
  let bac = 0, ngay = '';
  for (let i = 0; i < 3; i++) {
    const r = HOC.capNhat(bac, ngay, '2026-11-02', true);
    if (r.doi) { bac = r.bac; ngay = '2026-11-02'; }
  }
  assert.equal(bac, 1);
});

test('bac nho: len bac khi den han sau 1, 3, 7 ngay, sai thi ve bac 1', () => {
  let bac = 1, ngay = '2026-11-02';
  assert.equal(HOC.capNhat(bac, ngay, '2026-11-02', true).doi, false);
  let r = HOC.capNhat(bac, ngay, '2026-11-03', true);
  assert.deepEqual(r, { bac: 2, doi: true });
  bac = 2; ngay = '2026-11-03';
  assert.equal(HOC.denHan(bac, ngay, '2026-11-05'), false);
  assert.equal(HOC.denHan(bac, ngay, '2026-11-06'), true);
  r = HOC.capNhat(bac, ngay, '2026-11-06', true);
  assert.deepEqual(r, { bac: 3, doi: true });
  assert.deepEqual(HOC.capNhat(3, '2026-11-06', '2026-11-13', true), { bac: 3, doi: true }, 'bac cao nhat chi doi hen on');
  assert.deepEqual(HOC.capNhat(3, '2026-11-06', '2026-11-13', false), { bac: 1, doi: true });
  assert.deepEqual(HOC.capNhat(0, '', '2026-11-13', false), { bac: 0, doi: true }, 'tu chua hoc ma tra loi sai van la chua hoc');
});

test('chuan so: may ghi so thi doi sang chu Han', () => {
  assert.equal(HOC.chuanSo('我3点起床'), '我三点起床');
  assert.equal(HOC.chuanSo('20'), '二十');
  assert.equal(HOC.chuanSo('12个'), '十二个');
  assert.equal(HOC.chuanSo('35'), '三十五');
  assert.equal(HOC.chuanSo('2026年'), '二零二六年');
  assert.equal(HOC.chuanSo('10:05'), '十:零五');
  assert.equal(HOC.chuanSo('你好'), '你好');
});

test('cham giong: nguoi noi dung nhung may ghi so van khop', () => {
  assert.equal(HOC.soKhop('三点', '3点').p, 1);
  assert.equal(HOC.soKhop('我三点起床', '我3点起床').p, 1);
  assert.equal(HOC.soKhop('我有两个孩子', '我有2个孩子').p, 1);
  assert.equal(HOC.soKhop('二十', '20').p, 1);
  assert.equal(HOC.soKhop('你好吗', '你好吗').p, 1);
  assert.ok(HOC.soKhop('你好吗', '谢谢').p < .5);
  assert.equal(HOC.soKhop('', '你好').p, 0);
  assert.deepEqual([...HOC.soKhop('你好吗', '你好').trung], [0, 1]);
});

// Bai hang tuan them the gioi w6 trong apKho(), nen vMap phai co bo trang tri du phong. Thieu thi Ban do trang tron.
test('ban do co bo trang tri du phong cho the gioi them tu Sheet', () => {
  const src = fs.readFileSync(path.join(__dirname, '..', 'app.js'), 'utf8');
  assert.ok(/const dc=DECOR\[W\.id\]\|\|\[/.test(src));
});
