// Adds "new keyword" data from the GSC query file to the existing dashboard data.
// usage: node build-simple-data.js <../IPG Dashboard/data.json> <out.json>
const fs = require('fs');
const D = 'C:/Users/ShubhamWalwadkar/Downloads/';
const MON = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct'], NM = 10;
const mi = s => MON.indexOf(s.slice(0, 3));
function csv(path) {
  const t = fs.readFileSync(path, 'utf8').replace(/^\uFEFF/, ''); const rows = []; let r = [], f = '', q = false;
  for (let i = 0; i < t.length; i++) { const c = t[i];
    if (q) { if (c == '"') { if (t[i + 1] == '"') { f += '"'; i++; } else q = false; } else f += c; }
    else if (c == '"') q = true; else if (c == ',') { r.push(f); f = ''; }
    else if (c == '\n' || c == '\r') { if (c == '\r' && t[i + 1] == '\n') i++; r.push(f); f = ''; if (r.length > 1 || r[0] !== '') rows.push(r); r = []; }
    else f += c; }
  if (f || r.length) { r.push(f); rows.push(r); } return rows;
}
const norm = s => String(s || '').toLowerCase().replace(/\s+/g, ' ').trim();
const BR = [['Lowara', /lowara/], ['Grundfos', /grundfos/], ['Wilo', /\bwilo/], ['Flygt', /flygt/], ['Ebara', /ebara/], ['SAER', /\bsaer\b/], ['Homa', /\bhoma\b/], ['Vogel', /vogel/], ['Metso', /metso/], ['Seepex', /seepex/], ['Grindex', /grindex/], ['Sulzer', /sulzer/], ['Netzsch', /netzsch/], ['Xylem', /xylem/], ['Goulds', /goulds/]];
const PT = [['Dompelpomp', /dompel|vuilwater|submersible/], ['Bronpomp', /bronpomp|bron pomp|bronwater|bron water|bronnering/], ['Centrifugaalpomp', /centrifug/], ['Membraanpomp', /membraan|diaphragm/], ['Wormpomp', /wormpomp|worm pomp|excentrisch/], ['Lobbenpomp', /lobben|lobe pump/], ['Meertrapspomp', /meertraps|multistage/], ['Hydrofoor', /hydrofoor|drukverhog/], ['Beregeningspomp', /beregening/], ['Slurrypomp', /slurry/], ['Blok-/Inline-/Insteekpomp', /blokpomp|inline|insteek/], ['Waterpomp', /waterpomp|water pomp/], ['Overige pompen', /pomp|pump/]];
function topic(q, b) { q = norm(q); for (const [n, r] of BR) if (r.test(q)) return n; if (b === 'IPG Brand' || /\bipg\b|industrial ?pump/.test(q)) return 'IPG (own brand)'; for (const [n, r] of PT) if (r.test(q)) return n; return 'Other / unclassified'; }
const zero = () => Array(NM).fill(0);
const data = JSON.parse(fs.readFileSync(process.argv[2], 'utf8'));
const qr = csv(D + 'IPG GSC_GSC Performance_Table Jan-OCt 2026 - Q.csv'); qr.shift();
const qm = new Map();
for (const r of qr) { const m = mi(r[0]); if (m < 0) continue; const q = norm(r[1]); let o = qm.get(q);
  if (!o) { o = { im: zero(), cl: zero(), ps: zero(), b: r[2] }; qm.set(q, o); } o.im[m] += +r[4]; o.cl[m] += +r[3]; o.ps[m] += (+r[5]) * (+r[4]); }
const nk = { counts: zero(), impr: zero(), byTopic: {}, top: MON.map(() => []) };
for (const [q, o] of qm) {
  const f = o.im.findIndex(v => v > 0); if (f < 1) continue; // Jan = already there
  const t = topic(q, o.b); const x = nk.byTopic[t] || (nk.byTopic[t] = { n: zero(), im: zero() });
  nk.counts[f]++; nk.impr[f] += o.im[f]; x.n[f]++; x.im[f] += o.im[f];
  nk.top[f].push({ q, t, im: o.im[f], cl: o.cl[f], p: Math.round(o.ps[f] / o.im[f] * 10) / 10 });
}
nk.top = nk.top.map(a => a.sort((x, y) => y.im - x.im).slice(0, 12));
// all-time impressions per keyword for the "hidden gem" surprise (impressions, 0 clicks)
const gems = []; for (const [q, o] of qm) { const im = o.im.reduce((a, b) => a + b), cl = o.cl.reduce((a, b) => a + b); if (cl === 0 && im >= 300) gems.push({ q, im, t: topic(q, o.b) }); }
gems.sort((a, b) => b.im - a.im);
const out = { months: data.months, totals: data.totals, topics: data.topics.map(t => ({ n: t.n, kind: t.kind, cl: t.cl, im: t.im, pos: t.pos, z: t.z.map(x => x[1]), kw: t.kw })),
  ltopics: data.ltopics.map(t => ({ n: t.n, kind: t.kind, cl: t.cl, im: t.im })), zSel: data.zSel.map(x => x.z), selN: data.selN,
  selRows: data.selRows.map(r => ({ k: r.k, t: r.t, p: r.p, c: r.c, i: r.i })),
  pages: data.pages.filter(p => !p.u.startsWith('/Admin') && !p.u.startsWith('/Files')).map(p => ({ u: p.u, t: p.t, f: p.f, cl: p.cl, im: p.im })),
  newKw: nk, gems: gems.slice(0, 15) };
fs.writeFileSync(process.argv[3], JSON.stringify(out));
console.log('new kw per month', nk.counts.join(','), '| impr', nk.impr.join(','), '| gems', gems.length, '| bytes', fs.statSync(process.argv[3]).size);
