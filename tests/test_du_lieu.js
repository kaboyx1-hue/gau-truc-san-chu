// Kiem du lieu bai hoc: thieu cot, chuoi dut, cum khong chua tu, cau khong co am thanh.
const test = require('node:test');
const assert = require('node:assert');
const fs = require('fs');
const path = require('path');

const goc = path.join(__dirname, '..');
const D = new Function(fs.readFileSync(path.join(goc, 'data.js'), 'utf8') + ';return {WORLDS,RIDDLES,RADICALS,MEASURE,ORDERS,CHAINS,CHATS,SPEAK,PASSAGES,TIPS,NATURAL,LV}')();
const tu = D.WORLDS.flatMap(W => W.lessons.flatMap(L => L.w.split('\n').map(l => l.split('|'))));

test('moi tu du 7 cot, khong trung, cum chua dung tu', () => {
  const co = new Set();
  for (const f of tu) {
    assert.equal(f.length, 7, f[0]);
    assert.ok(!co.has(f[0]), 'trung ' + f[0]);
    co.add(f[0]);
    assert.ok(f[4].includes(f[0]), f[0]);
  }
});

test('chuoi noi chu khong dut', () => {
  for (const c of D.CHAINS) {
    const a = c.split(';').map(s => s.split('|')[0]);
    a.forEach((x, i) => { if (i) assert.equal(a[i - 1].slice(-1), x[0], x); });
  }
});

test('cau do co 3 phuong an sai, khong lo dap an trong de', () => {
  for (const r of D.RIDDLES) {
    assert.equal(r[7].length, 3);
    assert.ok(!r[7].includes(r[3]));
    assert.ok(!r[0].includes(r[3]), r[0]);
  }
});

test('moi cau hay doc deu co am thanh', () => {
  const am = JSON.parse(fs.readFileSync(path.join(goc, 'audio.json'), 'utf8'));
  const can = [...tu.flatMap(f => [f[0], f[4]]), ...D.RIDDLES.flatMap(r => [r[0], r[3]]), ...D.RADICALS.map(r => r[2]),
    ...D.ORDERS.map(o => o[0].replace(/\|/g, '')), ...D.CHATS.flatMap(C => C.s.flatMap(s => [s[0], s[3]])),
    ...D.SPEAK.flatMap(x => [x[2], x[5]]), ...D.TIPS.flatMap(x => (x[1] ? [x[0], x[2]] : [x[2]])), ...D.NATURAL.map(x => x[0]),
    ...D.MEASURE.map(m => '一' + m[4] + m[0])];
  assert.deepEqual(can.filter(t => !am[t]), []);
});

test('moi bai ngoai de duoc gan nhan dung', () => {
  assert.equal(tu.filter(f => !D.LV[f[0]]).length, 11);
});
