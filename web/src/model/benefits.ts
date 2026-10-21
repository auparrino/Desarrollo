// Análisis costo-beneficio por instrumento (parámetros en benefitParams.json,
// docs/beneficios-parametros.md). Flujos anuales descontados a la tasa social.
//
// Dos preguntas distintas, que no se suman:
//  1. Social (incremental): ¿conviene que estas personas vivan y trabajen acá en vez de
//     en el AMBA? Vivienda, escuelas y hospitales se necesitarían igual en cualquier
//     lugar, así que no se cuentan; sí la infraestructura de conexión, las mudanzas y
//     los edificios de gobierno. Beneficios: diferencia salarial (puede ser negativa),
//     aglomeración ganada en destino menos la perdida en el AMBA y congestión evitada.
//  2. Fiscal (también incremental): inversión pública adicional frente a lo que
//     recupera (impuestos sobre la producción adicional y captura de plusvalía).
//     La inversión total (vivienda incluida) se muestra aparte como necesidad de financiamiento.

import type { Cols } from "./criteria";
import type { CostResult } from "./costs";
import type { PolicyId } from "./policies";

export interface ParamItem {
  nombre?: string;
  unidad?: string;
  bajo: number | null;
  central: number | null;
  alto: number | null;
  fuente?: string;
  evidencia?: string;
}
export interface Curve {
  anios: number[];
  fraccion: number[];
  fuente?: string;
}
export interface BenefitParams {
  fecha_base: string;
  items: Record<string, unknown>;
  pbg_pc_provincia?: { valores?: Record<string, number> } & Record<string, unknown>;
  salario_rel_provincia?: { valores?: Record<string, number> } & Record<string, unknown>;
}

export type Escenario = "optimista" | "base" | "pesimista";

export interface CBAInput {
  policy: PolicyId;
  poblacion: number; // meta (habitantes, o empleos en "polos")
  costos: CostResult;
  c: Cols;
  i: number;
  codProv: string;
  /** salario relativo del mercado laboral del destino (≤ 50 km); si falta se usa el de la provincia */
  relDest?: number;
  /** salario relativo del AMBA */
  relAmba?: number;
  /** de dónde viene la gente: del AMBA (por defecto) o de la misma región */
  origen?: "amba" | "region";
  /** multiplica la curva de ocupación (para buscar el punto de equilibrio) */
  escalaOcupacion?: number;
}

export interface CBAComponent {
  id: string;
  nombre: string;
  vp: number;
  nota: string;
}
export interface CBASide {
  costos: CBAComponent[];
  beneficios: CBAComponent[];
  vpCostos: number;
  vpBeneficios: number;
  van: number;
  bc: number;
}
export interface CBAResult {
  escenario: Escenario;
  horizonte: number;
  tasa: number;
  social: CBASide & { tir: number | null; recupero: number | null };
  anual: { anio: number; poblacion: number; productividad: number; aglomeracion: number; congestion: number; polo: number };
  inversionTotal: number;
  inversionExtra: number;
  fiscal: CBASide & { recupero: number | null };
  poblacionFinal: number;
  /** inversión (USD corrientes, sin descontar) y población por año */
  cronograma: { anio: number; inversion: number; publica: number; poblacion: number }[];
  /** parámetros clave usados, para mostrarlos */
  supuestos: { relDest: number; relAmba: number; brecha: number; adicionalidad: number };
}

const item = (p: BenefitParams, id: string) => p.items[id] as ParamItem | undefined;
const val = (p: BenefitParams, id: string, d: number) => item(p, id)?.central ?? d;

function curveAt(cv: Curve | undefined, t: number): number {
  if (!cv) return Math.min(1, t / 20);
  const { anios: x, fraccion: y } = cv;
  if (t <= x[0]) return y[0];
  for (let k = 1; k < x.length; k++) if (t <= x[k]) return y[k - 1] + ((y[k] - y[k - 1]) * (t - x[k - 1])) / (x[k] - x[k - 1]);
  return y[y.length - 1];
}

