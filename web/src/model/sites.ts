// Agrupa las celdas mejor puntuadas en regiones candidatas contiguas (vecindad H3)
// y aplica la restricción de superficie mínima (R14: P / densidad bruta).

import { cellArea, cellToLatLng, gridDisk } from "h3-js";
import type { Dataset } from "../data/load";

export interface Site {
  rank: number;
  cells: number[];
  areaKm2: number;
  score: number; // media del puntaje
  best: number; // índice de la mejor celda
  robust?: number; // probabilidad Monte Carlo media
  provincia: string;
  departamento: string;
  center: [number, number]; // lon, lat
  requisitoOk: boolean;
}

export interface SiteParams {
  topFrac: number; // fracción superior de celdas aptas a considerar
  poblacion: number;
  densidad: number; // hab/ha brutos
  maxSites: number;
  requiereSuperficie?: boolean; // false: ciudades o pueblos existentes, sin superficie mínima
}

export function findSites(
  ds: Dataset,
  score: Float32Array,
  p: SiteParams,
  robust?: Float32Array | null,
): Site[] {
  const finite: number[] = [];
  for (let i = 0; i < ds.n; i++) if (Number.isFinite(score[i])) finite.push(i);
  if (!finite.length) return [];
  finite.sort((a, b) => score[b] - score[a]);
  const take = Math.max(1, Math.round(finite.length * p.topFrac));
  const sel = new Set(finite.slice(0, take));

  const parent = new Map<number, number>();
  const find = (x: number): number => {
    let r = x;
    while (parent.get(r)! !== r) r = parent.get(r)!;
    while (parent.get(x)! !== r) {
      const nx = parent.get(x)!;
      parent.set(x, r);
      x = nx;
    }
    return r;
  };
  for (const i of sel) parent.set(i, i);
  for (const i of sel) {
    for (const nb of gridDisk(ds.h3[i], 1)) {
      const j = ds.index.get(nb);
      if (j !== undefined && sel.has(j)) {
        const a = find(i);
        const b = find(j);
        if (a !== b) parent.set(a, b);
      }
    }
  }
  const groups = new Map<number, number[]>();
  for (const i of sel) {
    const r = find(i);
    if (!groups.has(r)) groups.set(r, []);
    groups.get(r)!.push(i);
  }

  const reqKm2 = p.poblacion / p.densidad / 100;
  const sites: Site[] = [];
  for (const cells of groups.values()) {
    let area = 0;
    let s = 0;
    let rb = 0;
    let best = cells[0];
    const depCount = new Map<number, number>();
    for (const i of cells) {
      // sólo la fracción urbanizable por pendiente cuenta como superficie útil
      area += cellArea(ds.h3[i], "km2") * (ds.col.frac_pend_ok[i] ?? 1);
      s += score[i];
      if (robust) rb += robust[i] || 0;
      if (score[i] > score[best]) best = i;
      depCount.set(ds.dep[i], (depCount.get(ds.dep[i]) ?? 0) + 1);
    }
    const depIdx = [...depCount.entries()].sort((a, b) => b[1] - a[1])[0][0];
    const d = ds.meta.departamentos[depIdx];
    const [lat, lng] = cellToLatLng(ds.h3[best]);
    sites.push({
      rank: 0,
      cells,
      areaKm2: area,
      score: s / cells.length,
      best,
      robust: robust ? rb / cells.length : undefined,
      provincia: d?.provincia ?? "",
      departamento: d?.nombre ?? "",
      center: [lng, lat],
      requisitoOk: p.requiereSuperficie === false || area >= reqKm2,
    });
  }
  // orden: primero las que cumplen superficie, luego puntaje medio ponderado por tamaño (saturado)
  sites.sort((a, b) => {
    if (a.requisitoOk !== b.requisitoOk) return a.requisitoOk ? -1 : 1;
    const ka = p.requiereSuperficie === false ? a.score : a.score * Math.min(1, a.areaKm2 / reqKm2);
    const kb = p.requiereSuperficie === false ? b.score : b.score * Math.min(1, b.areaKm2 / reqKm2);
    return kb - ka;
  });
  return sites.slice(0, p.maxSites).map((x, k) => ({ ...x, rank: k + 1 }));
}
