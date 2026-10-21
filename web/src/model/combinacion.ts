// La mejor combinación posible, sin pedirle a nadie que reparta puntos: agua, seguridad y
// clima se exigen siempre (pesos fijos); el resto de los temas se reparte al azar cubriendo
// de manera uniforme todas las combinaciones posibles (Dirichlet(1, …, 1) sobre los temas).
// Cada zona se mide por la fracción de combinaciones en las que queda entre las mejores:
// arriba quedan las que ganan con cualquier prioridad razonable, no con una sola.
// (Análisis de sensibilidad de pesos: Ligmann-Zielinska y Jankowski 2014; aceptabilidad
// estocástica multicriterio, SMAA: Lahdelma, Hokkanen y Salminen 1998.)

import { FACTORS, type GroupId, type Weights } from "./criteria";
import { dirichlet, mulberry32 } from "./montecarlo";
import { prefGroups, weightsFromPoints } from "./plain";

export interface Combinacion {
  /** fracción de combinaciones en las que la zona queda en el grupo superior (NaN si está excluida) */
  prob: Float32Array;
  /** puntaje para ordenar: robustez y, para desempatar, el puntaje con todos los temas por igual */
  score: Float32Array;
  /** pesos con todos los temas por igual (centro de todas las combinaciones) */
  centro: Weights;
  muestras: number;
  grupos: GroupId[];
}

export function mejorCombinacion(
  fs: Record<string, Float32Array>,
  reason: Uint8Array,
  base: Weights,
  muestras = 300,
  topFrac = 0.05,
  seed = 2026,
): Combinacion {
  const n = reason.length;
  const grupos = prefGroups(base);
  const igual = Object.fromEntries(grupos.map((g) => [g, 1]));
  const centro = weightsFromPoints(igual, base);
  // parte fija (agua, riesgo, clima y lo que no se reparte)
  const fijos = FACTORS.filter((f) => f.disponible && fs[f.id] && !grupos.includes(f.grupo as GroupId) && (base[f.id] ?? 0) > 0);
  const Sf = new Float32Array(n), Wf = new Float32Array(n);
  for (const f of fijos) {
    const x = fs[f.id], w = base[f.id];
    for (let i = 0; i < n; i++) if (x[i] === x[i]) { Sf[i] += w * x[i]; Wf[i] += w; }
  }
  // promedio de cada tema repartible (pesos internos de la literatura)
  const G = grupos.map((g) => {
    const fac = FACTORS.filter((f) => f.grupo === g && f.disponible && fs[f.id] && (base[f.id] ?? 0) > 0);
    const out = new Float32Array(n).fill(NaN);
    for (let i = 0; i < n; i++) {
      let s = 0, w = 0;
      for (const f of fac) { const v = fs[f.id][i]; if (v === v) { s += base[f.id] * v; w += base[f.id]; } }
      if (w > 0) out[i] = s / w;
    }
    return out;
  });
  const wPref = grupos.reduce((a, g) => a + FACTORS.filter((f) => f.grupo === g).reduce((s, f) => s + (base[f.id] ?? 0), 0), 0);
  const idx: number[] = [];
  for (let i = 0; i < n; i++) if (reason[i] === 0) idx.push(i);
  const m = idx.length;
  const count = new Uint32Array(n);
  const val = new Float32Array(m);
  const BINS = 2048;
  const hist = new Uint32Array(BINS);
  const rng = mulberry32(seed);
  const evalShares = (sh: number[], out: Float32Array) => {
    for (let j = 0; j < m; j++) {
      const i = idx[j];
      let s = Sf[i], w = Wf[i];
      for (let k = 0; k < G.length; k++) { const v = G[k][i]; if (v === v) { s += sh[k] * v; w += sh[k]; } }
      out[j] = w > 0 ? s / w : 0;
    }
  };
  for (let t = 0; t < muestras; t++) {
    const sh = dirichlet(grupos.map(() => 1), rng).map((x) => x * wPref);
    evalShares(sh, val);
    hist.fill(0);
    for (let j = 0; j < m; j++) hist[Math.min(BINS - 1, (val[j] * BINS) | 0)]++;
    const target = Math.max(1, Math.round(m * topFrac));
    let acc = 0, b = BINS - 1;
    for (; b >= 0; b--) { acc += hist[b]; if (acc >= target) break; }
    const thr = b / BINS;
    for (let j = 0; j < m; j++) if (val[j] >= thr) count[idx[j]]++;
  }
  const c = new Float32Array(m);
  evalShares(grupos.map(() => wPref / Math.max(grupos.length, 1)), c);
  const prob = new Float32Array(n).fill(NaN);
  const score = new Float32Array(n).fill(NaN);
  for (let j = 0; j < m; j++) {
    const i = idx[j];
    prob[i] = count[i] / muestras;
    score[i] = prob[i] + 0.01 * c[j];
  }
  return { prob, score, centro, muestras, grupos };
}