/** Año desde el cual el saldo acumulado (descontado) queda positivo hasta el final del horizonte. */
function payback(flows: number[], r: number): number | null {
  let acc = 0;
  let last: number | null = null;
  flows.forEach((f, t) => {
    acc += f * (1 + r) ** -t;
    if (acc >= 0) {
      if (last === null && t > 0) last = t;
    } else last = null;
  });
  return last;
}

function irr(flows: number[]): number | null {
  const npv = (r: number) => flows.reduce((a, f, t) => a + f / (1 + r) ** t, 0);
  let lo = -0.5, hi = 1.0;
  if (npv(lo) * npv(hi) > 0) return null;
  for (let k = 0; k < 100; k++) {
    const m = (lo + hi) / 2;
    if (npv(lo) * npv(m) <= 0) hi = m;
    else lo = m;
  }
  return (lo + hi) / 2;
}

// Rubros de costo que se pagan al principio (conexión, edificios, tierra); el parque
// industrial se urbaniza por etapas, a medida que se instalan las empresas
const TRONCAL = new Set(["ruta", "at", "et", "acueducto", "planta", "oficinas", "congreso", "suelo"]);
// Rubros que el instrumento agrega frente a crecer en el AMBA (pregunta social)
const INCREMENTAL = new Set(["ruta", "at", "et", "acueducto", "planta", "oficinas", "congreso", "parque", "mudanza", "mudanza_apn", "rehab"]);
// Rubros que paga el Estado (pregunta fiscal): todo salvo la vivienda
const PUBLICO = (id: string) => id !== "vivienda";

const AMBA_POB = 14_000_000; // CABA + 24 partidos, Censo 2022 (≈ 13,98 M)

