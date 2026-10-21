// Ficha de decisión de un sitio: quién paga, cuánto por mandato, empleo necesario,
// de dónde vendría la gente, qué hace falta institucionalmente y qué puede salir mal.
// Todo sale de los datos de la grilla y de los resultados de costos y costo-beneficio.

import { cellToLatLng } from "h3-js";
import type { Dataset } from "../data/load";
import type { CBAResult } from "./benefits";
import type { CostResult, Range } from "./costs";
import type { PolicyId } from "./policies";
import { isAMBA } from "./simulator";
import proy from "./proyecciones.json";
import { mercadoLaboral } from "./labor";

// ---------------------------------------------------------------- quién paga
export type Pagador = "Nación" | "Provincia" | "Municipio" | "Hogares y empresas";

/** Responsable principal de cada rubro según las competencias habituales (a acordar en cada caso). */
const PAGA: Record<string, { quien: Pagador; por: string }> = {
  vivienda: { quien: "Hogares y empresas", por: "crédito hipotecario y desarrolladores, con programas nacionales y provinciales" },
  rehab: { quien: "Hogares y empresas", por: "propietarios, con líneas de crédito para refacción" },
  urbanizacion: { quien: "Municipio", por: "redes, calles y desagües (con fondos provinciales o nacionales)" },
  suelo: { quien: "Provincia", por: "compra, expropiación (Ley 21.499) o aporte de tierra fiscal" },
  escuelas: { quien: "Provincia", por: "educación y salud son provinciales desde la Ley 24.049 (1991)" },
  hospital: { quien: "Provincia", por: "educación y salud son provinciales desde la Ley 24.049 (1991)" },
  ruta: { quien: "Nación", por: "Vialidad Nacional (rutas nacionales) o provincial (accesos)" },
  at: { quien: "Nación", por: "transporte eléctrico federal (o concesión a transportistas)" },
  et: { quien: "Nación", por: "transporte eléctrico federal (o concesión a transportistas)" },
  acueducto: { quien: "Provincia", por: "empresa provincial de agua, con financiamiento del ENOHSA" },
  planta: { quien: "Provincia", por: "empresa provincial de agua, con financiamiento del ENOHSA" },
  oficinas: { quien: "Nación", por: "edificios de la Administración Pública Nacional" },
  mudanza_apn: { quien: "Nación", por: "traslado de agentes públicos nacionales" },
  mudanza: { quien: "Hogares y empresas", por: "las familias, con incentivos a la radicación" },
  parque: { quien: "Provincia", por: "provincia o municipio, con el Programa Nacional de Parques Industriales" },
};

export function quienPaga(c: CostResult): { quien: Pagador; usd: number; rubros: string[] }[] {
  const m = new Map<Pagador, { usd: number; rubros: string[] }>();
  for (const l of c.capital) {
    const q = PAGA[l.id]?.quien ?? "Provincia";
    const e = m.get(q) ?? { usd: 0, rubros: [] };
    e.usd += l.usd[1];
    e.rubros.push(l.rubro);
    m.set(q, e);
  }
  return [...m.entries()].map(([quien, e]) => ({ quien, ...e })).sort((a, b) => b.usd - a.usd);
}

// ---------------------------------------------------------------- por mandato
export interface Mandato {
  nombre: string;
  desde: number;
  hasta: number;
  inversion: number;
  poblacionAlFinal: number;
}

/** Inversión total por períodos de gobierno de 4 años (escenario "lo más probable"). */
export function porMandato(r: CBAResult): Mandato[] {
  const cr = r.cronograma;
  const bloques: [string, number, number][] = [
    ["1.er mandato", 0, 3],
    ["2.º mandato", 4, 7],
    ["3.er mandato", 8, 11],
    ["Después (años 13 a 30)", 12, 29],
  ];
  return bloques.map(([nombre, a, b]) => {
    const xs = cr.filter((x) => x.anio >= a && x.anio <= b);
    return {
      nombre, desde: a + 1, hasta: b + 1,
      inversion: xs.reduce((s, x) => s + x.inversion, 0),
      poblacionAlFinal: xs.length ? xs[xs.length - 1].poblacion : 0,
    };
  });
}

// ---------------------------------------------------------------- empleo
export interface Empleo {
  necesarios: number; // ocupados que necesita la población que llega (año 30, escenario base)
  existentes: number; // puestos privados registrados en los departamentos a ≤ 50 km (CEP XXI 2022)
  sectores: string[]; // actividad principal de la zona
  crecimiento: number; // % anual 2014–2022
  proyectos: { nombre: string; tipo: string; km: number }[];
}

const TASA_EMPLEO = 0.45; // ocupados / población (EPH-INDEC; benefitParams.tasa_empleo)

