// Estimación de costos de capital y de operación de cada instrumento, con rango
// bajo/central/alto. Los costos unitarios y sus fuentes están en unitCosts.json
// (docs/costos-unitarios.md); las cantidades salen de la geografía de cada sitio.
// Es una estimación paramétrica de orden de magnitud (tipo "clase 5" de AACE), no un presupuesto.

import type { Cols } from "./criteria";
import type { PolicyId } from "./policies";

export interface UnitItem {
  nombre: string;
  unidad: string;
  bajo: number | null;
  central: number | null;
  alto: number | null;
  fuente: string;
  evidencia: string;
}
export interface UnitCosts {
  fecha_base: string;
  tipo_cambio: string;
  items: Record<string, UnitItem>;
}

export type Range = [number, number, number]; // bajo, central, alto

export interface CostLine {
  id: string;
  rubro: string;
  cantidad: string;
  usd: Range;
  fuente: string;
  faltante?: boolean; // costo unitario sin dato: no suma
}

export interface CostParams {
  poblacion: number; // habitantes (o empleos en polos)
  densidad: number; // hab/ha brutos
  personasPorHogar?: number;
  fraccionCapital?: number; // capital: fracción de la APN que se traslada
  usoViviendasOciosas?: number; // fracción de las viviendas desocupadas a ≤50 km que se puede reutilizar
  anosIncentivo?: number; // polos: años de incentivo fiscal
}

export interface CostResult {
  capital: CostLine[];
  operacion: CostLine[]; // anual
  totalCapital: Range;
  totalOperacion: Range;
  porHabitante: Range;
  pctPBI: Range | null;
  region: string;
}

const tri = (u: UnitItem | undefined): Range | null =>
  u && u.central !== null ? [u.bajo ?? u.central, u.central, u.alto ?? u.central] : null;
const mul = (r: Range, k: number): Range => [r[0] * k, r[1] * k, r[2] * k];
const add = (a: Range, b: Range): Range => [a[0] + b[0], a[1] + b[1], a[2] + b[2]];
const fmt = (n: number) => Math.round(n).toLocaleString("es-AR");

/** Región de precio de la tierra según provincia y condiciones del sitio. */
export function landRegion(provincia: string, c: Cols, i: number): string {
  const p = provincia;
  const riego = c.q_rio25[i] >= 10;
  if (["Neuquén", "Río Negro", "Chubut", "Santa Cruz"].includes(p) || p.startsWith("Tierra del Fuego"))
    return riego && c.aridez[i] < 0.35 ? "tierra_ha_patagonia_valle" : "tierra_ha_patagonia_meseta";
  if (["Mendoza", "San Juan", "San Luis", "La Rioja"].includes(p)) return riego ? "tierra_ha_cuyo_oasis" : "tierra_ha_cuyo_secano";
  if (["Chaco", "Formosa", "Corrientes", "Misiones"].includes(p)) return "tierra_ha_nea";
  if (["Jujuy", "Salta", "Tucumán", "Santiago del Estero", "Catamarca"].includes(p)) return "tierra_ha_noa";
  if (["Buenos Aires", "Santa Fe", "Córdoba", "Entre Ríos"].includes(p) && c.prec[i] >= 800) return "tierra_ha_nucleo";
  return "tierra_ha_extrapampeana";
}