export function costBenefit(inp: CBAInput, p: BenefitParams, esc: Escenario): CBAResult {
  const r = val(p, "tasa_descuento", 0.12);
  const H = Math.round(val(p, "horizonte_anios", 40));
  const cv = p.items[`ocupacion_${esc}`] as Curve | undefined;
  const P = inp.poblacion;
  const polos = inp.policy === "polos";
  const relProv = p.salario_rel_provincia?.valores ?? {};
  const relDest = inp.relDest ?? relProv[inp.codProv] ?? (Number.isFinite(inp.c.salario_rel[inp.i]) ? inp.c.salario_rel[inp.i] : 1);
  const relAmba = inp.relAmba ?? (relProv["02"] && relProv["06"] ? (relProv["02"] * 3.1 + relProv["06"] * 10.9) / 14 : 1.1);
  // solo una parte de la brecha salarial entre regiones es efecto del lugar (el resto es quién vive ahí)
  const brecha = val(p, "fraccion_brecha_causal", 0.5);
  const adic = val(p, "adicionalidad_nacional_empleo", 0.25);
  const vab = val(p, "vab_por_ocupado_usd", 33100);
  const elast = val(p, "elasticidad_aglomeracion", 0.03);
  const congest = val(p, "costo_marginal_hab_amba", 0);
  const presion = val(p, "presion_tributaria", 0.276);
  const lote = val(p, "valor_lote_urbano_m2_intermedia", 0);
  const captura = val(p, "captura_plusvalia_frac", 0.1);
  const pph = 2.86;
  const desdeAMBA = inp.policy !== "polos" && inp.origen !== "region";
  const desdeRegion = inp.policy !== "polos" && inp.origen === "region";
  const kOc = inp.escalaOcupacion ?? 1;

  const lines = inp.costos.capital;
  const sum = (f: (id: string) => boolean, troncal: boolean) =>
    lines.filter((l) => f(l.id) && TRONCAL.has(l.id) === troncal).reduce((a, l) => a + l.usd[1], 0);
  const socT = sum((id) => INCREMENTAL.has(id), true), socV = sum((id) => INCREMENTAL.has(id), false);
  const totT = sum(() => true, true), totV = sum(() => true, false);
  const PRIVADO = new Set(["vivienda", "mudanza", "rehab"]);
  const pubT = sum((id) => !PRIVADO.has(id), true), pubV = sum((id) => !PRIVADO.has(id), false);
  const fisT = sum((id) => INCREMENTAL.has(id) && PUBLICO(id), true), fisV = sum((id) => INCREMENTAL.has(id) && PUBLICO(id), false);

  // productividad por habitante: salario relativo × PIB per cápita nacional (evita el sesgo
  // del PBG en provincias petroleras); producción regional Y = a·L^(1+ε)
  const pibNac = val(p, "pib_pc_nacional_usd", 14898);
  const yD = (1 + brecha * (relDest - 1)) * pibNac;
  const yA = (1 + brecha * (relAmba - 1)) * pibNac;
  const B = Math.max(inp.c.pob_50km[inp.i], 1);
  const gainDest = (n: number) => yD * B * (((B + n) / B) ** (1 + elast) - 1);
  // si la gente viene de la misma región, la región de origen (≈ 5 veces el entorno de 50 km) pierde algo de escala
  const BR = Math.max(5 * B, 2 * P);
  const lossRegion = (n: number) => yD * BR * (1 - (Math.max(BR - n, 1) / BR) ** (1 + elast));
  const lossAmba = (n: number) => yA * AMBA_POB * (1 - (Math.max(AMBA_POB - n, 1) / AMBA_POB) ** (1 + elast));

  const S = { costo: 0, productividad: 0, aglomeracion: 0, congest: 0, polo: 0 };
  let anual = { anio: 0, poblacion: 0, productividad: 0, aglomeracion: 0, congestion: 0, polo: 0 };
  const F = { costo: 0, impuestos: 0, plusvalia: 0, incentivo: 0 };
  const cron: CBAResult["cronograma"] = [];
  const inc = inp.costos.operacion.find((l) => l.id === "incentivo");
  const incPorEmpleo = inc && P > 0 ? inc.usd[1] / P : 0;
  const incAnios = 10;
  const flowsS: number[] = [];
  const flowsF: number[] = [];
  let prev = 0;
  for (let t = 0; t <= H; t++) {
    const N = P * Math.min(1, kOc * curveAt(cv, t));
    const dN = Math.max(0, N - prev);
    prev = N;
    const d = (1 + r) ** -t;
    const share = P > 0 ? dN / P : 0;
    const cS = (t < 5 ? socT / 5 : 0) + socV * share;
    let bS = 0;
    let netY = 0;
    if (polos) {
      // empleos del polo: solo la fracción adicional es producción nueva para el país;
      // el resto se habría creado igual en otra región (desplazamiento)
      const v = N * vab * (1 + brecha * (relDest - 1)) * adic;
      S.polo += v * d; bS += v; netY += v;
      if (t === Math.min(30, H)) anual = { anio: t, poblacion: N, productividad: 0, aglomeracion: 0, congestion: 0, polo: v };
    } else {
      // 1) diferencia de productividad: cada persona produce según el nivel del destino y no del AMBA
      const yO = desdeAMBA ? yA : yD;
      const prod = N * (yD - yO);
      // 2) aglomeración neta: lo que suben los demás en el destino menos lo que bajan en el origen
      const agD = gainDest(N) - N * yD;
      const agO = desdeAMBA ? lossAmba(N) - N * yA : desdeRegion ? lossRegion(N) - N * yD : 0;
      const aglo = agD - agO;
      const cg = desdeAMBA ? N * congest : 0;
      S.productividad += prod * d; S.aglomeracion += aglo * d; S.congest += cg * d;
      bS += prod + aglo + cg; netY += prod + aglo;
      if (t === Math.min(30, H)) anual = { anio: t, poblacion: N, productividad: prod, aglomeracion: aglo, congestion: cg, polo: 0 };
    }
    S.costo += cS * d;
    flowsS.push(bS - cS);
    // fiscal (incremental): costos públicos adicionales frente a crecer en el AMBA
    const cF = (t < 5 ? fisT / 5 : 0) + fisV * share;
    const imp = presion * Math.max(0, netY);
    const plus = !polos ? (dN / pph) * 300 * lote * captura : 0;
    const cInc = polos && t <= incAnios ? incPorEmpleo * N : 0;
    F.costo += cF * d; F.impuestos += imp * d; F.plusvalia += plus * d; F.incentivo += cInc * d;
    flowsF.push(imp + plus - cF - cInc);
    cron.push({ anio: t, inversion: (t < 5 ? totT / 5 : 0) + totV * share, publica: (t < 5 ? pubT / 5 : 0) + pubV * share, poblacion: N });
  }
  const C = (id: string, nombre: string, vp: number, nota: string) => ({ id, nombre, vp, nota });
  const sB = [
    !polos && C("productividad", desdeAMBA ? "Diferencia de productividad con el AMBA" : "Diferencia de productividad", S.productividad,
      "cada persona produce según el nivel de salarios del destino en vez del AMBA (puede restar)"),
    !polos && C("aglomeracion", "Efecto de concentración (neto)", S.aglomeracion,
      `la región que crece se vuelve algo más productiva y el AMBA algo menos (ε = ${elast})`),
    desdeAMBA && C("congest", "Congestión evitada en el AMBA", S.congest, "menos viajes y tiempo perdido en el AMBA"),
    polos && C("polo", "Producción nueva del polo", S.polo, `${Math.round(adic * 100)} % de los empleos se considera actividad nueva para el país; el resto se habría creado en otra región`),
  ].filter(Boolean) as CBAComponent[];
  const sC = [C("costos", "Infraestructura de conexión, mudanzas y edificios", S.costo, "lo que se agrega frente a crecer en el AMBA")];
  const fB = [
    C("impuestos", "Impuestos sobre la producción adicional", F.impuestos, `presión tributaria ${Math.round(presion * 100)} %`),
    !polos && C("plusvalia", "Captura de plusvalía del suelo", F.plusvalia, `${Math.round(captura * 100)} % de la valorización de lotes de 300 m²`),
  ].filter(Boolean) as CBAComponent[];
  const fC = [
    C("inversion", "Inversión pública adicional", F.costo, "conexión, edificios y mudanzas; vivienda y servicios se necesitarían igual en el AMBA"),
    polos && F.incentivo > 0 && C("incentivo", "Incentivos fiscales a las empresas", F.incentivo, `${incAnios} años, por empleo creado`),
  ].filter(Boolean) as CBAComponent[];
  const tot = (xs: CBAComponent[]) => xs.reduce((a, x) => a + x.vp, 0);
  const rec = payback(flowsF, r);
  // B/C: beneficios positivos sobre costos más pérdidas (componentes negativos)
  const side = (b: CBAComponent[], c: CBAComponent[]) => {
    const pos = b.filter((x) => x.vp > 0).reduce((a, x) => a + x.vp, 0);
    const neg = -b.filter((x) => x.vp < 0).reduce((a, x) => a + x.vp, 0);
    const vc = tot(c);
    return { beneficios: b, costos: c, vpBeneficios: tot(b), vpCostos: vc, van: tot(b) - vc, bc: vc + neg > 0 ? pos / (vc + neg) : NaN };
  };
  return {
    escenario: esc,
    horizonte: H,
    tasa: r,
    social: { ...side(sB, sC), tir: irr(flowsS), recupero: S.costo > 0 ? payback(flowsS, r) : null },
    anual,
    inversionTotal: inp.costos.totalCapital[1],
    inversionExtra: socT + socV,
    fiscal: { ...side(fB, fC), recupero: rec },
    poblacionFinal: P * Math.min(1, kOc * curveAt(cv, H)),
    cronograma: cron,
    supuestos: { relDest, relAmba, brecha, adicionalidad: adic },
  };
}
