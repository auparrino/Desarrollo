// Mercado laboral de un sitio: departamentos a ≤ 50 km, ponderados por sus puestos de trabajo.
// Evita que el límite de un departamento o de una provincia cambie el resultado de golpe
// (dos sitios vecinos comparten casi el mismo mercado de trabajo).

import { gridDisk } from "h3-js";
import type { Dataset } from "../data/load";
import { AMBA_PARTIDOS } from "./simulator";
import eco from "./economiaDep.json";
import type { CBAInput } from "./benefits";
import type { CostResult } from "./costs";
import type { PolicyId } from "./policies";

// H3 res 6: ~6,4 km entre centros vecinos → 8 anillos ≈ 50 km
const RINGS = 8;

export interface Mercado {
  salarioRel: number; // salario privado relativo al promedio nacional (1 = promedio), ponderado por puestos
  puestos: number; // puestos privados registrados en los departamentos a ≤ 50 km
  sectores: string[]; // actividad principal de los departamentos con más empleo
  empCrec: number; // crecimiento anual del empleo 2014–2022 (%), celda central
}

interface EcoDep { puestos: number; sal: number | null; sector: string | null; espec: string | null }
const ECO = (eco as { valores: Record<string, EcoDep> }).valores;
const depKey = (cod: string) => (cod.startsWith("02") ? "02000" : cod);

const cache = new WeakMap<Dataset, Map<number, Mercado>>();

/** Mercado de trabajo a ≤ 50 km: departamentos alcanzados, ponderados por sus puestos privados (CEP XXI 2022). */
export function mercadoLaboral(ds: Dataset, i: number): Mercado {
  let m = cache.get(ds);
  if (!m) cache.set(ds, (m = new Map()));
  const hit = m.get(i);
  if (hit) return hit;
  const deps = new Set<string>();
  for (const h of gridDisk(ds.h3[i], RINGS)) {
    const j = ds.index.get(h);
    if (j === undefined) continue;
    const cod = ds.meta.departamentos[ds.dep[j]]?.cod;
    if (cod) deps.add(depKey(cod));
  }
  let sw = 0, w = 0;
  const sect: { s: string; p: number }[] = [];
  for (const k of deps) {
    const e = ECO[k];
    if (!e) continue;
    if (e.sal !== null) { sw += e.sal * e.puestos; w += e.puestos; }
    if (e.sector) sect.push({ s: e.sector, p: e.puestos });
  }
  const bySector = new Map<string, number>();
  for (const x of sect) bySector.set(x.s, (bySector.get(x.s) ?? 0) + x.p);
  const sal = ds.col.salario_rel;
  const r: Mercado = {
    salarioRel: w > 0 ? sw / w : Number.isFinite(sal[i]) ? sal[i] : 1,
    puestos: [...deps].reduce((a, k) => a + (ECO[k]?.puestos ?? 0), 0),
    sectores: [...bySector.entries()].sort((a, b) => b[1] - a[1]).slice(0, 3).map(([s]) => s),
    empCrec: ds.col.emp_crec?.[i] ?? NaN,
  };
  m.set(i, r);
  return r;
}

/** Salario relativo del AMBA (CABA + 24 partidos), ponderado por puestos: es el mercado de trabajo de origen. */
export function salarioAMBA(): number {
  let sw = 0, w = 0;
  for (const k of ["02000", ...AMBA_PARTIDOS]) {
    const e = ECO[k];
    if (!e || e.sal === null) continue;
    sw += e.sal * e.puestos;
    w += e.puestos;
  }
  return w > 0 ? sw / w : 1.1;
}

/** Arma la entrada del costo-beneficio de un sitio con su mercado laboral. */
export function cbaInput(ds: Dataset, policy: PolicyId, poblacion: number, costos: CostResult, i: number): CBAInput {
  return {
    policy, poblacion, costos, c: ds.col, i,
    codProv: ds.meta.departamentos[ds.dep[i]]?.cod.slice(0, 2) ?? "",
    relDest: mercadoLaboral(ds, i).salarioRel,
    relAmba: salarioAMBA(),
  };
}

/**
 * Empleos que faltan para quienes llegan: los puestos actuales ya están ocupados por quienes
 * viven ahí; a los recién llegados los absorbe solo el crecimiento del empleo de la zona
 * (al ritmo 2014–2022, como máximo 3 % anual) y, en una capital, los puestos públicos trasladados.
 */
export function empleoFaltante(necesarios: number, m: Mercado, anios: number, publicos = 0, multPublico = 1) {
  const g = Math.min(Math.max(Number.isFinite(m.empCrec) ? m.empCrec : 0, 0), 3) / 100;
  const organico = m.puestos * ((1 + g) ** anios - 1) * 0.5; // la mitad del crecimiento lo toman los que ya viven ahí
  const traslado = publicos * (1 + multPublico);
  return { organico, traslado, faltan: Math.max(0, necesarios - organico - traslado) };
}
