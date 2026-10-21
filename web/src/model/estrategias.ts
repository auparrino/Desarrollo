// Estrategias de proceso que se comparan con proceso.ts y contexto de cada sitio.
// Las usan la ficha de la app y web/scripts/simular.ts (docs/simulaciones-procesos.md).

import type { Dataset } from "../data/load";
import type { CBAResult, Escenario } from "./benefits";
import type { CostResult } from "./costs";
import { mercadoLaboral, type Mercado } from "./labor";
import { poolAnual } from "./migracion";
import type { PolicyId } from "./policies";
import { montecarlo, type Contexto, type Estrategia, type Resumen } from "./proceso";
import { UNIT_COSTS } from "./unitCostsData";

const U = UNIT_COSTS.items;
const n0 = (v: number) => Math.round(v).toLocaleString("es-AR");

const base = { motorEmpleos: 0, motorInicio: 1, motorDuracion: 8, motorCostoEmpleo: 0, motorFiscalAnual: 0, motorFiscalAnios: 0, captacionExtra: 1, ayudaHogar: 0, radicacion: 1, externos: 0.5 };
const costoIndustrial = (U.parque_industrial_ha?.central ?? 206000) / (U.empleos_por_ha_industrial?.central ?? 8.2);
const fiscalEmpleo = U.costo_fiscal_empleo_anio?.central ?? 51000;
const costoPublico = (U.m2_por_empleado?.central ?? 12) * (U.oficina_m2?.central ?? 1820) + (U.mudanza_hogar?.central ?? 1000);

export function estrategias(pol: PolicyId, meta: number, retardo: number): Estrategia[] {
  const empleosNecesarios = meta * 0.45;
  const motor = (f: number) => Math.round((empleosNecesarios * f) / 2); // con multiplicador ≈ 1, cada empleo del motor sostiene ~2
  if (pol === "capital") {
    const apn = U.empleados_apn_caba?.central ?? 74000;
    const cap = { ...base, motorEmpleos: apn, motorCostoEmpleo: costoPublico, motorInicio: retardo, externos: 1 };
    return [
      { ...cap, id: "rapido_todo", nombre: "Traslado rápido y viviendas para todos al inicio", descripcion: "74.000 agentes en 5 años; se construye la ciudad entera en los primeros años.", regla: "todo_al_inicio", motorDuracion: 5, radicacion: 0.5 },
      { ...cap, id: "rapido_demanda", nombre: "Traslado rápido, viviendas a demanda", descripcion: "74.000 agentes en 5 años; se construye a medida que llegan.", regla: "a_demanda", motorDuracion: 5, radicacion: 0.5 },
      { ...cap, id: "gradual_demanda", nombre: "Traslado gradual (12 años), viviendas a demanda", descripcion: "Un ministerio por vez.", regla: "a_demanda", motorDuracion: 12, radicacion: 0.5 },
      { ...cap, id: "rapido_radicacion", nombre: "Traslado rápido con radicación de las familias", descripcion: "Vivienda y ayuda de mudanza para que el 85 % se mude con su familia en lugar de viajar.", regla: "a_demanda", motorDuracion: 5, radicacion: 0.85, ayudaHogar: 5000 },
      { ...cap, id: "gradual_radicacion", nombre: "Traslado gradual con radicación de las familias", descripcion: "12 años; vivienda y ayuda de mudanza para que el 85 % se mude.", regla: "a_demanda", motorDuracion: 12, radicacion: 0.85, ayudaHogar: 5000 },
    ];
  }
  if (pol === "polos") {
    const p = { ...base, motorEmpleos: meta, motorCostoEmpleo: costoIndustrial, motorInicio: retardo };
    return [
      { ...p, id: "todo_incentivos10", nombre: "Parque completo e incentivos por 10 años", descripcion: "Se urbaniza todo el parque al inicio y se dan incentivos fiscales por 10 años a cada empleo.", regla: "a_demanda", motorDuracion: 10, motorFiscalAnual: fiscalEmpleo, motorFiscalAnios: 10 },
      { ...p, id: "etapas_incentivos5", nombre: "Parque por etapas e incentivos por 5 años", descripcion: "Lotes a medida que se venden; incentivos acotados a 5 años.", regla: "a_demanda", motorDuracion: 15, motorFiscalAnual: fiscalEmpleo, motorFiscalAnios: 5 },
      { ...p, id: "etapas_sin_incentivos", nombre: "Parque por etapas sin incentivos fiscales", descripcion: "Solo infraestructura y suelo; las empresas llegan más despacio.", regla: "a_demanda", motorDuracion: 20, motorEmpleos: Math.round(meta * 0.6) },
      { ...p, id: "etapas_retorno", nombre: "Parque por etapas, incentivos 5 años y programa de retorno", descripcion: "Como el anterior más difusión y ayuda de mudanza para quienes nacieron en la región.", regla: "a_demanda", motorDuracion: 15, motorFiscalAnual: fiscalEmpleo, motorFiscalAnios: 5, captacionExtra: 1.4, ayudaHogar: 3000 },
    ];
  }
  const ind = { ...base, motorCostoEmpleo: costoIndustrial, motorFiscalAnual: fiscalEmpleo, motorFiscalAnios: 5, motorInicio: retardo - 1 };
  return [
    { ...base, id: "viviendas_primero", nombre: "Viviendas primero", descripcion: "Se construye la ciudad completa en los primeros años y se espera que llegue la gente (Brasilia, ciudades nuevas egipcias).", regla: "todo_al_inicio" },
    { ...base, id: "etapas", nombre: "Por etapas, sin motor de empleo", descripcion: "Etapas del 20 % de la meta, cada una cuando la anterior está ocupada en un 80 %.", regla: "por_etapas" },
    { ...base, id: "demanda", nombre: "A demanda, sin motor de empleo", descripcion: "Se construye cada año lo que pide la llegada del año anterior.", regla: "a_demanda" },
    { ...ind, id: "motor_chico", nombre: "Motor de empleo chico primero, luego viviendas a demanda", descripcion: `Empresas ancla con ${n0(motor(0.2))} empleos (20 % del empleo necesario) antes de las viviendas.`, regla: "a_demanda", motorEmpleos: motor(0.2) },
    { ...ind, id: "motor_grande", nombre: "Motor de empleo grande primero, luego viviendas a demanda", descripcion: `Empresas ancla u organismos con ${n0(motor(0.5))} empleos (la mitad del empleo necesario).`, regla: "a_demanda", motorEmpleos: motor(0.5) },
    { ...base, id: "motor_publico", nombre: "Organismos públicos primero, luego viviendas a demanda", descripcion: `Traslado de ${n0(motor(0.2))} empleos públicos (universidad, hospitales regionales, organismos nacionales o provinciales), sin incentivos fiscales.`, regla: "a_demanda", motorEmpleos: motor(0.2), motorCostoEmpleo: costoPublico, motorInicio: retardo, externos: 0.8 },
    { ...ind, id: "motor_retorno", nombre: "Motor chico + programa de retorno y ayuda de mudanza", descripcion: "Como el motor chico, más difusión y crédito de mudanza para quienes nacieron en la región.", regla: "a_demanda", motorEmpleos: motor(0.2), captacionExtra: 1.4, ayudaHogar: 3000 },
  ];
}


