// Criterios de aptitud: restricciones (máscaras) y factores (funciones de valor + pesos).
// Parámetros tomados de docs/revision-bibliografica.md (§4, §7). Cada criterio lleva su
// etiqueta de evidencia: E empírica/consenso, N norma, C caso, J juicio experto, D derivación.

import { evaluate, type ValueFn } from "./valueFunctions";

export type Cols = Record<string, Float32Array>;
/** Contexto de evaluación (parámetros de la política, p. ej. población objetivo). */
export interface Ctx {
  poblacion: number;
}
export type Evidence = "E" | "N" | "C" | "J" | "D";

export const GROUPS = [
  { id: "agua", nombre: "Agua", color: "#2b7bb9" },
  { id: "acceso", nombre: "Accesibilidad y servicios", color: "#7a5195" },
  { id: "riesgo", nombre: "Riesgos", color: "#d45087" },
  { id: "clima", nombre: "Clima", color: "#f28e2b" },
  { id: "equilibrio", nombre: "Equilibrio territorial", color: "#59a14f" },
  { id: "energia", nombre: "Energía", color: "#edc948" },
  { id: "topo", nombre: "Topografía", color: "#9c755f" },
  { id: "agro", nombre: "Costo agrícola", color: "#bab0ac" },
  { id: "trabajo", nombre: "Trabajo y economía", color: "#4e79a7" },
  { id: "servicios", nombre: "Servicios urbanos", color: "#76b7b2" },
  { id: "tierra", nombre: "Tierra disponible", color: "#b07aa1" },
  { id: "centralidad", nombre: "Centralidad nacional", color: "#ff9da7" },
] as const;
export type GroupId = (typeof GROUPS)[number]["id"];

export interface Factor {
  id: string;
  nombre: string;
  grupo: GroupId;
  peso: number; // peso global base (E1)
  unidad: string;
  variable: string; // descripción de la variable medida
  column?: string; // columna directa (si la función de valor es editable)
  fn?: ValueFn;
  score?: (c: Cols, i: number, fn?: ValueFn, ctx?: Ctx) => number; // factores compuestos
  disponible: boolean;
  evidencia: Evidence[];
  refs: string[];
  nota?: string;
}

const WEIBULL_K2 = 1.91; // <v³>/<v>³ para distribución de Weibull con k = 2
const wpd = (v: number) => 0.5 * 1.225 * v ** 3 * WEIBULL_K2; // densidad de potencia eólica, W/m²

