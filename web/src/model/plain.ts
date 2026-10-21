// Capa de lenguaje llano: traduce el modelo técnico a prioridades, clases y
// explicaciones que cualquier persona puede entender.

import { FACTORS, GROUPS, type GroupId, type Weights } from "./criteria";

export interface Priority {
  grupo: GroupId;
  titulo: string;
  pregunta: string;
  icono: string;
}

/** Temas en lenguaje llano. */
export const PRIORITIES: Priority[] = [
  { grupo: "agua", icono: "💧", titulo: "Agua", pregunta: "Que haya agua suficiente y de buena calidad" },
  { grupo: "riesgo", icono: "🛡️", titulo: "Seguridad", pregunta: "Que no haya terremotos fuertes ni inundaciones" },
  { grupo: "clima", icono: "☀️", titulo: "Clima", pregunta: "Que el clima sea vivible, sin calor ni frío extremos" },
  { grupo: "acceso", icono: "🛣️", titulo: "Conexión", pregunta: "Que esté cerca de rutas, ciudades y hospitales" },
  { grupo: "equilibrio", icono: "🗺️", titulo: "Descentralizar", pregunta: "Que ayude a que no todo se concentre en Buenos Aires" },
  { grupo: "trabajo", icono: "💼", titulo: "Trabajo", pregunta: "Que haya empleo y actividad económica cerca" },
  { grupo: "servicios", icono: "🏥", titulo: "Servicios", pregunta: "Que haya agua de red, cloacas, hospital, internet y viviendas" },
  { grupo: "tierra", icono: "📜", titulo: "Tierra pública", pregunta: "Que haya tierra del Estado disponible" },
  { grupo: "centralidad", icono: "🎯", titulo: "Centralidad", pregunta: "Que quede cerca de la mayoría de los argentinos y de todas las provincias" },
  { grupo: "energia", icono: "⚡", titulo: "Energía", pregunta: "Que haya red eléctrica y sol o viento para generar" },
  { grupo: "topo", icono: "⛰️", titulo: "Terreno", pregunta: "Que el terreno sea plano y fácil de construir" },
];

/**
 * Requisitos no negociables: no son una preferencia personal. Conservan el peso que
 * les asigna la literatura (además de las restricciones excluyentes).
 */
export const FIXED_GROUPS: GroupId[] = ["agua", "riesgo", "clima"];
export const BUDGET = 10;

export type Points = Record<string, number>;

const groupWeight = (base: Weights, g: string) =>
  FACTORS.filter((f) => f.grupo === g && f.disponible).reduce((a, f) => a + (base[f.id] ?? 0), 0);

/** Temas negociables que usa el instrumento (con peso base > 0). */
export function prefGroups(base: Weights): GroupId[] {
  return PRIORITIES.map((p) => p.grupo).filter((g) => !FIXED_GROUPS.includes(g) && groupWeight(base, g) > 0);
}

/** Reparto inicial de los puntos proporcional a los pesos de la literatura (resto mayor). */
export function defaultPoints(base: Weights): Points {
  const gs = prefGroups(base);
  const w = gs.map((g) => groupWeight(base, g));
  const tot = w.reduce((a, b) => a + b, 0) || 1;
  const raw = w.map((x) => (x / tot) * BUDGET);
  const pts = raw.map(Math.floor);
  let rest = BUDGET - pts.reduce((a, b) => a + b, 0);
  const order = raw.map((x, k) => [x - Math.floor(x), k]).sort((a, b) => b[0] - a[0]);
  for (const [, k] of order) if (rest-- > 0) pts[k]++;
  return Object.fromEntries(gs.map((g, k) => [g, pts[k]]));
}