export function estimateCosts(
  policy: PolicyId,
  c: Cols,
  i: number,
  provincia: string,
  p: CostParams,
  uc: UnitCosts,
): CostResult {
  const U = uc.items;
  const cap: CostLine[] = [];
  const op: CostLine[] = [];
  const line = (arr: CostLine[], id: string, rubro: string, qty: number, unitId: string, cantidad: string) => {
    const r = tri(U[unitId]);
    arr.push({
      id, rubro, cantidad,
      usd: r ? mul(r, qty) : [0, 0, 0],
      fuente: U[unitId] ? `${U[unitId].fuente} [${U[unitId].evidencia}]` : "sin costo unitario",
      faltante: !r,
    });
  };

  const P = p.poblacion;
  const pph = p.personasPorHogar ?? U.personas_por_hogar?.central ?? 2.86;
  const hogares = P / pph;
  const nueva = policy === "ciudad_nueva" || policy === "capital";
  const region = landRegion(provincia, c, i);

  if (policy === "polos") {
    // P = empleos del polo
    const emph = U.empleos_por_ha_industrial?.central ?? null;
    const ha = emph ? P / emph : NaN;
    if (Number.isFinite(ha)) {
      line(cap, "parque", "Parque industrial urbanizado", ha, "parque_industrial_ha", `${fmt(ha)} ha para ${fmt(P)} empleos`);
      line(cap, "suelo", "Tierra para el parque", ha, region, `${fmt(ha)} ha (${U[region]?.nombre ?? region})`);
    } else {
      cap.push({ id: "parque", rubro: "Parque industrial urbanizado", cantidad: "sin densidad de empleo por ha", usd: [0, 0, 0], fuente: "falta empleos_por_ha_industrial", faltante: true });
    }
    line(cap, "ruta", "Acceso vial pavimentado", c.d_ruta[i], "ruta_km", `${fmt(c.d_ruta[i])} km hasta ruta nacional`);
    line(cap, "at", "Línea de alta tensión", c.d_alta_tension[i], "linea_132kv_km", `${fmt(c.d_alta_tension[i])} km de 132 kV`);
    line(cap, "et", "Estación transformadora", 1, "estacion_transformadora", "1 estación");
    const fiscal = tri(U.costo_fiscal_empleo_anio);
    if (fiscal) {
      const years = p.anosIncentivo ?? 10;
      op.push({ id: "incentivo", rubro: `Incentivo fiscal (${years} años, anualizado)`, cantidad: `${fmt(P)} empleos`, usd: mul(fiscal, P), fuente: `${U.costo_fiscal_empleo_anio.fuente} [${U.costo_fiscal_empleo_anio.evidencia}]` });
    }
  } else {
    // vivienda: en intermedias y pueblos se descuentan viviendas desocupadas reutilizables
    const reuse = nueva ? 0 : Math.min(hogares, (c.viv_ociosas_50km[i] || 0) * (p.usoViviendasOciosas ?? 0.1));
    const nuevas = hogares - reuse;
    const m2 = U.vivienda_social_m2_sup?.central ?? 60;
    line(cap, "vivienda", "Viviendas nuevas", nuevas * m2, "vivienda_m2", `${fmt(nuevas)} viviendas de ${fmt(m2)} m²`);
    if (reuse > 0) line(cap, "rehab", "Rehabilitación de viviendas desocupadas", reuse, "rehab_vivienda", `${fmt(reuse)} viviendas`);
    line(cap, "urbanizacion", "Urbanización (redes, calles, desagües)", nuevas, "urbanizacion_lote", `${fmt(nuevas)} lotes con servicios`);
    if (nueva || policy === "pueblos") {
      const ha = P / p.densidad;
      line(cap, "suelo", "Compra de tierra", ha, region, `${fmt(ha)} ha (${U[region]?.nombre ?? region})`);
    }
    const alumnos = P * (U.share_edad_escolar?.central ?? 0.2);
    line(cap, "escuelas", "Escuelas", alumnos, "escuela_por_alumno", `${fmt(alumnos)} alumnos`);
    const camas = (P / 1000) * (U.camas_por_1000?.central ?? 0);
    line(cap, "hospital", "Hospital y salud", camas, "hospital_por_cama", `${fmt(camas)} camas`);
    if (nueva) {
      // conexión troncal desde la red existente
      line(cap, "ruta", "Ruta de acceso pavimentada", c.d_ruta[i], "ruta_km", `${fmt(c.d_ruta[i])} km hasta ruta nacional`);
      line(cap, "at", "Línea de alta tensión", c.d_alta_tension[i], "linea_132kv_km", `${fmt(c.d_alta_tension[i])} km de 132 kV`);
      line(cap, "et", "Estación transformadora", Math.max(1, Math.ceil(P / 250_000)), "estacion_transformadora", `${Math.max(1, Math.ceil(P / 250_000))} estaciones`);
      const m3dia = (P * 200) / 1000;
      const kmAgua = c.q95_rio25[i] > 0 ? Math.min(c.d_rio10[i], 25) : 0;
      line(cap, "acueducto", "Acueducto desde la fuente", kmAgua, "acueducto_km", kmAgua ? `${fmt(kmAgua)} km` : "fuente local (sin acueducto)");
      line(cap, "planta", "Planta potabilizadora", m3dia, "planta_potabilizadora_m3dia", `${fmt(m3dia)} m³/día`);
    }
    if (policy === "capital") {
      const emp = (U.empleados_apn_caba?.central ?? 0) * (p.fraccionCapital ?? 1);
      const m2emp = U.m2_por_empleado?.central ?? 0;
      line(cap, "oficinas", "Edificios de gobierno", emp * m2emp, "oficina_m2", `${fmt(emp)} empleados × ${fmt(m2emp)} m²`);
      line(cap, "mudanza_apn", "Mudanza de hogares de empleados públicos", emp, "mudanza_hogar", `${fmt(emp)} hogares`);
    }
    if (policy !== "ciudad_nueva") line(cap, "mudanza", "Mudanza de hogares", hogares, "mudanza_hogar", `${fmt(hogares)} hogares`);
    line(op, "municipal", "Servicios municipales (anual)", P, "servicios_municipales_hab_anio", `${fmt(P)} habitantes`);
  }

  const totalCapital = cap.reduce((a, l) => add(a, l.usd), [0, 0, 0] as Range);
  const mant = tri(U.mantenimiento_infra_pct_anual);
  if (mant) op.push({ id: "mantenimiento", rubro: "Mantenimiento de infraestructura (anual)", cantidad: `${mant[1]} % del capital`, usd: [totalCapital[0] * mant[0] / 100, totalCapital[1] * mant[1] / 100, totalCapital[2] * mant[2] / 100], fuente: `${U.mantenimiento_infra_pct_anual.fuente} [${U.mantenimiento_infra_pct_anual.evidencia}]` });
  const totalOperacion = op.reduce((a, l) => add(a, l.usd), [0, 0, 0] as Range);
  const pbi = U.pbi_usd?.central ?? null;
  return {
    capital: cap,
    operacion: op,
    totalCapital,
    totalOperacion,
    porHabitante: mul(totalCapital, 1 / Math.max(P, 1)),
    pctPBI: pbi ? mul(totalCapital, 100 / pbi) : null,
    region,
  };
}