export const FACTORS: Factor[] = [
  {
    id: "F01", nombre: "Disponibilidad hídrica", grupo: "agua", peso: 0.14, unidad: "",
    variable: "máx. entre índice de aridez (P/ET0) y caudal medio del mayor río a ≤25 km",
    fn: { kind: "increasing", a: 0.2, b: 0.65 },
    score: (c, i, fn) =>
      Math.max(
        evaluate(fn ?? { kind: "increasing", a: 0.2, b: 0.65 }, c.aridez[i]),
        evaluate({ kind: "increasing", a: 5, b: 500, log: true }, c.q_rio25[i]),
      ),
    disponible: true, evidencia: ["E", "J"],
    refs: ["Falkenmark et al. 1989", "UNEP 1997 (clases de aridez)", "Zomer et al. 2022", "Lehner & Grill 2013"],
    nota:
      "Sustituto de la disponibilidad per cápita por cuenca (Falkenmark), que requiere balance hídrico por cuenca. " +
      "Aridez: 0 en semiárido (≤0,2) → 1 en húmedo (≥0,65). Ríos: 0 con 5 m³/s → 1 con ≥500 m³/s (escala log).",
  },
  {
    id: "F02", nombre: "Calidad del agua subterránea", grupo: "agua", peso: 0.06, unidad: "prob.",
    variable: "probabilidad modelada de As > 10 µg/L y de F > 1,5 mg/L (Podgorski & Berg)",
    fn: { kind: "decreasing", a: 0.2, b: 0.8 },
    score: (c, i, fn) => {
      // con un río grande cerca la fuente puede ser superficial: no se penaliza el acuífero
      if (c.q_rio25[i] >= 50) return 1;
      const f = fn ?? { kind: "decreasing", a: 0.2, b: 0.8 };
      const a = evaluate(f, c.as_prob[i]);
      const fl = evaluate(f, c.f_prob[i]);
      return Number.isFinite(fl) ? Math.min(a, fl) : a;
    },
    disponible: true, evidencia: ["E", "N"],
    refs: ["Podgorski & Berg 2020 (Science)", "Podgorski & Berg 2022 (Nat. Commun.)", "OMS GDWQ 4.ª ed. 2022", "CAA art. 982"],
    nota: "Probabilidades de un modelo global entrenado con mediciones; no reemplaza análisis locales. Licencia de datos sin declarar: se usan promedios por celda con cita.",
  },
  {
    id: "F03", nombre: "Confort térmico (aprox.)", grupo: "clima", peso: 0.08, unidad: "°C",
    variable: "temp. máx. del mes más cálido y mín. del mes más frío (WorldClim)",
    score: (c, i) =>
      0.5 * evaluate({ kind: "decreasing", a: 28, b: 36 }, c.t_max_cal[i]) +
      0.5 * evaluate({ kind: "increasing", a: -6, b: 4 }, c.t_min_fri[i]),
    disponible: true, evidencia: ["E", "J"],
    refs: ["Bröde et al. 2012 (UTCI)", "Błażejczyk et al. 2012", "Fick & Hijmans 2017"],
    nota:
      "Aproximación al % de horas sin estrés térmico UTCI (9–26 °C), que requiere ERA5-HEAT horario. " +
      "Calor: 1 con máx. ≤28 °C → 0 con ≥36 °C. Frío: 0 con mín. ≤−6 °C → 1 con ≥4 °C.",
  },
  {
    id: "F04", nombre: "Demanda energética climática", grupo: "clima", peso: 0.05, unidad: "°C·día",
    variable: "HDD18 + 1,5·CDD18 (grados-día anuales desde medias mensuales)",
    fn: { kind: "decreasing", a: 500, b: 3500 },
    score: (c, i, fn) => evaluate(fn!, c.hdd18[i] + 1.5 * c.cdd18[i]),
    disponible: true, evidencia: ["N", "J"], refs: ["IRAM 11603", "ASHRAE 169"],
    nota: "Los grados-día calculados con medias mensuales subestiman los diarios en climas de gran amplitud.",
  },
  {
    id: "F05", nombre: "Accesibilidad a ciudad ≥50.000 hab.", grupo: "acceso", peso: 0.12, unidad: "min",
    variable: "tiempo de viaje (Weiss et al. 2018)", column: "t_ciudad",
    fn: { kind: "trapezoid", a: 10, b: 30, c: 90, d: 240 },
    disponible: true, evidencia: ["E", "C"], refs: ["Weiss et al. 2018", "Nelson et al. 2019", "Sejong 2004"],
    nota: "Óptimo a 30–90 min: suficientemente cerca para compartir servicios, suficientemente lejos para no ser periferia.",
  },
  {
    id: "F06", nombre: "Conectividad de transporte", grupo: "acceso", peso: 0.06, unidad: "km",
    variable: "distancia a ruta nacional pavimentada (50 %), ferrocarril operativo (20 %) y puerto (30 %)",
    score: (c, i) =>
      0.5 * evaluate({ kind: "decreasing", a: 5, b: 60 }, c.d_ruta[i]) +
      0.2 * evaluate({ kind: "decreasing", a: 5, b: 60 }, c.d_ffcc[i]) +
      0.3 * evaluate({ kind: "decreasing", a: 60, b: 300 }, c.d_puerto[i]),
    disponible: true, evidencia: ["J"], refs: ["Nelson et al. 2019", "Pablo-Martí et al. 2022"],
  },
  {
    id: "F07", nombre: "Pendiente", grupo: "topo", peso: 0.06, unidad: "%",
    variable: "pendiente media (MDE 1 km)", column: "pend_media",
    fn: { kind: "trapezoid", a: 0, b: 1, c: 5, d: 25, fa: 0.8 },
    disponible: true, evidencia: ["E", "J"], refs: ["Dong et al. 2008", "Aly et al. 2005", "Liu et al. 2021"],
    nota: "Terreno muy llano (<1 %) penaliza levemente por drenaje. El MDE de 1 km subestima la pendiente local.",
  },
  {
    id: "F08", nombre: "Peligro sísmico", grupo: "riesgo", peso: 0.08, unidad: "g",
    variable: "PGA con 10 % de excedencia en 50 años (T=475), roca", column: "pga475",
    fn: { kind: "decreasing", a: 0.1, b: 0.35 },
    disponible: true, evidencia: ["E", "N"], refs: ["Pagani et al. 2023 (GEM)", "INPRES-CIRSOC 103"],
  },
  {
    id: "F09", nombre: "Peligro de inundación", grupo: "riesgo", peso: 0.07, unidad: "fracción",
    variable: "fracción de la celda en planicie T=100 años (JRC)", column: "frac_inund100",
    fn: { kind: "decreasing", a: 0, b: 1 },
    disponible: true, evidencia: ["E"], refs: ["Dottori et al. 2016"],
    nota: "El mapa global omite cuencas <5.000 km² y anegamientos por napa (Salado); subestima el riesgo pampeano.",
  },
  {
    id: "F10", nombre: "Deslizamientos", grupo: "riesgo", peso: 0.03, unidad: "clase",
    variable: "susceptibilidad a remoción en masa", disponible: false, evidencia: ["E"],
    refs: ["Stanley & Kirschbaum 2017"], nota: "Pendiente de incorporar (NASA LHASA / SEGEMAR).",
  },
  {
    id: "F11", nombre: "Acceso a red de alta tensión", grupo: "energia", peso: 0.05, unidad: "km",
    variable: "distancia a línea de transmisión (IGN)", column: "d_alta_tension",
    fn: { kind: "decreasing", a: 10, b: 100 },
    disponible: true, evidencia: ["J"], refs: ["Arderne et al. 2020"],
  },
  {
    id: "F12", nombre: "Recurso renovable local", grupo: "energia", peso: 0.03, unidad: "",
    variable: "máx. entre radiación solar (3,5→6 kWh/m²/día) y potencia eólica a 100 m (200→600 W/m²)",
    score: (c, i) =>
      Math.max(
        evaluate({ kind: "increasing", a: 3.5, b: 6 }, c.ghi[i]),
        evaluate({ kind: "increasing", a: 200, b: 600 }, wpd(c.viento100[i])),
      ),
    disponible: true, evidencia: ["J"], refs: ["Global Wind Atlas 3 (Davis et al. 2023)", "Fick & Hijmans 2017"],
    nota: "Potencia eólica estimada desde la velocidad media suponiendo Weibull k=2.",
  },
  {
    id: "F13", nombre: "Costo de oportunidad agrícola", grupo: "agro", peso: 0.05, unidad: "clase",
    variable: "clase de capacidad de uso del suelo (INTA)", disponible: false, evidencia: ["E"],
    refs: ["Klingebiel & Montgomery 1961", "Bren d'Amour et al. 2017"],
    nota: "Pendiente de incorporar el Atlas de Suelos INTA 1:500.000.",
  },
  {
    id: "F14", nombre: "Acceso a servicios de salud", grupo: "acceso", peso: 0.04, unidad: "min",
    variable: "tiempo motorizado al establecimiento de salud más cercano (Weiss et al. 2020)", column: "t_salud",
    fn: { kind: "decreasing", a: 30, b: 180 },
    disponible: true, evidencia: ["J"], refs: ["Weiss et al. 2020"],
    nota: "Incluye cualquier establecimiento, no solo alta complejidad.",
  },
  {
    id: "F15", nombre: "Equilibrio territorial", grupo: "equilibrio", peso: 0.08, unidad: "km",
    variable: "distancia al AMBA (Plaza de Mayo)", column: "d_amba",
    fn: { kind: "increasing", a: 100, b: 1200 },
    disponible: true, evidencia: ["C", "J"], refs: ["Sejong 2004", "Salim & Negara 2019", "Sordoni 2021 (Viedma)"],
    nota: "Criterio político: cuánto contribuye el sitio a descomprimir el AMBA.",
  },

  // ---------------------------------------------------------------- factores de política
  {
    id: "G01", nombre: "Ancla de empleo", grupo: "trabajo", peso: 0, unidad: "puestos/hab",
    variable: "puestos registrados privados a ≤50 km por habitante objetivo (SIPA 2022)",
    fn: { kind: "increasing", a: 0, b: 0.4 },
    score: (c, i, fn, ctx) => evaluate(fn!, c.empleo_50km[i] / Math.max(ctx?.poblacion ?? 500_000, 1)),
    disponible: true, evidencia: ["C", "J"], refs: ["ECES 2026", "Keeton & Provoost 2019", "Fundar 2023 (Tierra del Fuego)"],
    nota: "La causa más repetida del fracaso de ciudades nuevas es la falta de empleo local (docs/politicas-territoriales.md).",
  },
  {
    id: "G04", nombre: "Dinamismo demográfico regional", grupo: "trabajo", peso: 0, unidad: "%/año",
    variable: "crecimiento anual de la población del departamento 2010–2022", column: "crec_dep",
    fn: { kind: "increasing", a: 0, b: 2.5 },
    disponible: true, evidencia: ["J"], refs: ["INDEC Censos 2010 y 2022"],
  },
  {
    id: "I01", nombre: "Dinamismo del empleo", grupo: "trabajo", peso: 0, unidad: "%/año",
    variable: "crecimiento anual del empleo privado registrado 2014–2022 (departamento)", column: "emp_crec",
    fn: { kind: "increasing", a: -1, b: 3 },
    disponible: true, evidencia: ["E"], refs: ["Kline & Moretti 2014", "CEP XXI / SIPA"],
  },
  {
    id: "I02", nombre: "Salario relativo", grupo: "trabajo", peso: 0, unidad: "× media nac.",
    variable: "salario medio privado del departamento sobre la media nacional (2022)", column: "salario_rel",
    fn: { kind: "increasing", a: 0.7, b: 1.3 },
    disponible: true, evidencia: ["E"], refs: ["Kennan & Walker 2011", "Basso 2023"],
  },
  {
    id: "E01", nombre: "Mercado laboral regional", grupo: "trabajo", peso: 0, unidad: "puestos",
    variable: "puestos registrados privados a ≤50 km", column: "empleo_50km",
    fn: { kind: "increasing", a: 5000, b: 300000, log: true },
    disponible: true, evidencia: ["E"], refs: ["Morten & Oliveira 2024", "Karamaneff & Salvia 2019"],
  },
  {
    id: "E06", nombre: "Proyectos productivos cercanos", grupo: "trabajo", peso: 0, unidad: "proyectos",
    variable: "minería en desarrollo/operación, Vaca Muerta y energía en obra a ≤100 km", column: "n_proyectos_100km",
    fn: { kind: "increasing", a: 0, b: 8 },
    disponible: true, evidencia: ["J"], refs: ["SIACAM", "Secretaría de Energía", "CAMMESA/RenovAr"],
  },
  {
    id: "E02", nombre: "Parque industrial cercano", grupo: "trabajo", peso: 0, unidad: "km",
    variable: "distancia al parque industrial más cercano (RENPI)", column: "d_parque_ind",
    fn: { kind: "decreasing", a: 10, b: 150 },
    disponible: true, evidencia: ["J"], refs: ["RENPI", "Kline & Moretti 2014"],
  },
  {
    id: "E03", nombre: "Universidad cercana", grupo: "servicios", peso: 0, unidad: "km",
    variable: "distancia a la sede universitaria más cercana (IGN)", column: "d_universidad",
    fn: { kind: "decreasing", a: 10, b: 120 },
    disponible: true, evidencia: ["E"], refs: ["Neumark & Simpson 2015"],
  },
  {
    id: "S01", nombre: "Redes de agua y cloaca", grupo: "servicios", peso: 0, unidad: "% hogares",
    variable: "hogares con agua de red (60 %) y cloaca (40 %), Censo 2022",
    score: (c, i) =>
      0.6 * evaluate({ kind: "increasing", a: 50, b: 95 }, c.pct_agua_red[i]) +
      0.4 * evaluate({ kind: "increasing", a: 20, b: 90 }, c.pct_cloaca[i]),
    disponible: true, evidencia: ["J"], refs: ["INDEC Censo 2022", "revisión bibliográfica §5"],
  },
  {
    id: "S02", nombre: "Hospital cercano", grupo: "servicios", peso: 0, unidad: "km",
    variable: "distancia al hospital de internación general más cercano (REFES)", column: "d_hospital",
    fn: { kind: "decreasing", a: 10, b: 100 },
    disponible: true, evidencia: ["J"], refs: ["REFES/SISA vía Poblaciones"],
  },
  {
    id: "S03", nombre: "Viviendas desocupadas disponibles", grupo: "servicios", peso: 0, unidad: "viv./hab",
    variable: "viviendas desocupadas (no de veraneo) a ≤50 km por habitante objetivo, Censo 2022",
    fn: { kind: "increasing", a: 0, b: 0.15 },
    score: (c, i, fn, ctx) => evaluate(fn!, c.viv_ociosas_50km[i] / Math.max(ctx?.poblacion ?? 500_000, 1)),
    disponible: true, evidencia: ["J"], refs: ["INDEC Censo 2022"],
  },
  {
    id: "S04", nombre: "Conectividad a internet", grupo: "servicios", peso: 0, unidad: "% hogares",
    variable: "hogares con internet (departamento, Censo 2022)", column: "pct_internet",
    fn: { kind: "increasing", a: 40, b: 90 },
    disponible: true, evidencia: ["J"], refs: ["INDEC Censo 2022", "Plan DHI p. 50 (trabajo remoto)"],
  },
  {
    id: "T01", nombre: "Tierra pública disponible", grupo: "tierra", peso: 0, unidad: "%",
    variable: "% fiscal estimado del departamento (CNA 2018 + residuo fuera de explotaciones calibrado con catastros de Neuquén y TDF); 1 si la zona es fiscal según catastro",
    fn: { kind: "increasing", a: 0, b: 40 },
    score: (c, i, fn) => Math.max(evaluate(fn ?? { kind: "increasing", a: 0, b: 40 }, c.pct_fiscal_est[i]), c.frac_fiscal_conocida[i] >= 0.5 ? 1 : 0),
    disponible: true, evidencia: ["J"], refs: ["INDEC CNA 2018", "Catastro de Neuquén (FISCALIDAD)", "Tierra del Fuego, tierras fiscales", "docs/propiedad-tierra.md §9"],
    nota: "Estimación [J]: no hay catastro nacional de tierra fiscal. El dominio es provincial (art. 124 CN) y la tierra fiscal suele estar ocupada por pobladores.",
  },
  {
    id: "P06", nombre: "Pueblo que pierde habitantes", grupo: "equilibrio", peso: 0, unidad: "%/año",
    variable: "crecimiento anual 2010–2022 del departamento; prioriza un declive moderado", column: "crec_dep",
    fn: { kind: "trapezoid", a: -4.2, b: -1.8, c: 0, d: 2.5 },
    disponible: true, evidencia: ["J"], refs: ["docs/politicas-territoriales.md §4", "programa AGER (España)"],
    nota: "Juicio experto: los pueblos en declive moderado tienen infraestructura ociosa recuperable.",
  },
  {
    id: "K01", nombre: "Centralidad poblacional", grupo: "centralidad", peso: 0, unidad: "km",
    variable: "distancia media de la población del país a la celda (ponderada por población)", column: "d_media_pob",
    fn: { kind: "decreasing", a: 500, b: 1500 },
    disponible: true, evidencia: ["E"], refs: ["Campante & Do 2014 (capitales aisladas y corrupción)"],
  },
  {
    id: "K02", nombre: "Acceso desde todas las provincias", grupo: "centralidad", peso: 0, unidad: "km",
    variable: "distancia a la capital provincial más lejana", column: "d_max_capital",
    fn: { kind: "decreasing", a: 1700, b: 3000 },
    disponible: true, evidencia: ["E"], refs: ["Morten & Oliveira 2024 (rutas a Brasília)"],
  },
  {
    id: "K03", nombre: "Ciudad base existente", grupo: "centralidad", peso: 0, unidad: "hab",
    variable: "población a ≤50 km (tamaño de la ciudad base)", column: "pob_50km",
    fn: { kind: "trapezoid", a: 50000, b: 150000, c: 800000, d: 1500000 },
    disponible: true, evidencia: ["C"], refs: ["Islamabad, Putrajaya, Canberra, La Plata", "ECES 2026"],
  },
  {
    id: "K04", nombre: "Rezago social (equidad)", grupo: "equilibrio", peso: 0, unidad: "% NBI",
    variable: "hogares con NBI en el departamento (Censo 2022)", column: "pct_nbi",
    fn: { kind: "increasing", a: 4, b: 20 },
    disponible: true, evidencia: ["J"], refs: ["Austin, Glaeser & Summers 2018", "Plan DHI p. 309"],
  },
];

