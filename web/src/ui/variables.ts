// Catálogo de variables de la grilla para exploración y ficha de celda.

export interface VarInfo {
  id: string;
  nombre: string;
  unidad: string;
  grupo: string;
  fmt?: (v: number) => string;
  /** sentido "mejor" para lectura (solo informativo) */
  log?: boolean;
}

const f0 = (v: number) => Math.round(v).toLocaleString("es-AR");
const f1 = (v: number) => v.toLocaleString("es-AR", { maximumFractionDigits: 1 });
const f2 = (v: number) => v.toLocaleString("es-AR", { maximumFractionDigits: 2 });
const pct = (v: number) => `${Math.round(v * 100)} %`;

export const VARIABLES: VarInfo[] = [
  { id: "pob", nombre: "Población (Censo 2022, reparto dasimétrico)", unidad: "hab", grupo: "Población", fmt: f0, log: true },
  { id: "pob_50km", nombre: "Población en 50 km", unidad: "hab", grupo: "Población", fmt: f0, log: true },
  { id: "crec_dep", nombre: "Crecimiento anual del depto. 2010–2022", unidad: "%/año", grupo: "Población", fmt: f2 },
  { id: "elev", nombre: "Altitud", unidad: "m", grupo: "Relieve", fmt: f0 },
  { id: "pend_media", nombre: "Pendiente media (MDE 1 km)", unidad: "%", grupo: "Relieve", fmt: f1 },
  { id: "frac_pend_ok", nombre: "Superficie con pendiente ≤15 %", unidad: "", grupo: "Relieve", fmt: pct },
  { id: "t_media", nombre: "Temperatura media anual", unidad: "°C", grupo: "Clima", fmt: f1 },
  { id: "t_max_cal", nombre: "Máx. media del mes más cálido", unidad: "°C", grupo: "Clima", fmt: f1 },
  { id: "t_min_fri", nombre: "Mín. media del mes más frío", unidad: "°C", grupo: "Clima", fmt: f1 },
  { id: "prec", nombre: "Precipitación anual", unidad: "mm", grupo: "Clima", fmt: f0 },
  { id: "prec_estac", nombre: "Estacionalidad de la precipitación (CV)", unidad: "%", grupo: "Clima", fmt: f0 },
  { id: "hdd18", nombre: "Grados-día de calefacción (base 18)", unidad: "°C·día", grupo: "Clima", fmt: f0 },
  { id: "cdd18", nombre: "Grados-día de refrigeración (base 18)", unidad: "°C·día", grupo: "Clima", fmt: f0 },
  { id: "aridez", nombre: "Índice de aridez (P/ET0)", unidad: "", grupo: "Agua", fmt: f2 },
  { id: "q_rio25", nombre: "Caudal medio del mayor río a ≤25 km", unidad: "m³/s", grupo: "Agua", fmt: f1, log: true },
  { id: "d_rio10", nombre: "Distancia a río ≥10 m³/s", unidad: "km", grupo: "Agua", fmt: f0 },
  { id: "pga475", nombre: "Aceleración sísmica PGA (T=475)", unidad: "g", grupo: "Riesgos", fmt: f2 },
  { id: "frac_inund100", nombre: "Planicie de inundación T=100", unidad: "", grupo: "Riesgos", fmt: pct },
  { id: "t_ciudad", nombre: "Tiempo a ciudad ≥50.000 hab.", unidad: "min", grupo: "Accesibilidad", fmt: f0 },
  { id: "t_salud", nombre: "Tiempo a establecimiento de salud", unidad: "min", grupo: "Accesibilidad", fmt: f0 },
  { id: "d_ruta", nombre: "Distancia a ruta nacional pavimentada", unidad: "km", grupo: "Accesibilidad", fmt: f0 },
  { id: "d_ffcc", nombre: "Distancia a ferrocarril operativo", unidad: "km", grupo: "Accesibilidad", fmt: f0 },
  { id: "d_puerto", nombre: "Distancia a puerto", unidad: "km", grupo: "Accesibilidad", fmt: f0 },
  { id: "d_amba", nombre: "Distancia al AMBA", unidad: "km", grupo: "Accesibilidad", fmt: f0 },
  { id: "d_alta_tension", nombre: "Distancia a línea de alta tensión", unidad: "km", grupo: "Energía", fmt: f0 },
  { id: "ghi", nombre: "Radiación solar", unidad: "kWh/m²/día", grupo: "Energía", fmt: f2 },
  { id: "viento100", nombre: "Viento medio a 100 m", unidad: "m/s", grupo: "Energía", fmt: f1 },
  { id: "as_prob", nombre: "Probabilidad de arsénico >10 µg/L (agua subterránea)", unidad: "", grupo: "Agua", fmt: pct },
  { id: "f_prob", nombre: "Probabilidad de fluoruro >1,5 mg/L", unidad: "", grupo: "Agua", fmt: pct },
  { id: "empleo_50km", nombre: "Empleo privado registrado a ≤50 km", unidad: "puestos", grupo: "Trabajo", fmt: f0, log: true },
  { id: "emp_crec", nombre: "Crecimiento anual del empleo 2014–2022 (depto.)", unidad: "%/año", grupo: "Trabajo", fmt: f2 },
  { id: "salario_rel", nombre: "Salario privado relativo a la media nacional", unidad: "×", grupo: "Trabajo", fmt: f2 },
  { id: "n_proyectos_100km", nombre: "Proyectos productivos a ≤100 km", unidad: "", grupo: "Trabajo", fmt: f0 },
  { id: "d_parque_ind", nombre: "Distancia a parque industrial", unidad: "km", grupo: "Trabajo", fmt: f0 },
  { id: "pct_agua_red", nombre: "Hogares con agua de red (depto.)", unidad: "%", grupo: "Servicios", fmt: f0 },
  { id: "pct_cloaca", nombre: "Hogares con cloaca (depto.)", unidad: "%", grupo: "Servicios", fmt: f0 },
  { id: "pct_internet", nombre: "Hogares con internet (depto.)", unidad: "%", grupo: "Servicios", fmt: f0 },
  { id: "pct_nbi", nombre: "Hogares con NBI (depto.)", unidad: "%", grupo: "Servicios", fmt: f1 },
  { id: "viv_ociosas_50km", nombre: "Viviendas desocupadas a ≤50 km", unidad: "viv.", grupo: "Servicios", fmt: f0, log: true },
  { id: "d_hospital", nombre: "Distancia a hospital de internación general", unidad: "km", grupo: "Servicios", fmt: f0 },
  { id: "d_universidad", nombre: "Distancia a universidad", unidad: "km", grupo: "Servicios", fmt: f0 },
  { id: "crec_proy_2035", nombre: "Crecimiento proyectado 2022–2035 (INDEC, depto.)", unidad: "%", grupo: "Población", fmt: f1 },
  { id: "pct_fiscal_eap", nombre: "Tierra fiscal en explotaciones agropecuarias (CNA 2018)", unidad: "%", grupo: "Tierra", fmt: f1 },
  { id: "pct_dep_en_eap", nombre: "Superficie del depto. en explotaciones agropecuarias", unidad: "%", grupo: "Tierra", fmt: f0 },
  { id: "pct_extranjero", nombre: "Tierra rural en manos extranjeras (RNTR 2025)", unidad: "%", grupo: "Tierra", fmt: f1 },
  { id: "d_comunidad", nombre: "Distancia a comunidad indígena registrada", unidad: "km", grupo: "Tierra", fmt: f0 },
  { id: "d_media_pob", nombre: "Distancia media de la población del país", unidad: "km", grupo: "Accesibilidad", fmt: f0 },
  { id: "d_max_capital", nombre: "Distancia a la capital provincial más lejana", unidad: "km", grupo: "Accesibilidad", fmt: f0 },
  { id: "d_metro", nombre: "Distancia a una metrópoli (≥1 M hab.)", unidad: "km", grupo: "Accesibilidad", fmt: f0 },
  { id: "n_incent_empresas", nombre: "Incentivos vigentes para empresas (depto.)", unidad: "", grupo: "Incentivos", fmt: f0 },
  { id: "n_incent_personas", nombre: "Incentivos vigentes para personas y hogares (depto.)", unidad: "", grupo: "Incentivos", fmt: f0 },
  { id: "frac_ap_estricta", nombre: "Área protegida estricta", unidad: "", grupo: "Ambiente", fmt: pct },
  { id: "frac_ap_uso_multiple", nombre: "Área protegida de uso múltiple", unidad: "", grupo: "Ambiente", fmt: pct },
];

export const VAR_BY_ID = Object.fromEntries(VARIABLES.map((v) => [v.id, v]));

export function fmtVar(id: string, v: number): string {
  if (!Number.isFinite(v)) return "s/d";
  const info = VAR_BY_ID[id];
  const s = info?.fmt ? info.fmt(v) : String(v);
  return info?.unidad ? `${s} ${info.unidad}` : s;
}
