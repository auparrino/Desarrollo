// Simulador de redistribución: requerimientos físicos de los destinos y efecto sobre la
// concentración del sistema urbano. Todas las cifras son derivaciones aritméticas [D]
// de parámetros editables; las referencias de cada parámetro están en la UI.

// 24 partidos del Gran Buenos Aires (INDEC, "¿Qué es el Gran Buenos Aires?", 2003) + CABA.
export const AMBA_PARTIDOS = [
  "06028", "06035", "06091", "06260", "06270", "06274", "06371", "06408", "06410", "06412", "06427", "06434",
  "06490", "06515", "06539", "06560", "06568", "06658", "06749", "06756", "06760", "06805", "06840", "06861",
];
export const isAMBA = (cod: string) => cod.startsWith("02") || AMBA_PARTIDOS.includes(cod);

export interface SimParams {
  poblacionPorDestino: number[];
  densidad: number; // hab/ha brutos
  dotacion: number; // L/hab/día
  personasPorVivienda: number;
  consumoElectrico: number; // kWh/hab/año
  origenAMBA: boolean; // la población proviene del AMBA (si no, del resto del país proporcionalmente)
}

export interface Destino {
  nombre: string;
  provincia: string;
  hdd: number;
  cdd: number;
  qRio: number;
}

export interface DestinoResultado extends Destino {
  poblacion: number;
  superficieKm2: number;
  aguaM3s: number;
  usoCaudalPct: number;
  viviendas: number;
  energiaGWh: number;
  potenciaMediaMW: number;
  indiceClimatico: number; // (HDD+1,5·CDD) relativo a la media nacional ponderada por población
}

export function requerimientos(d: Destino, P: number, s: SimParams, climaRef: number): DestinoResultado {
  const agua = (P * s.dotacion) / 1000 / 86400;
  const energiaKWh = P * s.consumoElectrico;
  return {
    ...d,
    poblacion: P,
    superficieKm2: P / s.densidad / 100,
    aguaM3s: agua,
    usoCaudalPct: d.qRio > 0 ? (100 * agua) / d.qRio : Infinity,
    viviendas: P / s.personasPorVivienda,
    energiaGWh: energiaKWh / 1e6,
    potenciaMediaMW: energiaKWh / 8760 / 1000,
    indiceClimatico: (d.hdd + 1.5 * d.cdd) / climaRef,
  };
}

/** Índice de Herfindahl–Hirschman sobre participaciones (0–1). */
export const hhi = (pops: number[]) => {
  const t = pops.reduce((a, b) => a + b, 0);
  return pops.reduce((a, p) => a + (p / t) ** 2, 0);
};

export interface Concentracion {
  total: number;
  amba: number;
  participacionAMBA: number;
  hhiProvincial: number;
  provincias: { nombre: string; antes: number; despues: number }[];
}

export function concentracion(
  deps: { cod: string; provincia: string; pob: number }[],
  destinos: { provincia: string; poblacion: number }[],
  origenAMBA: boolean,
): { antes: Concentracion; despues: Concentracion } {
  const total = deps.reduce((a, d) => a + d.pob, 0);
  const amba = deps.filter((d) => isAMBA(d.cod)).reduce((a, d) => a + d.pob, 0);
  const mover = destinos.reduce((a, d) => a + d.poblacion, 0);
  const prov = new Map<string, number>();
  const provAMBA = new Map<string, number>();
  for (const d of deps) {
    prov.set(d.provincia, (prov.get(d.provincia) ?? 0) + d.pob);
    if (isAMBA(d.cod)) provAMBA.set(d.provincia, (provAMBA.get(d.provincia) ?? 0) + d.pob);
  }
  const after = new Map(prov);
  if (origenAMBA) {
    for (const [p, v] of provAMBA) after.set(p, after.get(p)! - (mover * v) / amba);
  } else {
    for (const [p, v] of prov) after.set(p, after.get(p)! - (mover * v) / total);
  }
  for (const d of destinos) after.set(d.provincia, (after.get(d.provincia) ?? 0) + d.poblacion);
  const ambaAfter = origenAMBA ? amba - mover : amba - (mover * amba) / total;
  const mk = (m: Map<string, number>, a: number): Concentracion => ({
    total,
    amba: a,
    participacionAMBA: a / total,
    hhiProvincial: hhi([...m.values()]),
    provincias: [],
  });
  const antes = mk(prov, amba);
  const despues = mk(after, ambaAfter);
  const rows = [...prov.keys()].map((k) => ({ nombre: k, antes: prov.get(k)!, despues: after.get(k)! }));
  rows.sort((a, b) => b.antes - a.antes);
  antes.provincias = despues.provincias = rows;
  return { antes, despues };
}