export interface Restriction {
  id: string;
  nombre: string;
  column: string;
  op: ">" | "<" | ">=";
  umbral: number;
  activo: boolean;
  min: number;
  max: number;
  step: number;
  unidad: string;
  evidencia: Evidence[];
  refs: string[];
  nota?: string;
}

export const RESTRICTIONS: Restriction[] = [
  {
    id: "R01", nombre: "Área protegida estricta", column: "frac_ap_estricta", op: ">", umbral: 0.5, activo: true,
    min: 0, max: 1, step: 0.05, unidad: "fracción", evidencia: ["N"], refs: ["Ley 22.351", "Ley 26.331", "Ley 26.639"],
    nota: "Parques, monumentos, reservas integrales. Falta incorporar OTBN categorías I–II y el inventario de glaciares.",
  },
  {
    id: "R01b", nombre: "Área protegida de uso múltiple", column: "frac_ap_uso_multiple", op: ">", umbral: 0.5,
    activo: false, min: 0, max: 1, step: 0.05, unidad: "fracción", evidencia: ["J"], refs: ["UNESCO MAB", "Ramsar"],
    nota: "Reservas de biosfera, sitios Ramsar y reservas de uso múltiple admiten asentamientos.",
  },
  {
    id: "R03", nombre: "Planicie de inundación T=100", column: "frac_inund100", op: ">", umbral: 0.5, activo: true,
    min: 0, max: 1, step: 0.05, unidad: "fracción", evidencia: ["E", "N"], refs: ["Dottori et al. 2016", "PNUD-SSPTIP 2010"],
    nota: "A nivel de sitio se excluye toda la planicie; a escala de celda de 36 km² se excluye si supera el umbral.",
  },
  {
    id: "R04", nombre: "Pendiente: poca superficie ≤15 %", column: "frac_pend_ok", op: "<", umbral: 0.5, activo: true,
    min: 0, max: 1, step: 0.05, unidad: "fracción", evidencia: ["N", "J"], refs: ["Normas locales 15/25/30 %"],
    nota: "Fracción de la celda con pendiente ≤15 % (MDE 1 km). Sejong exigió ≥50 % de suelo urbanizable.",
  },
  {
    id: "R06", nombre: "Sismicidad muy alta", column: "pga475", op: ">=", umbral: 0.35, activo: true,
    min: 0.1, max: 0.6, step: 0.01, unidad: "g", evidencia: ["N", "J"], refs: ["INPRES-CIRSOC 103 (zona 4 ≈ 0,35 g)", "GEM 2023"],
    nota: "Restricción blanda: la norma no prohíbe construir, pero eleva costos y riesgo residual.",
  },
  {
    id: "R09", nombre: "Altitud", column: "elev", op: ">", umbral: 2500, activo: true,
    min: 1000, max: 4500, step: 100, unidad: "m", evidencia: ["E", "J"], refs: ["Hackett & Roach 2001"],
  },
  {
    id: "R10", nombre: "Costa baja", column: "elev", op: "<", umbral: 5, activo: true,
    min: 0, max: 20, step: 1, unidad: "m", evidencia: ["E"], refs: ["McGranahan et al. 2007"],
  },
  {
    id: "R11", nombre: "Ya urbanizada (ciudad nueva)", column: "pob", op: ">", umbral: 3600, activo: true,
    min: 0, max: 50000, step: 100, unidad: "hab/celda", evidencia: ["C", "J"], refs: ["Sejong 2004"],
    nota: "Para planificar ciudades nuevas, excluye celdas con más de ~100 hab/km² (3.600 hab por celda de 36 km²). Desactivar para evaluar la expansión de ciudades existentes.",
  },
  {
    id: "R15", nombre: "Lejos de pueblos existentes", column: "d_localidad", op: ">", umbral: 30, activo: false,
    min: 5, max: 100, step: 5, unidad: "km", evidencia: ["C"], refs: ["Plan DHI 2023, p. 39 y 49"],
    nota: "Variante del Plan DHI: repoblar a no más de 30 km de un ejido urbano existente (localidades BAHRA).",
  },
];

