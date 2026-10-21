// Núcleo del análisis multicriterio: restricciones → factores 0–1 → agregación (WLC / OWA).

import { evaluate, type ValueFn } from "./valueFunctions";
import { FACTORS, RESTRICTIONS, type Cols, type Factor, type Restriction, type Weights } from "./criteria";

export interface WaterParams {
  activo: boolean;
  poblacion: number; // población objetivo P
  dotacion: number; // q, L/hab/día
  margen: number; // oferta/demanda mínima (1,5 en la literatura)
  fraccionAsignable: number; // α: fracción del caudal medio asignable a uso urbano
  aridezHumeda: number; // con P/ET0 ≥ este valor se asume oferta local suficiente
}

export const DEFAULT_WATER: WaterParams = {
  activo: true,
  poblacion: 500_000,
  dotacion: 200,
  margen: 1.5,
  fraccionAsignable: 0.2,
  aridezHumeda: 0.5,
};

/** Caudal requerido (m³/s) para P habitantes con dotación q y margen de seguridad. */
export const caudalRequerido = (w: WaterParams) => (w.poblacion * w.dotacion * w.margen) / 1000 / 86400;

export function factorScores(cols: Cols, n: number, fns: Record<string, ValueFn>): Record<string, Float32Array> {
  const out: Record<string, Float32Array> = {};
  for (const f of FACTORS) {
    if (!f.disponible) continue;
    out[f.id] = factorColumn(f, cols, n, fns[f.id] ?? f.fn);
  }
  return out;
}

function factorColumn(f: Factor, cols: Cols, n: number, fn?: ValueFn): Float32Array {
  const s = new Float32Array(n);
  if (f.score) for (let i = 0; i < n; i++) s[i] = f.score(cols, i, fn);
  else {
    const x = cols[f.column!];
    for (let i = 0; i < n; i++) s[i] = evaluate(fn!, x[i]);
  }
  return s;
}

function fails(r: Restriction, v: number): boolean {
  if (!Number.isFinite(v)) return false;
  return r.op === ">" ? v > r.umbral : r.op === "<" ? v < r.umbral : v >= r.umbral;
}

export const WATER_ID = "R13";

/**
 * Máscara de aptitud. `reason[i]` = 0 si la celda es apta; si no, 1 + índice de la
 * primera restricción que la excluye (orden de `restrictions`, luego R13 agua).
 */
export function computeMask(
  cols: Cols,
  n: number,
  restrictions: Restriction[] = RESTRICTIONS,
  water: WaterParams = DEFAULT_WATER,
): Uint8Array {
  const reason = new Uint8Array(n);
  const active = restrictions.map((r, k) => ({ r, k, x: cols[r.column] })).filter((a) => a.r.activo);
  const qReq = caudalRequerido(water);
  const waterCode = restrictions.length + 1;
  for (let i = 0; i < n; i++) {
    for (const a of active) {
      if (fails(a.r, a.x[i])) {
        reason[i] = a.k + 1;
        break;
      }
    }
    if (reason[i] === 0 && water.activo) {
      const qOk = cols.q_rio25[i] * water.fraccionAsignable >= qReq;
      const humid = cols.aridez[i] >= water.aridezHumeda;
      if (!qOk && !humid) reason[i] = waterCode;
    }
  }
  return reason;
}

export type Aggregation = { method: "wlc" } | { method: "owa"; orness: number };

/**
 * Agregación. WLC: Σ wᵢ·sᵢ. OWA ponderado (Yager 1996; Malczewski 2006) con cuantificador
 * RIM Q(r)=r^α, α=(1−orness)/orness: orness 0,5 equivale a WLC; <0,5 es más pesimista
 * (domina el peor criterio), >0,5 más optimista. Si falta un factor en la celda, se
 * renormaliza sobre los disponibles.
 */
export function aggregate(
  scores: Record<string, Float32Array>,
  weights: Weights,
  mask: Uint8Array,
  agg: Aggregation = { method: "wlc" },
): Float32Array {
  const ids = Object.keys(scores).filter((id) => (weights[id] ?? 0) > 0);
  const w = ids.map((id) => weights[id]);
  const S = ids.map((id) => scores[id]);
  const n = mask.length;
  const out = new Float32Array(n);
  const k = ids.length;
  const alpha = agg.method === "owa" ? (1 - agg.orness) / Math.max(agg.orness, 1e-6) : 1;
  const vals = new Float64Array(k);
  const ws = new Float64Array(k);
  const order = new Int32Array(k);
  for (let i = 0; i < n; i++) {
    if (mask[i] !== 0) {
      out[i] = NaN;
      continue;
    }
    let m = 0;
    let wsum = 0;
    for (let j = 0; j < k; j++) {
      const v = S[j][i];
      if (Number.isFinite(v)) {
        vals[m] = v;
        ws[m] = w[j];
        wsum += w[j];
        m++;
      }
    }
    if (m === 0 || wsum === 0) {
      out[i] = NaN;
      continue;
    }
    if (agg.method === "wlc" || Math.abs(alpha - 1) < 1e-9) {
      let s = 0;
      for (let j = 0; j < m; j++) s += vals[j] * ws[j];
      out[i] = s / wsum;
    } else {
      for (let j = 0; j < m; j++) order[j] = j;
      const ord = Array.from(order.subarray(0, m)).sort((a, b) => vals[b] - vals[a]);
      let cum = 0;
      let prevQ = 0;
      let s = 0;
      for (const j of ord) {
        cum += ws[j] / wsum;
        const q = Math.pow(Math.min(cum, 1), alpha);
        s += (q - prevQ) * vals[j];
        prevQ = q;
      }
      out[i] = s;
    }
  }
  return out;
}

/** Valor del percentil p (0–1) entre las celdas finitas. */
export function quantile(a: Float32Array, p: number): number {
  const v = Array.from(a).filter(Number.isFinite).sort((x, y) => x - y);
  if (!v.length) return NaN;
  return v[Math.min(v.length - 1, Math.max(0, Math.floor(p * (v.length - 1))))];
}
