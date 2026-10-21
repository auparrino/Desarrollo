// De dónde llegaría la gente y a qué ritmo, con la migración interna observada
// (docs/migracion-interna.md): matriz entre provincias del Censo 2022 (CEPAL/CELADE MIALC),
// matriz 2005–2010 con el AMBA separado, cambios de domicilio del RENAPER 2012–2022 y
// ritmos de crecimiento de lugares argentinos.
//
// La distancia casi no explica los flujos entre provincias (elasticidad ≈ −0,11): la gente
// sigue corredores ya establecidos (redes de parientes y conocidos). Por eso el origen se
// reparte según quién ya se muda hoy a la provincia de destino, no con un modelo de gravedad.

import mig from "./migracion.json";

type M = Record<string, Record<string, number>>;
interface Ritmo { lugar: string; periodo: string; crec_pct_anio: number | null; crec_abs_anio?: number | null; migrantes_netos_anio: number | null }
interface MigData {
  regiones: string[];
  matriz: M;
  matriz_2010_amba: { regiones: string[]; matriz: M };
  matriz_2010_provincias: { regiones: string[]; matriz: M };
  perfil: Record<string, unknown>;
  ritmos: Ritmo[];
  total_interprovincial_anio: number;
  total_interprovincial_detalle: Record<string, number>;
}
const D = mig as unknown as MigData;

const CABA = "Ciudad Autónoma de Buenos Aires";
const BA = "Buenos Aires";

/** Mudanzas por año: el censo cuenta personas en 5 años y subestima; el RENAPER cuenta cambios de domicilio. */
const RENAPER_INTERPROV = D.total_interprovincial_detalle.renaper_interprovincial_por_anio ?? 221_096;
const RENAPER_INTERDEP = D.total_interprovincial_detalle.renaper_interdepartamental_por_anio ?? 531_807;
const CENSO_INTERPROV = D.total_interprovincial_anio ?? 150_081;
/** Mudanzas entre departamentos de una misma provincia, por año. */
const INTRA = RENAPER_INTERDEP - RENAPER_INTERPROV;
/** Peso de los corredores existentes frente a la bolsa nacional de migrantes (una oportunidad nueva atrae también fuera de los corredores). */
const PESO_CORREDOR = 0.7;

export const PERFIL = {
  jovenes: Number(D.perfil.edad_15_34_pct ?? 47.1),
  jovenesNoMig: Number(D.perfil.edad_15_34_pct_no_migrantes ?? 32.5),
  estudio: Number(D.perfil.anios_estudio_25_39_migrantes ?? 13.5),
  estudioNoMig: Number(D.perfil.anios_estudio_25_39_no_migrantes ?? 11.6),
  ninos: Number(D.perfil.ninos_5_14_por_adulto_25_44_migrantes ?? 0.31),
  ninosNoMig: Number(D.perfil.ninos_5_14_por_adulto_25_44_no_migrantes ?? 0.54),
  retorno: Number(D.perfil.retorno_pct_de_recientes ?? 30.9),
  multiples: Number(D.perfil.multiples_pct_de_recientes ?? 15.9),
};

const poblacion = (prov: string) => D.regiones.reduce((a, o) => a + (D.matriz[o]?.[prov] ?? 0), 0);
const PAIS = D.regiones.reduce((a, p) => a + poblacion(p), 0);

/** Fracción del flujo bonaerense hacia `dest` que sale del conurbano (24 partidos), según 2005–2010. */
function fraccionConurbano(dest: string): number {
  const a = D.matriz_2010_amba.matriz, p = D.matriz_2010_provincias.matriz;
  const deAMBA = a.AMBA?.[dest] ?? 0;
  const deCABA = p[CABA]?.[dest] ?? 0;
  const deBA = p[BA]?.[dest] ?? 0;
  return deBA > 0 ? Math.min(1, Math.max(0, (deAMBA - deCABA) / deBA)) : 0.5;
}

export interface Origen { lugar: string; pct: number; personas: number; tipo: "misma" | "corredor" }

/**
 * Reparto de quienes llegarían a un lugar de la provincia `prov`.
 * 1. Una parte viene de la misma provincia: mudanzas entre departamentos (RENAPER) frente a
 *    las que llegan de otras provincias.
 * 2. El resto, según los corredores observados hacia esa provincia (Censo 2022) y, en menor
 *    medida, según cuánta gente sale de cada provincia hacia cualquier destino.
 * El AMBA se separa del resto de Buenos Aires con la matriz 2005–2010.
 */
