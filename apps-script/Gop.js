// Gop tien do cua hai may. Dung chung cho trang web va Apps Script: khong may nao lam mat tien do cua may kia.
function gopTienDo(a, b) {
  a = a || {}; b = b || {};
  const maxO = (x, y) => { const r = Object.assign({}, x); for (const k in y || {}) r[k] = Math.max(r[k] || 0, y[k] || 0); return r; };
  const ba = a.box || {}, bb = b.box || {}, at = a.boxT || {}, bt = b.boxT || {}, box = {}, boxT = {};
  for (const h of new Set([...Object.keys(ba), ...Object.keys(bb)])) {
    const lay = !(h in ba) || (h in bb && (bt[h] || 0) > (at[h] || 0)) ? bb : ba;
    box[h] = lay[h];
    boxT[h] = Math.max(at[h] || 0, bt[h] || 0);
  }
  const exams = Object.assign({}, a.exams);
  for (const k in b.exams || {}) if (!exams[k] || b.exams[k].pct > exams[k].pct) exams[k] = b.exams[k];
  const qa = a.q || {}, qb = b.q || {};
  const q = qa.d === qb.d
    ? { d: qa.d, learn: Math.max(qa.learn || 0, qb.learn || 0), game: Math.max(qa.game || 0, qb.game || 0), right: Math.max(qa.right || 0, qb.right || 0) }
    : ((qa.d || '') > (qb.d || '') ? qa : qb);
  const la = a.last || '', lb = b.last || '';
  return {
    xp: Math.max(a.xp || 0, b.xp || 0),
    streak: la === lb ? Math.max(a.streak || 0, b.streak || 0) : ((la > lb ? a.streak : b.streak) || 0),
    last: la > lb ? la : lb,
    stars: maxO(a.stars, b.stars), box, boxT, exams, q,
  };
}
if (typeof module !== 'undefined') module.exports = { gopTienDo };