/** Pesos: bloque fijo intacto; el resto del peso se reparte según los puntos. */
export function weightsFromPoints(points: Points, base: Weights): Weights {
  const gs = prefGroups(base);
  const wPref = gs.reduce((a, g) => a + groupWeight(base, g), 0);
  const used = gs.reduce((a, g) => a + (points[g] ?? 0), 0) || 1;
  const w: Weights = {};
  for (const f of FACTORS) {
    const b = base[f.id] ?? 0;
    if (!gs.includes(f.grupo as GroupId)) {
      w[f.id] = b;
      continue;
    }
    const gw = groupWeight(base, f.grupo);
    w[f.id] = gw > 0 ? (b / gw) * wPref * ((points[f.grupo] ?? 0) / used) : 0;
  }
  return w;
}

/** Enfoques predefinidos: refuerzan algunos temas y descuentan del resto. */
export const PRESETS: { id: string; nombre: string; desc: string; boost: GroupId[] }[] = [
  { id: "expertos", nombre: "Lo que recomiendan los expertos", desc: "Reparto según la bibliografía especializada.", boost: [] },
  { id: "federal", nombre: "Descentralizar el país", desc: "Más peso a alejarse del AMBA y a la centralidad nacional.", boost: ["equilibrio", "centralidad"] },
  { id: "empleo", nombre: "Empleo primero", desc: "Más peso a que haya trabajo cerca.", boost: ["trabajo"] },
  { id: "conectado", nombre: "Bien conectado", desc: "Más peso a rutas, ciudades y servicios existentes.", boost: ["acceso", "servicios"] },
  { id: "dhi", nombre: "Como propone el Plan DHI", desc: "Desconcentrar y conectar (Plan DHI, Fundación DHI 2023).", boost: ["equilibrio", "acceso"] },
];

export function presetPoints(id: string, base: Weights): Points {
  const pts = defaultPoints(base);
  const p = PRESETS.find((x) => x.id === id);
  const boost = (p?.boost ?? []).filter((g) => g in pts);
  if (!boost.length) return pts;
  let extra = 3 * boost.length;
  for (const g of boost) pts[g] += 3;
  // descontar de los temas no reforzados, empezando por los de más puntos
  while (extra > 0) {
    const cand = Object.keys(pts).filter((g) => !boost.includes(g as GroupId) && pts[g] > 0).sort((a, b) => pts[b] - pts[a]);
    if (!cand.length) break;
    pts[cand[0]]--;
    extra--;
  }
  // si no alcanzó (pocos temas), recortar lo reforzado
  let sum = Object.values(pts).reduce((a, b) => a + b, 0);
  for (const g of boost) while (sum > BUDGET && pts[g] > 1) { pts[g]--; sum--; }
  return pts;
}

// ------------------------------------------------------------------ clases de aptitud

export const CLASSES = [
  { id: 4, nombre: "Excelente", desc: "el 5 % mejor del país" },
  { id: 3, nombre: "Muy buena", desc: "entre el 5 % y el 20 % mejor" },
  { id: 2, nombre: "Buena", desc: "entre el 20 % y el 50 % mejor" },
  { id: 1, nombre: "Regular", desc: "la mitad menos apta" },
] as const;

/** Clase 1–4 por percentil entre las celdas aptas (0 = no apta). */
export function classify(score: Float32Array): Uint8Array {
  const idx: number[] = [];
  for (let i = 0; i < score.length; i++) if (Number.isFinite(score[i])) idx.push(i);
  idx.sort((a, b) => score[b] - score[a]);
  const out = new Uint8Array(score.length);
  const m = idx.length;
  idx.forEach((i, r) => {
    const q = r / m;
    out[i] = q < 0.05 ? 4 : q < 0.2 ? 3 : q < 0.5 ? 2 : 1;
  });
  return out;
}

// ------------------------------------------------------------------ motivos de exclusión