// ------------------------------------------------------------------ escenarios de pesos

export type Weights = Record<string, number>;

export const baseWeights = (): Weights => Object.fromEntries(FACTORS.map((f) => [f.id, f.peso]));

function scaleGroups(target: Partial<Record<GroupId, number>>): Weights {
  const base = baseWeights();
  const gsum: Record<string, number> = {};
  for (const f of FACTORS) gsum[f.grupo] = (gsum[f.grupo] ?? 0) + f.peso;
  const fixed = Object.values(target).reduce((a, b) => a + (b ?? 0), 0);
  const restBase = FACTORS.filter((f) => !(f.grupo in target)).reduce((a, f) => a + f.peso, 0);
  const w: Weights = {};
  for (const f of FACTORS) {
    const t = target[f.grupo];
    if (!gsum[f.grupo]) w[f.id] = 0; // grupos sin peso base (factores de política)
    else w[f.id] = t !== undefined ? (t * base[f.id]) / gsum[f.grupo] : (base[f.id] * (1 - fixed)) / restBase;
  }
  return w;
}

export const SCENARIOS: { id: string; nombre: string; desc: string; weights: () => Weights }[] = [
  { id: "E1", nombre: "E1 · Base (literatura)", desc: "Pesos base propuestos en la revisión bibliográfica (§7).", weights: baseWeights },
  {
    id: "E0", nombre: "E0 · Grupos iguales", desc: "Cada uno de los 8 grupos físico-territoriales pesa 1/8.",
    weights: () => {
      const base = new Set(FACTORS.filter((f) => f.peso > 0).map((f) => f.grupo));
      return scaleGroups(Object.fromEntries([...base].map((g) => [g, 1 / base.size])));
    },
  },
  {
    id: "E2", nombre: "E2 · Sejong", desc: "Equilibrio territorial 0,36 y accesibilidad 0,24, como la nueva capital coreana.",
    weights: () => scaleGroups({ equilibrio: 0.36, acceso: 0.24 }),
  },
  {
    id: "E3", nombre: "E3 · Ambiental-hídrico", desc: "Agua 0,30 y riesgos 0,25.",
    weights: () => scaleGroups({ agua: 0.3, riesgo: 0.25 }),
  },
  {
    id: "E4", nombre: "E4 · Plan DHI (Fundación DHI, 2023)",
    desc:
      "Pesos inferidos del Plan de Desarrollo Humano Integral: desconcentrar es la tesis central (p. 38–39), 87 % de " +
      "sus obras son hídricas (p. 198–200) y casi no trata riesgos naturales. Ver docs/plan-dhi-resumen.md.",
    weights: () =>
      scaleGroups({ equilibrio: 0.3, acceso: 0.2, agua: 0.2, energia: 0.1, riesgo: 0.07, agro: 0.06, clima: 0.04, topo: 0.03 }),
  },
];

/** Pesos efectivos: solo factores con datos, normalizados a 1. */
export function effectiveWeights(w: Weights): Weights {
  const avail = FACTORS.filter((f) => f.disponible);
  const s = avail.reduce((a, f) => a + (w[f.id] ?? 0), 0) || 1;
  return Object.fromEntries(avail.map((f) => [f.id, (w[f.id] ?? 0) / s]));
}