const km = (a: [number, number], b: [number, number]) => {
  const R = 6371, rad = Math.PI / 180;
  const dLat = (b[1] - a[1]) * rad, dLon = (b[0] - a[0]) * rad;
  const h = Math.sin(dLat / 2) ** 2 + Math.cos(a[1] * rad) * Math.cos(b[1] * rad) * Math.sin(dLon / 2) ** 2;
  return 2 * R * Math.asin(Math.sqrt(h));
};

export function empleo(ds: Dataset, i: number, policy: PolicyId, r: CBAResult, proyectos?: GeoJSON.FeatureCollection): Empleo {
  const [lat, lng] = cellToLatLng(ds.h3[i]);
  const here: [number, number] = [lng, lat];
  const near = (proyectos?.features ?? [])
    .filter((f) => f.geometry?.type === "Point")
    .map((f) => {
      const p = f.properties ?? {};
      return { nombre: String(p.nombre ?? p.name ?? "Proyecto"), tipo: String(p.tipo ?? "").replace(/_/g, " "), km: km(here, (f.geometry as GeoJSON.Point).coordinates as [number, number]) };
    })
    .filter((x) => x.km <= 100)
    .sort((a, b) => a.km - b.km)
    .slice(0, 5);
  return {
    necesarios: policy === "polos" ? r.anual.poblacion : r.anual.poblacion * TASA_EMPLEO,
    existentes: mercadoLaboral(ds, i).puestos,
    sectores: mercadoLaboral(ds, i).sectores,
    crecimiento: ds.col.emp_crec?.[i] ?? NaN,
    proyectos: near,
  };
}

// ---------------------------------------------------------------- de dónde viene la gente
const origenCache = new WeakMap<Dataset, { prov: string; pob: number; c: [number, number] }[]>();

function provincias(ds: Dataset) {
  const hit = origenCache.get(ds);
  if (hit) return hit;
  const acc = new Map<string, { pob: number; x: number; y: number }>();
  const pob = ds.col.pob;
  for (let i = 0; i < ds.n; i++) {
    if (!(pob[i] > 0)) continue;
    const d = ds.meta.departamentos[ds.dep[i]];
    if (!d) continue;
    const k = isAMBA(d.cod) ? "AMBA" : d.provincia === "Buenos Aires" ? "Resto de Buenos Aires" : d.provincia;
    const [lat, lng] = cellToLatLng(ds.h3[i]);
    const e = acc.get(k) ?? { pob: 0, x: 0, y: 0 };
    e.pob += pob[i]; e.x += lng * pob[i]; e.y += lat * pob[i];
    acc.set(k, e);
  }
  const r = [...acc.entries()].map(([prov, e]) => ({ prov, pob: e.pob, c: [e.x / e.pob, e.y / e.pob] as [number, number] }));
  origenCache.set(ds, r);
  return r;
}

/**
 * Origen probable de quienes se mudan: modelo de gravedad clásico (Zipf 1946; Lee 1966),
 * proporcional a la población de origen e inverso a la distancia. Es orientativo: no está
 * calibrado con datos de migración interna del Censo 2022.
 */
export function origen(ds: Dataset, i: number): { lugar: string; pct: number }[] {
  const [lat, lng] = cellToLatLng(ds.h3[i]);
  const here: [number, number] = [lng, lat];
  const xs = provincias(ds).map((p) => ({ lugar: p.prov, w: p.pob / Math.max(km(here, p.c), 50) }));
  const tot = xs.reduce((a, x) => a + x.w, 0);
  return xs.map((x) => ({ lugar: x.lugar, pct: (100 * x.w) / tot })).sort((a, b) => b.pct - a.pct).slice(0, 5);
}

// ---------------------------------------------------------------- hoja de ruta
export interface Paso {
  que: string;
  norma: string;
  quien: string;
  aplica: boolean;
  nota?: string;
}

