// Análisis costo-beneficio simplificado por instrumento: flujo anual de costos y
// beneficios durante el horizonte, descontado a la tasa social de descuento.
// Parámetros con fuente en benefitParams.json (docs/beneficios-parametros.md).
//
// Dos miradas, que no se suman entre sí:
//  - Social: beneficios netos para el país (vivienda, diferencial de productividad,
//    aglomeración, congestión evitada en el AMBA). La producción de quien se muda NO
//    cuenta entera: solo la diferencia con lo que habría producido donde estaba.
//  - Fiscal: recaudación incremental + captura de plusvalía − operación.

import type { Cols } from "./criteria";
import type { CostResult, Range } from "./costs";
import type { PolicyId } from "./policies";

export interface ParamItem {
  nombre: string;
  unidad: string;
  bajo: number | null;
  central: number | null;
  alto: number | null;
  fuente: string;
  evidencia: string;
}
export interface Curve {
  anios: number[];
  fraccion: number[];
  fuente?: string;
}
export interface BenefitParams {
  fecha_base: string;
  items: Record<string, ParamItem | Curve | Record<string, number>>;
  pbg_pc_provincia?: Record<string, number>;
}

export type Escenario = "optimista" | "base" | "pesimista";

export interface CBAInput {
  policy: PolicyId;
  poblacion: number; // meta (habitantes, o empleos en "polos")
  costos: CostResult;
  c: Cols;
  i: number;
  codProv: string;
  origenAMBA: boolean;
}

export interface CBAComponent {
  id: string;
  nombre: string;
  vp: number; // valor presente (USD)
  nota: string;
}
export interface CBAResult {
  escenario: Escenario;
  horizonte: number;
  tasa: number;
  vpCostos: number;
  social: { componentes: CBAComponent[]; vpBeneficios: number; van: number; bc: number; tir: number | null };
  fiscal: { componentes: CBAComponent[]; vp: number; van: number; recupero: number | null };
  poblacionFinal: number;
  serie: { anio: number; poblacion: number; costo: number; beneficio: number }[];
}

const num = (p: BenefitParams, id: string, which: "bajo" | "central" | "alto" = "central"): number | null => {
  const it = p.items[id] as ParamItem | undefined;
  return it && typeof it === "object" && "central" in it ? (it[which] ?? it.central) : null;
};

function curveAt(cv: Curve | undefined, t: number): number {
  if (!cv) return Math.min(1, t / 20);
  const { anios: x, fraccion: y } = cv;
  if (t <= x[0]) return y[0];
  for (let k = 1; k < x.length; k++) if (t <= x[k]) return y[k - 1] + ((y[k] - y[k - 1]) * (t - x[k - 1])) / (x[k] - x[k - 1]);
  return y[y.length - 1];
}

/** TIR por bisección sobre el flujo neto; null si no cambia de signo. */
function irr(flows: number[]): number | null {
  const npv = (r: number) => flows.reduce((a, f, t) => a + f / (1 + r) ** t, 0);
  let lo = -0.9, hi = 1.0;
  if (npv(lo) * npv(hi) > 0) return null;
  for (let k = 0; k < 100; k++) {
    const m = (lo + hi) / 2;
    if (npv(lo) * npv(m) <= 0) hi = m;
    else lo = m;
  }
  return (lo + hi) / 2;
}

const TRONCAL = new Set(["ruta", "at", "et", "acueducto", "planta", "oficinas", "parque", "suelo"]);