export function origenObservado(prov: string, llegan: number): Origen[] {
  const m = D.matriz;
  const R = D.regiones;
  const dest = R.includes(prov) ? prov : prov.startsWith("Tierra del Fuego") ? R.find((r) => r.startsWith("Tierra del Fuego"))! : prov;
  const entran = R.filter((o) => o !== dest).reduce((a, o) => a + (m[o]?.[dest] ?? 0), 0) / 5;
  const entranAjust = entran * (RENAPER_INTERPROV / CENSO_INTERPROV);
  const intra = INTRA * (poblacion(dest) / PAIS);
  const misma = intra / (intra + entranAjust);

  const salen = (o: string) => R.filter((d) => d !== o).reduce((a, d) => a + (m[o]?.[d] ?? 0), 0);
  const totSalen = R.reduce((a, o) => a + (o === dest ? 0 : salen(o)), 0);
  const totEntran = entran * 5;
  const w = new Map<string, number>();
  for (const o of R) {
    if (o === dest) continue;
    const corr = totEntran > 0 ? (m[o]?.[dest] ?? 0) / totEntran : 0;
    const bolsa = totSalen > 0 ? salen(o) / totSalen : 0;
    w.set(o, PESO_CORREDOR * corr + (1 - PESO_CORREDOR) * bolsa);
  }
  // separar el AMBA (CABA + conurbano) del resto de Buenos Aires
  const out: Origen[] = [];
  const otras = 1 - misma;
  const fc = dest === BA ? 1 : fraccionConurbano(dest);
  const wBA = w.get(BA) ?? 0, wCABA = w.get(CABA) ?? 0;
  w.delete(BA);
  w.delete(CABA);
  const amba = wCABA + wBA * fc;
  const restoBA = wBA * (1 - fc);
  if (dest === BA) {
    // destino bonaerense fuera del AMBA: el AMBA es el mayor emisor (2005–2010: 140 mil hacia el resto de la provincia)
    const a10 = D.matriz_2010_amba.matriz;
    const tot10 = D.matriz_2010_amba.regiones.filter((o) => o !== "Resto de Buenos Aires").reduce((s, o) => s + (a10[o]?.["Resto de Buenos Aires"] ?? 0), 0);
    const sAMBA = tot10 > 0 ? (a10.AMBA?.["Resto de Buenos Aires"] ?? 0) / tot10 : 0.5;
    const resto = [...w.values()].reduce((a, x) => a + x, 0) + wCABA;
    out.push({ lugar: "AMBA", pct: 100 * otras * sAMBA, personas: 0, tipo: "corredor" });
    for (const [o, x] of w) out.push({ lugar: o, pct: (100 * otras * (1 - sAMBA) * x) / Math.max(resto, 1e-9), personas: 0, tipo: "corredor" });
    out.push({ lugar: "Resto de Buenos Aires (otros partidos)", pct: 100 * misma, personas: 0, tipo: "misma" });
  } else {
    out.push({ lugar: `${dest} (otros departamentos)`, pct: 100 * misma, personas: 0, tipo: "misma" });
    if (amba > 0) out.push({ lugar: "AMBA", pct: 100 * otras * amba, personas: 0, tipo: "corredor" });
    if (restoBA > 0) out.push({ lugar: "Resto de Buenos Aires", pct: 100 * otras * restoBA, personas: 0, tipo: "corredor" });
    for (const [o, x] of w) out.push({ lugar: o, pct: 100 * otras * x, personas: 0, tipo: "corredor" });
  }
  return out
    .map((x) => ({ ...x, personas: (llegan * x.pct) / 100 }))
    .sort((a, b) => b.pct - a.pct);
}

export interface Ritmo2 {
  porAnio: number;
  pctNacional: number; // % de todos los que cambian de provincia por año
  pctRegion: number; // crecimiento % anual de la región por la llegada
  maxNeto: { lugar: string; periodo: string; valor: number }; // mayor saldo migratorio neto de un departamento o ciudad
  maxTotal: { lugar: string; periodo: string; valor: number }; // mayor crecimiento total de un lugar que crece rápido
  veces: number; // porAnio / maxNeto
}

const sinProv = (r: Ritmo) => !/provincia|AMBA/.test(r.lugar);

/**
 * Compara el ritmo de llegada con lo observado. La referencia es el saldo migratorio neto
 * (llegadas menos salidas), no el crecimiento total, que en las ciudades grandes es sobre
 * todo por nacimientos (Córdoba Capital crece 15.000 por año con saldo migratorio negativo).
 */
export function ritmo(porAnio: number, poblacionRegion: number): Ritmo2 {
  const neto = D.ritmos.filter((r) => sinProv(r) && (r.migrantes_netos_anio ?? 0) > 0).sort((a, b) => (b.migrantes_netos_anio ?? 0) - (a.migrantes_netos_anio ?? 0))[0];
  const total = D.ritmos.filter((r) => sinProv(r) && (r.crec_pct_anio ?? 0) >= 2 && (r.crec_abs_anio ?? 0) > 0).sort((a, b) => (b.crec_abs_anio ?? 0) - (a.crec_abs_anio ?? 0))[0];
  const maxNeto = { lugar: neto?.lugar ?? "Pilar", periodo: neto?.periodo ?? "2005-2010", valor: neto?.migrantes_netos_anio ?? 2883 };
  return {
    porAnio,
    pctNacional: (100 * porAnio) / CENSO_INTERPROV,
    pctRegion: (100 * porAnio) / Math.max(poblacionRegion, 1),
    maxNeto,
    maxTotal: { lugar: total?.lugar ?? "Confluencia", periodo: total?.periodo ?? "2010-2022", valor: total?.crec_abs_anio ?? 9183 },
    veces: porAnio / maxNeto.valor,
  };
}

export const MIGRANTES_ANIO = CENSO_INTERPROV;