export function hojaDeRuta(ds: Dataset, i: number, policy: PolicyId, provincia: string): Paso[] {
  const c = ds.col;
  const fiscal = c.pct_fiscal_est?.[i];
  const conoc = c.frac_fiscal_conocida?.[i];
  const dCom = c.d_comunidad?.[i];
  const ap = (c.frac_ap_uso_multiple?.[i] ?? 0) + (c.frac_ap_estricta?.[i] ?? 0);
  const nueva = policy === "ciudad_nueva" || policy === "capital";
  const pasos: Paso[] = [
    {
      que: "Ley del Congreso que declare la nueva Capital, con cesión previa del territorio por la Legislatura provincial",
      norma: "Constitución Nacional, art. 3 (antecedente: Ley 23.512 de 1987, traslado a Viedma–Carmen de Patagones, abandonado en 1989)",
      quien: `Congreso de la Nación y Legislatura de ${provincia}`,
      aplica: policy === "capital",
    },
    {
      que: "Crear el municipio o ampliar el ejido urbano",
      norma: "Constitución y ley orgánica de municipios de la provincia",
      quien: `Legislatura de ${provincia}`,
      aplica: nueva,
    },
    {
      que: "Conseguir la tierra",
      norma: "Ley 21.499 de expropiaciones (requiere ley que declare la utilidad pública) o cesión de tierra fiscal",
      quien: "Provincia y Nación (AABE si hay inmuebles nacionales)",
      aplica: nueva || policy === "polos" || policy === "pueblos",
      nota: Number.isFinite(fiscal)
        ? `Tierra fiscal estimada en el departamento: ${Math.round(fiscal)} %${conoc !== undefined && conoc < 0.5 ? " (dato con poca cobertura)" : ""}. ${fiscal < 20 ? "Lo más probable es que haya que comprar o expropiar." : "Hay margen para usar tierra pública."}`
        : undefined,
    },
    {
      que: "Consulta previa, libre e informada a comunidades indígenas",
      norma: "Convenio 169 de la OIT (Ley 24.071) y Constitución Nacional, art. 75 inc. 17",
      quien: "Nación y provincia, con las comunidades",
      aplica: Number.isFinite(dCom) && dCom < 30,
      nota: Number.isFinite(dCom) ? `Comunidad registrada más cercana: a ${Math.round(dCom)} km.` : undefined,
    },
    {
      que: "Evaluación de impacto ambiental y audiencia pública",
      norma: "Ley General del Ambiente 25.675 (arts. 11 a 13 y 20) y normas provinciales",
      quien: "Autoridad ambiental provincial",
      aplica: true,
    },
    {
      que: "Compatibilizar con áreas protegidas y bosques nativos",
      norma: "Ley 26.331 de bosques nativos (ordenamiento provincial) y ley de cada área protegida",
      quien: "Provincia y Administración de Parques Nacionales",
      aplica: ap > 0.05,
      nota: ap > 0.05 ? `El ${Math.round(ap * 100)} % de la zona está dentro de un área protegida de uso múltiple.` : undefined,
    },
    {
      que: "Convenio Nación–provincia–municipio de financiamiento y obras",
      norma: "Convenio marco y presupuesto plurianual (Ley 24.156 de Administración Financiera)",
      quien: "Ministerios de Economía e Infraestructura, gobernación e intendencia",
      aplica: true,
    },
    {
      que: "Régimen de promoción para las empresas del polo",
      norma: "Ley 27.742 (RIGI, inversiones de más de USD 200 millones) y regímenes provinciales de promoción industrial",
      quien: "Ministerio de Economía y provincia",
      aplica: policy === "polos",
    },
    {
      que: "Traslado de organismos y agentes públicos",
      norma: "Decreto del Poder Ejecutivo y acuerdos con los gremios estatales",
      quien: "Jefatura de Gabinete",
      aplica: policy === "capital",
    },
  ];
  return pasos.filter((p) => p.aplica);
}

// ---------------------------------------------------------------- riesgos
export interface Riesgo {
  nivel: "alto" | "medio";
  que: string;
  mitigacion: string;
}