/** Contexto de simulación de un sitio a partir de sus costos y su costo-beneficio. */
export function contextoProceso(ds: Dataset, i: number, policy: PolicyId, meta: number, costos: CostResult, r: Record<Escenario, CBAResult>): { ctx: Contexto; merc: Mercado } {
  const nueva = policy === "ciudad_nueva" || policy === "capital";
  const polos = policy === "polos";
  const pph = 2.86;
  const costoViv = costos.capital.filter((l) => l.id === "vivienda" || l.id === "urbanizacion").reduce((a, l) => a + l.usd[1], 0) / Math.max(meta / pph, 1);
  const troncal = costos.capital.filter((l) => ["ruta", "at", "et", "acueducto", "planta", "suelo", "congreso"].includes(l.id)).reduce((a, l) => a + l.usd[1], 0);
  const b = r.base;
  const anual = b.anual.productividad + b.anual.aglomeracion + b.anual.congestion + b.anual.polo;
  const merc = mercadoLaboral(ds, i);
  const prov = ds.meta.departamentos[ds.dep[i]]?.provincia ?? "";
  const ctx: Contexto = {
    // en un polo la meta son empleos: con sus familias y servicios, ~2,2 personas por empleo
    meta: polos ? meta * 2.2 : meta,
    puestosZona: merc.puestos,
    crecEmpleo: merc.empCrec,
    poolAnual: poolAnual(prov),
    costoVivienda: polos ? 60 * (U.vivienda_m2?.central ?? 1100) + (U.urbanizacion_lote?.central ?? 7200) : costoViv,
    costoTroncal: troncal,
    beneficioHab: anual / Math.max(polos ? b.anual.poblacion * 2.2 : b.anual.poblacion, 1),
    retardo: nueva ? 3 : polos ? 2 : 1,
  };
  return { ctx, merc };
}

/** Estrategia de referencia contra la que se mide el costo de sumar gente. */
export const REFERENCIA: Record<PolicyId, string> = {
  ciudad_nueva: "demanda", intermedias: "demanda", pueblos: "demanda", capital: "gradual_demanda", polos: "etapas_sin_incentivos",
};

export interface Comparacion {
  rs: Resumen[];
  mejor: Resumen; // mayor saldo mediano
  poblar: Resumen | null; // la forma más barata de sumar gente frente a la referencia
  ref: Resumen;
  marginal: (x: Resumen) => number; // costo para el país por habitante adicional (NaN si no suma gente)
  ctx: Contexto;
  merc: Mercado;
}

/** Simula todas las estrategias del instrumento en el sitio (Monte Carlo) y elige las mejores. */
export function compararEstrategias(ds: Dataset, i: number, policy: PolicyId, meta: number, costos: CostResult, r: Record<Escenario, CBAResult>, n = 300): Comparacion {
  const { ctx, merc } = contextoProceso(ds, i, policy, meta, costos, r);
  const rs = estrategias(policy, ctx.meta, ctx.retardo).map((e, k) => montecarlo(ctx, e, n, 7 + k));
  const mejor = [...rs].sort((a, b) => b.van[1] - a.van[1])[0];
  const ref = rs.find((x) => x.estrategia.id === REFERENCIA[policy]) ?? rs[0];
  const marginal = (x: Resumen) => {
    const dp = x.pob30[1] - ref.pob30[1];
    return dp > 0.1 * Math.max(ref.pob30[1], 1000) ? -(x.van[1] - ref.van[1]) / dp : NaN;
  };
  const poblar = rs.filter((x) => Number.isFinite(marginal(x))).sort((a, b) => marginal(a) - marginal(b))[0] ?? null;
  return { rs, mejor, poblar, ref, marginal, ctx, merc };
}