/** Explicación llana de cada restricción (por id). */
export const PLAIN_RESTRICTION: Record<string, { corto: string; largo: string }> = {
  R01: { corto: "Área protegida", largo: "Es un parque nacional, provincial o una reserva natural." },
  R01b: { corto: "Reserva de uso múltiple", largo: "Es una reserva de biosfera, un humedal Ramsar o una reserva de uso múltiple." },
  R03: { corto: "Se inunda", largo: "Más de la mitad de la zona se inundaría en una crecida de las que ocurren cada 100 años." },
  R04: { corto: "Terreno empinado", largo: "Hay poco terreno plano para construir." },
  R06: { corto: "Zona sísmica", largo: "Tiene el mayor peligro de terremotos del país." },
  R09: { corto: "Demasiado alto", largo: "Está a más de 2.500 m de altura, donde vivir es difícil para mucha gente." },
  R10: { corto: "Costa muy baja", largo: "Está a menos de 5 m sobre el nivel del mar, expuesta al mar y a tormentas." },
  R11: { corto: "Ya es ciudad", largo: "Ya está urbanizada: una ciudad nueva tiene que ir en otro lugar." },
  R15: { corto: "Lejos de pueblos", largo: "Está a más de 30 km de un pueblo o ciudad existente." },
  "K-R1": { corto: "Sin ciudad base cerca", largo: "No hay una ciudad de más de 50.000 habitantes a menos de 45 minutos." },
  "I-R0": { corto: "No es zona urbana", largo: "Hay muy poca población: no es parte de una ciudad." },
  "I-R1": { corto: "Ciudad chica", largo: "La región tiene menos de 50.000 habitantes." },
  "I-R2": { corto: "Metrópoli", largo: "Es parte de una gran metrópoli, no de una ciudad intermedia." },
  "I-R3": { corto: "Área del AMBA", largo: "Está dentro del área de influencia de Buenos Aires." },
  "I-R4": { corto: "Sin agua de red", largo: "Menos de la mitad de los hogares del departamento tiene agua de red." },
  "P-R0": { corto: "Sin pueblo", largo: "No hay un pueblo: viven menos de 200 personas en la zona." },
  "P-R1": { corto: "Ya es ciudad", largo: "Ya es una ciudad, no un pueblo." },
  "E-R3": { corto: "Área del AMBA", largo: "Está dentro del área de influencia de Buenos Aires." },
  "G-R1": { corto: "Pegada a una metrópoli", largo: "Está a menos de 30 km de una gran ciudad: sería un suburbio, no una ciudad nueva." },
  "P-R2": { corto: "Lejos de una ciudad", largo: "Está a más de 40 minutos de una ciudad de 50.000 habitantes." },
  "E-R1": { corto: "Sin ciudad base", largo: "Hay menos de 100.000 habitantes en 50 km para sostener un polo." },
  "E-R2": { corto: "Sin red eléctrica", largo: "Está a más de 50 km de una línea de alta tensión." },
  R13: { corto: "Falta agua", largo: "No hay un río con caudal suficiente cerca y el clima es seco." },
};

// ------------------------------------------------------------------ explicación por tema

export type Verdict = "bien" | "regular" | "mal";

export function verdict(v: number): Verdict {
  if (!Number.isFinite(v)) return "regular";
  return v >= 0.7 ? "bien" : v >= 0.4 ? "regular" : "mal";
}

/** Puntaje 0–1 de cada grupo (promedio ponderado de sus factores). */
export function groupScores(fs: Record<string, Float32Array>, i: number, weights?: Weights): Record<GroupId, number> {
  const out = {} as Record<GroupId, number>;
  for (const g of GROUPS) {
    let s = 0;
    let w = 0;
    for (const f of FACTORS) {
      const fw = weights ? weights[f.id] ?? 0 : f.peso;
      if (f.grupo !== g.id || !f.disponible || !fs[f.id] || fw <= 0) continue;
      const v = fs[f.id][i];
      if (Number.isFinite(v)) {
        s += v * fw;
        w += fw;
      }
    }
    out[g.id] = w ? s / w : NaN;
  }
  return out;
}
