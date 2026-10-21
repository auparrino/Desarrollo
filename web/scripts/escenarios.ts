// Corre los escenarios E0–E3 (y OWA) sobre la grilla y resume los resultados por provincia
// y regiones candidatas. Uso: npx vite-node scripts/escenarios.ts > ../docs/resultados.json
import { readFileSync } from "node:fs";
import { h3FromParts, type CellsMeta, type Dataset } from "../src/data/load";
import { RESTRICTIONS, SCENARIOS, effectiveWeights } from "../src/model/criteria";
import { DEFAULT_WATER, aggregate, computeMask, factorScores, type Aggregation } from "../src/model/mcda";
import { findSites } from "../src/model/sites";
import { runMonteCarlo } from "../src/model/montecarlo";

const dir = new URL("../public/data/", import.meta.url);
const meta: CellsMeta = JSON.parse(readFileSync(new URL("cells.json", dir), "utf8"));
const raw = readFileSync(new URL("cells.bin", dir));
const buf = raw.buffer.slice(raw.byteOffset, raw.byteOffset + raw.byteLength);
const n = meta.n;
const lo = new Uint32Array(buf, meta.layout.h3_lo, n);
const hi = new Uint32Array(buf, meta.layout.h3_hi, n);
const h3 = Array.from({ length: n }, (_, i) => h3FromParts(lo[i], hi[i]));
const ds: Dataset = {
  n, h3, meta, index: new Map(h3.map((h, i) => [h, i])),
  dep: new Uint16Array(buf.slice(meta.layout.dep_idx, meta.layout.dep_idx + n * 2)),
  col: Object.fromEntries(meta.columns.map((c) => [c.id, new Float32Array(buf, c.offset, n)])),
};

const fs = factorScores(ds.col, n, {});
const mask = computeMask(ds.col, n, RESTRICTIONS, DEFAULT_WATER);
const aptas = mask.reduce((a, m) => a + (m === 0 ? 1 : 0), 0);
const out: Record<string, unknown> = { celdas: n, aptas };

const runs: { id: string; w: Record<string, number>; agg: Aggregation }[] = [
  ...SCENARIOS.map((s) => ({ id: s.id, w: effectiveWeights(s.weights()), agg: { method: "wlc" } as Aggregation })),
  { id: "E1-OWA0.3", w: effectiveWeights(SCENARIOS[0].weights()), agg: { method: "owa", orness: 0.3 } },
];
const topSets: Record<string, Set<number>> = {};
for (const r of runs) {
  const score = aggregate(fs, r.w, mask, r.agg);
  const idx = [...score.keys()].filter((i) => Number.isFinite(score[i])).sort((a, b) => score[b] - score[a]);
  const top = idx.slice(0, Math.round(idx.length * 0.05));
  topSets[r.id] = new Set(top);
  const byProv: Record<string, number> = {};
  for (const i of top) {
    const p = meta.departamentos[ds.dep[i]].provincia;
    byProv[p] = (byProv[p] ?? 0) + 1;
  }
  const sites = findSites(ds, score, { topFrac: 0.02, poblacion: 500_000, densidad: 75, maxSites: 15 }).map((s) => ({
    rank: s.rank, lugar: `${s.departamento}, ${s.provincia}`, aptitud: +s.score.toFixed(3), km2: Math.round(s.areaKm2),
    centro: s.center.map((x) => +x.toFixed(2)),
  }));
  out[r.id] = {
    top5_por_provincia: Object.fromEntries(Object.entries(byProv).sort((a, b) => b[1] - a[1]).map(([k, v]) => [k, +(v / top.length * 100).toFixed(1)])),
    sitios: sites,
  };
}
// solapamiento del 5 % superior entre escenarios (índice de Jaccard)
const ids = Object.keys(topSets);
const jac: Record<string, number> = {};
for (let a = 0; a < ids.length; a++) for (let b = a + 1; b < ids.length; b++) {
  const A = topSets[ids[a]], B = topSets[ids[b]];
  let inter = 0;
  for (const x of A) if (B.has(x)) inter++;
  jac[`${ids[a]}~${ids[b]}`] = +(inter / (A.size + B.size - inter)).toFixed(2);
}
out.jaccard_top5 = jac;
// Monte Carlo alrededor de E1
const wE1 = effectiveWeights(SCENARIOS[0].weights());
const fids = Object.keys(wE1);
const prob = runMonteCarlo({
  scores: fids.map((f) => fs[f]), weights: fids.map((f) => wE1[f]),
  eligible: Uint8Array.from(mask, (m) => (m === 0 ? 1 : 0)), kappa: 50, samples: 2000, topFrac: 0.1, seed: 20221018,
});
let robust = 0;
const robProv: Record<string, number> = {};
for (let i = 0; i < n; i++) if (prob[i] >= 0.9) {
  robust++;
  const p = meta.departamentos[ds.dep[i]].provincia;
  robProv[p] = (robProv[p] ?? 0) + 1;
}
out.montecarlo_E1 = {
  celdas_prob_ge_90: robust,
  por_provincia_pct: Object.fromEntries(Object.entries(robProv).sort((a, b) => b[1] - a[1]).map(([k, v]) => [k, +(v / robust * 100).toFixed(1)])),
};
console.log(JSON.stringify(out, null, 1));