export function riesgos(ds: Dataset, i: number, policy: PolicyId, poblacion: number, r: Record<string, CBAResult>, emp: Empleo): Riesgo[] {
  const c = ds.col;
  const out: Riesgo[] = [];
  const ratio = emp.necesarios / Math.max(emp.existentes, 1);
  if (policy !== "polos" && (ratio > 0.3 || emp.crecimiento < 0))
    out.push({
      nivel: ratio > 1 ? "alto" : "medio",
      que: `Falta de trabajo: harían falta unos ${fmt(emp.necesarios)} empleos y hoy hay ${fmt(emp.existentes)} puestos privados en 50 km${emp.crecimiento < 0 ? ", con empleo en baja" : ""}.`,
      mitigacion: "Asegurar antes de construir una empresa ancla, un organismo público o un polo productivo; liberar cada etapa de viviendas solo si hay empleo para la anterior.",
    });
  const pes = r.pesimista;
  if (pes && pes.social.van < 0)
    out.push({
      nivel: "alto",
      que: `Que llegue poca gente: si se ocupa como las ciudades nuevas egipcias (~12 %), el saldo para el país es de ${musd(pes.social.van)}.`,
      mitigacion: "Construir por etapas de 20.000 a 50.000 habitantes, empezando por la conexión y el empleo; no adelantar viviendas a la demanda.",
    });
  const necesitaM3s = (poblacion * 200) / 1000 / 86400;
  const q95 = c.q95_rio25?.[i] ?? 0;
  if (policy !== "polos" && q95 > 0 && q95 * 0.5 < necesitaM3s * 3)
    out.push({ nivel: "medio", que: `Agua justa: el río más cercano tiene en sequía ${q95.toLocaleString("es-AR", { maximumFractionDigits: 1 })} m³/s y la ciudad usaría ${necesitaM3s.toLocaleString("es-AR", { maximumFractionDigits: 2 })} m³/s.`, mitigacion: "Estudio hidrológico, acuerdo de cuenca con las provincias aguas abajo y reservas de agua." });
  if ((c.as_prob?.[i] ?? 0) > 0.4)
    out.push({ nivel: "medio", que: `Arsénico en el agua subterránea (probabilidad ${Math.round(c.as_prob[i] * 100)} %).`, mitigacion: "Abastecer con agua superficial o plantas de abatimiento de arsénico (Código Alimentario: 10 µg/L)." });
  if ((c.pga475?.[i] ?? 0) >= 0.15)
    out.push({ nivel: c.pga475[i] >= 0.3 ? "alto" : "medio", que: `Zona sísmica (aceleración ${c.pga475[i].toLocaleString("es-AR", { maximumFractionDigits: 2 })} g en 475 años).`, mitigacion: "Diseño sismorresistente obligatorio (INPRES-CIRSOC 103) y control de obra: encarece la estructura." });
  if ((c.frac_inund100?.[i] ?? 0) > 0.02)
    out.push({ nivel: "medio", que: `Parte de la zona se inunda en una crecida de 100 años (${Math.round(c.frac_inund100[i] * 100)} %).`, mitigacion: "Dejar esas tierras como parques y prohibir allí la construcción en el código urbano." });
  if ((c.t_max_cal?.[i] ?? 0) >= 32 || (c.t_min_fri?.[i] ?? 0) <= -3)
    out.push({ nivel: "medio", que: c.t_max_cal[i] >= 32 ? `Calor fuerte en verano (máximas medias de ${Math.round(c.t_max_cal[i])} °C).` : `Frío fuerte en invierno (mínimas medias de ${Math.round(c.t_min_fri[i])} °C).`, mitigacion: "Normas de eficiencia energética en la construcción (IRAM 11900/11605) y arbolado; prever el costo de calefacción o refrigeración." });
  if ((c.t_ciudad?.[i] ?? 0) > 60)
    out.push({ nivel: "medio", que: `Aislamiento: a ${Math.round(c.t_ciudad[i])} minutos de la ciudad más cercana.`, mitigacion: "Garantizar desde el inicio salud, educación y transporte; sin eso las familias no se quedan." });
  if ((c.pct_extranjero?.[i] ?? 0) > 15)
    out.push({ nivel: "medio", que: `Mucha tierra rural en manos extranjeras (${Math.round(c.pct_extranjero[i])} %).`, mitigacion: "Revisar titularidad antes de anunciar la zona: el anuncio dispara la especulación." });
  out.push({ nivel: "medio", que: "Especulación con la tierra apenas se conozca el lugar.", mitigacion: "Comprar o reservar la tierra antes del anuncio y cobrar la valorización (contribución por mejoras)." });
  return out.sort((a, b) => (a.nivel === b.nivel ? 0 : a.nivel === "alto" ? -1 : 1));
}

// ---------------------------------------------------------------- no hacer nada
export interface SinPolitica {
  pais: number; // crecimiento del país 2022 → 2035 (personas)
  amba: number; // crecimiento del AMBA 2022 → 2035
  dondeCrece: { lugar: string; delta: number }[];
  costoAbsorber: number; // vivienda y servicios para el crecimiento previsto, donde ocurra (USD)
}

/** Qué pasa si no se hace nada, según las estimaciones oficiales del INDEC a 2035. */
export function sinPolitica(costoComunPorHab: number): SinPolitica {
  const R = (proy as { pais: Record<string, number>; regiones: Record<string, Record<string, number>> });
  const d = (x: Record<string, number>) => x["2035"] - x["2022"];
  const regs = Object.entries(R.regiones).map(([lugar, x]) => ({ lugar, delta: d(x) }));
  const pais = d(R.pais);
  return {
    pais,
    amba: d(R.regiones.AMBA),
    dondeCrece: regs.filter((x) => x.lugar !== "AMBA").sort((a, b) => b.delta - a.delta).slice(0, 4),
    costoAbsorber: Math.max(pais, 0) * costoComunPorHab,
  };
}

// ---------------------------------------------------------------- utilidades
const fmt = (n: number) => (Number.isFinite(n) ? Math.round(n).toLocaleString("es-AR") : "s/d");
export const musd = (v: number) => {
  const a = Math.abs(v);
  const s = a >= 1e9 ? `${(a / 1e9).toLocaleString("es-AR", { maximumFractionDigits: 1 })} mil millones` : `${Math.round(a / 1e6).toLocaleString("es-AR")} millones`;
  return `${v < 0 ? "−" : ""}USD ${s}`;
};
export const central = (r: Range) => r[1];
