// Utilidades comunes de los scripts: carga de la grilla y elección del caso de cada instrumento
// con el mismo cálculo que la app (modo simple: mejor combinación de prioridades; orden combinado de aptitud y economía).
import { readFileSync } from "fs";
import type { Dataset } from "../src/data/load";
import { costBenefit, type CBAInput, type CBAResult, type Escenario } from "../src/model/benefits";
import { BENEFIT_PARAMS } from "../src/model/benefitParamsData";
import { estimateCosts, type CostResult } from "../src/model/costs";
import { cbaInput } from "../src/model/labor";
import { mejorCombinacion } from "../src/model/combinacion";
import { DEFAULT_WATER, computeMask, factorScores } from "../src/model/mcda";
import type { Policy } from "../src/model/policies";
import { findSites, type Site } from "../src/model/sites";
import { UNIT_COSTS } from "../src/model/unitCostsData";
import { nearestPlace } from "../src/ui/plainFacts";

export function cargar() {
  const meta = JSON.parse(readFileSync("public/data/cells.json", "utf8"));
  const buf = readFileSync("public/data/cells.bin");
  const ab = buf.buffer.slice(buf.byteOffset, buf.byteOffset + buf.byteLength);
  const col: Record<string, Float32Array> = {};
  for (const c of meta.columns) col[c.id] = new Float32Array(ab, c.offset, meta.n);
  const dep = new Uint16Array(ab.slice(meta.layout.dep_idx, meta.layout.dep_idx + meta.n * 2));
  const lo = new Uint32Array(ab, meta.layout.h3_lo, meta.n), hi = new Uint32Array(ab, meta.layout.h3_hi, meta.n);
  const h3: string[] = [], index = new Map<string, number>();
  for (let i = 0; i < meta.n; i++) { h3[i] = hi[i].toString(16) + lo[i].toString(16).padStart(8, "0"); index.set(h3[i], i); }
  const ds: Dataset = { n: meta.n, h3, dep, col, meta, index };
  const loc = JSON.parse(readFileSync("public/data/capas/localidades.geojson", "utf8"));
  const proyectos = JSON.parse(readFileSync("public/data/capas/proyectos.geojson", "utf8"));
  return { ds, loc, proyectos };
}

export const ESC: Escenario[] = ["optimista", "base", "pesimista"];

export interface Caso { s: Site; nombre: string; apt: number; eco: number; costos: CostResult; inp: CBAInput; r: Record<Escenario, CBAResult>; meta: number }

/** Primer lugar del orden combinado (aptitud + economía) entre los 12 mejores por aptitud. */
export function elegirCaso(ds: Dataset, loc: GeoJSON.FeatureCollection, pol: Policy, metaPob = pol.tamanos[Math.min(2, pol.tamanos.length - 1)]): Caso | null {
  const col = ds.col;
  const reason = computeMask(col, ds.n, pol.restrictions(), { ...DEFAULT_WATER, poblacion: metaPob, activo: pol.agua });
  const fs = factorScores(col, ds.n, {}, { poblacion: metaPob });
  // igual que el modo simple: la mejor combinación posible de prioridades
  const score = mejorCombinacion(fs, reason, pol.weights()).score;
  const sites = findSites(ds, score, { topFrac: pol.requiereSuperficie ? 0.02 : 0.1, poblacion: metaPob, densidad: 75, maxSites: 20, requiereSuperficie: pol.requiereSuperficie }, null);
  const seen = new Set<string>();
  const evs = sites
    .map((s) => ({ s, nombre: nearestPlace(loc, s.center[0], s.center[1])?.nombre ?? s.departamento }))
    .filter((x) => (seen.has(x.nombre) ? false : (seen.add(x.nombre), true)))
    .slice(0, 12)
    .map((x, k) => {
      const costos = estimateCosts(pol.id, col, x.s.best, x.s.provincia, { poblacion: metaPob, densidad: 75 }, UNIT_COSTS);
      const inp = cbaInput(ds, pol.id, metaPob, costos, x.s.best);
      const r = Object.fromEntries(ESC.map((e) => [e, costBenefit(inp, BENEFIT_PARAMS, e)])) as Record<Escenario, CBAResult>;
      return { ...x, apt: k + 1, eco: 0, costos, inp, r, meta: metaPob };
    });
  const porPlata = [...evs].sort((a, b) => b.r.base.social.van - a.r.base.social.van);
  porPlata.forEach((x, k) => (x.eco = k + 1));
  return [...evs].sort((a, b) => a.apt + a.eco - (b.apt + b.eco) || a.apt - b.apt)[0] ?? null;
}