export function costBenefit(inp: CBAInput, p: BenefitParams, esc: Escenario): CBAResult {
  const r = num(p, "tasa_descuento") ?? 0.12;
  const H = Math.round(num(p, "horizonte_anios") ?? 30);
  const cv = p.items[`ocupacion_${esc}`] as Curve | undefined;
  const P = inp.poblacion;
  const polos = inp.policy === "polos";
  const empleoRate = num(p, "tasa_empleo") ?? 0.42;
  const pbgProv = p.pbg_pc_provincia ?? {};
  const pbgDest = pbgProv[inp.codProv] ?? null;
  const pbgOrig = inp.origenAMBA ? (pbgProv["02"] && pbgProv["06"] ? (pbgProv["02"] * 3.1 + pbgProv["06"] * 10.9) / 14 : null) : null;
  const elast = num(p, "elasticidad_aglomeracion") ?? 0;
  const alquiler = num(p, "alquiler_vivienda_60m2_usd_mes");
  const congest = inp.origenAMBA ? num(p, "costo_marginal_hab_amba") : null;
  const presion = num(p, "presion_tributaria") ?? 0;
  const lote = num(p, "valor_lote_urbano_m2_intermedia");
  const captura = num(p, "captura_plusvalia_frac") ?? 0;
  const mult = polos ? num(p, "multiplicador_transable") ?? 1 : inp.policy === "capital" ? num(p, "multiplicador_publico") ?? 1 : 1;
  const pph = 2.86;

  // costos: troncales en los primeros 5 años; el resto acompaña la llegada de población
  const troncal = inp.costos.capital.filter((l) => TRONCAL.has(l.id)).reduce((a, l) => a + l.usd[1], 0);
  const resto = inp.costos.totalCapital[1] - troncal;
  const opAnualPorHab = inp.costos.totalOperacion[1] / Math.max(P, 1);

  const serie: CBAResult["serie"] = [];
  const comp: Record<string, number> = { vivienda: 0, productividad: 0, aglomeracion: 0, congestion: 0, empleo_indirecto: 0 };
  const fcomp: Record<string, number> = { impuestos: 0, plusvalia: 0, operacion: 0 };
  let vpCostos = 0;
  const flows: number[] = [];
  const fiscalFlows: number[] = [];
  let prevN = 0;
  for (let t = 0; t <= H; t++) {
    const N = P * curveAt(cv, t);
    const dN = Math.max(0, N - prevN);
    prevN = N;
    const d = (1 + r) ** -t;
    let costo = (t < 5 ? troncal / 5 : 0) + resto * (dN / P);
    costo += opAnualPorHab * N;
    vpCostos += costo * d;

    // beneficios sociales
    const workers = polos ? N : N * empleoRate;
    let b = 0;
    let produc = 0; // valor agregado incremental (base imponible)
    if (!polos && alquiler) {
      const v = (N / pph) * alquiler * 12; // valor de los servicios de vivienda nuevos
      comp.vivienda += v * d; b += v;
    }
    if (pbgDest !== null && pbgOrig !== null && !polos) {
      const v = N * (pbgDest - pbgOrig); // diferencial de productividad (puede ser negativo)
      comp.productividad += v * d; b += v; produc += v;
    }
    if (elast && pbgDest !== null) {
      // aglomeración: elasticidad × crecimiento relativo de la población regional × producto regional
      const base = Math.max(inp.c.pob_50km[inp.i], 1);
      const v = elast * Math.log((base + N) / base) * pbgDest * base;
      comp.aglomeracion += v * d; b += v; produc += v;
    }
    if (congest && !polos) {
      const v = N * congest;
      comp.congestion += v * d; b += v;
    }
    if (polos && pbgDest !== null) {
      // empleos directos e indirectos del polo; se supone que la mitad es actividad nueva para el país
      // (el resto se relocaliza desde otras regiones: Kline & Moretti 2014)
      const vaPorEmpleo = pbgDest / Math.max(empleoRate, 0.01);
      const v = workers * mult * vaPorEmpleo * 0.5;
      comp.empleo_indirecto += v * d; b += v; produc += v;
    }
    // fiscal
    let f = 0;
    if (produc > 0) {
      const v = presion * produc;
      fcomp.impuestos += v * d; f += v;
    }
    if (lote && !polos && dN > 0) {
      const v = (dN / pph) * 300 * lote * captura; // lotes de 300 m²
      fcomp.plusvalia += v * d; f += v;
    }
    const opv = opAnualPorHab * N;
    fcomp.operacion -= opv * d; f -= opv;
    fiscalFlows.push(f - (t < 5 ? troncal / 5 : 0) - resto * (dN / P));
    flows.push(b - costo);
    serie.push({ anio: t, poblacion: N, costo, beneficio: b });
  }
  const NOTE: Record<string, string> = {
    vivienda: "valor locativo de las viviendas nuevas (alquiler de mercado)",
    productividad: "diferencia de PBG per cápita entre destino y origen (puede restar)",
    aglomeracion: "mayor productividad de la región receptora al crecer (elasticidad de aglomeración)",
    congestion: "costo de congestión evitado en el AMBA por cada habitante que no suma",
    empleo_indirecto: "valor agregado de empleos directos e indirectos (multiplicador local); 50 % se considera actividad nueva para el país",
    impuestos: "recaudación sobre el valor agregado incremental",
    plusvalia: "captura de plusvalía al urbanizar suelo rural",
    operacion: "costo de operación de servicios y mantenimiento",
  };
  const NAME: Record<string, string> = {
    vivienda: "Servicios de vivienda", productividad: "Diferencial de productividad", aglomeracion: "Economías de aglomeración",
    congestion: "Congestión evitada en el AMBA", empleo_indirecto: "Producción del polo", impuestos: "Impuestos",
    plusvalia: "Captura de plusvalía", operacion: "Operación y mantenimiento",
  };
  const mk = (o: Record<string, number>) =>
    Object.entries(o).filter(([, v]) => v !== 0).map(([id, vp]) => ({ id, nombre: NAME[id], vp, nota: NOTE[id] }));
  const social = mk(comp);
  const vpB = social.reduce((a, x) => a + x.vp, 0);
  const fiscal = mk(fcomp);
  const vpCapital = vpCostos - fcomp.operacion * -1; // costos de capital descontados
  const vpF = fiscal.reduce((a, x) => a + x.vp, 0);
  let acc = 0;
  let rec: number | null = null;
  fiscalFlows.forEach((f, t) => {
    acc += f;
    if (rec === null && acc >= 0 && t > 0) rec = t;
  });
  return {
    escenario: esc,
    horizonte: H,
    tasa: r,
    vpCostos,
    social: { componentes: social, vpBeneficios: vpB, van: vpB - vpCostos, bc: vpB / Math.max(vpCostos, 1), tir: irr(flows) },
    fiscal: { componentes: fiscal, vp: vpF, van: vpF - vpCapital, recupero: rec },
    poblacionFinal: P * curveAt(cv, H),
    serie,
  };
}

export type { Range };
