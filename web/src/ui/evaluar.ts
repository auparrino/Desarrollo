// Evaluación de los mejores lugares: costos, costo-beneficio y proceso simulado, con el mismo
// cálculo para las tarjetas, la presentación, el CSV y la ficha.

import type { Dataset } from "../data/load";
import { costBenefit, type CBAResult, type Escenario } from "../model/benefits";
import { BENEFIT_PARAMS } from "../model/benefitParamsData";
import { estimateCosts, type CostResult } from "../model/costs";
import { compararEstrategias, type Comparacion } from "../model/estrategias";
import { cbaInput } from "../model/labor";
import type { PolicyId } from "../model/policies";
import type { Resumen } from "../model/proceso";
import { RECORRIDOS, emular, type Recorrido } from "../model/recorridos";
import type { Site } from "../model/sites";
import { UNIT_COSTS } from "../model/unitCostsData";
import { nearestPlace } from "./plainFacts";

export type Orden = "aptitud" | "economia" | "ambos";

export interface Evaluado {
  s: Site;
  nombre: string;
  aptitud: number; // puesto por aptitud (1 = mejor)
  c: CostResult;
  /** costo-beneficio con la llegada de gente que da el proceso simulado */
  cba: Record<Escenario, CBAResult>;
  /** costo-beneficio con la curva de ocupación internacional (antes de simular el proceso) */
  cbaCurva: Record<Escenario, CBAResult>;
  anual: number;
  cmp: Comparacion;
  /** proceso recomendado: el que suma gente más barato; si ninguno suma, el de mejor saldo */
  elegido: Resumen;
  /** recorrido real comparable más parecido a lo que da el proceso recomendado */
  parecido: { r: Recorrido; pob30: number } | null;
}

const ESC: Escenario[] = ["optimista", "base", "pesimista"];
export const anualDe = (b: CBAResult) => b.anual.productividad + b.anual.aglomeracion + b.anual.congestion + b.anual.polo;

export function siteName(s: Site, loc?: GeoJSON.FeatureCollection) {
  const near = nearestPlace(loc, s.center[0], s.center[1]);
  return near ? `Cerca de ${near.nombre}` : s.departamento;
}

/** Una tarjeta por lugar: se descartan regiones con el mismo nombre de referencia. */
export function uniqueByPlace(sites: Site[], loc?: GeoJSON.FeatureCollection): Site[] {
  const seen = new Set<string>();
  return sites.filter((s) => {
    const k = siteName(s, loc);
    if (seen.has(k)) return false;
    seen.add(k);
    return true;
  });
}

const comparables = () => RECORRIDOS.filter((x) => x.urbanizado && x.hasta >= 15).map((r) => ({ r, pob30: emular(r, 0, 30, 1.6).pob[30] }));

export function elegirProceso(cmp: Comparacion): Resumen {
  return cmp.poblar && cmp.marginal(cmp.poblar) < 50_000 ? cmp.poblar : cmp.mejor;
}

export function evaluarSitio(ds: Dataset, s: Site, nombre: string, aptitud: number, policy: PolicyId, poblacion: number, n = 250): Evaluado {
  const c = estimateCosts(policy, ds.col, s.best, s.provincia, { poblacion, densidad: 75 }, UNIT_COSTS);
  const inp = cbaInput(ds, policy, poblacion, c, s.best);
  const cba = Object.fromEntries(ESC.map((e) => [e, costBenefit(inp, BENEFIT_PARAMS, e)])) as Record<Escenario, CBAResult>;
  const cmp = compararEstrategias(ds, s.best, policy, poblacion, c, cba, n);
  const elegido = elegirProceso(cmp);
  // la cuenta económica se ajusta a la gente que llega con el proceso recomendado
  const llegan = policy === "polos" ? elegido.pob30[1] / 2.2 : elegido.pob30[1];
  const k = llegan / Math.max(cba.base.anual.poblacion, 1);
  const cbaProc = Object.fromEntries(ESC.map((e) => [e, costBenefit({ ...inp, escalaOcupacion: k }, BENEFIT_PARAMS, e)])) as Record<Escenario, CBAResult>;
  const p = elegido.pob30[1];
  const ref = comparables();
  const parecido = p > 0 && ref.length ? [...ref].sort((a, b) => Math.abs(Math.log(a.pob30 / p)) - Math.abs(Math.log(b.pob30 / p)))[0] : null;
  return { s, nombre, aptitud, c, cba: cbaProc, cbaCurva: cba, anual: anualDe(cbaProc.base), cmp, elegido, parecido };
}

export function evaluar(ds: Dataset, sites: Site[], loc: GeoJSON.FeatureCollection | undefined, policy: PolicyId, poblacion: number, max = 12): Evaluado[] {
  return uniqueByPlace(sites, loc).slice(0, max).map((s, k) => evaluarSitio(ds, s, siteName(s, loc), k + 1, policy, poblacion));
}

export function ordenar(xs: Evaluado[], o: Orden): Evaluado[] {
  if (o === "aptitud") return xs;
  const porPlata = [...xs].sort((a, b) => b.cba.base.social.van - a.cba.base.social.van);
  if (o === "economia") return porPlata;
  const rk = new Map(porPlata.map((x, k) => [x.s.rank, k + 1]));
  return [...xs].sort((a, b) => a.aptitud + rk.get(a.s.rank)! - (b.aptitud + rk.get(b.s.rank)!) || a.aptitud - b.aptitud);
}
