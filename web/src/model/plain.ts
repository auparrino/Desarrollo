// Capa de lenguaje llano: traduce el modelo técnico a prioridades, clases y
// explicaciones que cualquier persona puede entender.

import { FACTORS, GROUPS, type GroupId, type Weights } from "./criteria";

export type Level = 0 | 1 | 2 | 3; // nada · poco · importante · muy importante
export const LEVEL_LABELS = ["No me importa", "Poco", "Importante", "Muy importante"];
const LEVEL_MULT = [0, 0.4, 1, 2.5];

export interface Priority {
  grupo: GroupId;
  titulo: string;
  pregunta: string;
  icono: string;
}

/** Prioridades en lenguaje llano (los grupos sin datos disponibles no se muestran). */
export const PRIORITIES: Priority[] = [
  { grupo: "agua", icono: "💧", titulo: "Agua", pregunta: "Que haya agua suficiente para tomar y producir" },
  { grupo: "riesgo", icono: "🛡️", titulo: "Seguridad", pregunta: "Que no haya terremotos ni inundaciones" },
  { grupo: "acceso", icono: "🛣️", titulo: "Conexión", pregunta: "Que esté cerca de rutas, ciudades y hospitales" },
  { grupo: "clima", icono: "☀️", titulo: "Clima", pregunta: "Que el clima sea agradable, sin calor ni frío extremos" },
  { grupo: "equilibrio", icono: "🗺️", titulo: "Descentralizar", pregunta: "Que ayude a que no todo se concentre en Buenos Aires" },
  { grupo: "energia", icono: "⚡", titulo: "Energía", pregunta: "Que haya red eléctrica y sol o viento para generar" },
  { grupo: "topo", icono: "⛰️", titulo: "Terreno", pregunta: "Que el terreno sea plano y fácil de construir" },
  { grupo: "trabajo", icono: "💼", titulo: "Trabajo", pregunta: "Que haya empleo y actividad económica cerca" },
  { grupo: "servicios", icono: "🏥", titulo: "Servicios", pregunta: "Que haya agua de red, cloacas, hospital, internet y viviendas" },
  { grupo: "tierra", icono: "📜", titulo: "Tierra pública", pregunta: "Que haya tierra del Estado disponible" },
  { grupo: "centralidad", icono: "🎯", titulo: "Centralidad", pregunta: "Que quede cerca de la mayoría de los argentinos y de todas las provincias" },
];

export const DEFAULT_LEVELS: Record<string, Level> = Object.fromEntries(PRIORITIES.map((p) => [p.grupo, 2]));

/** "Importante" en todo = pesos base del instrumento (por defecto, el escenario E1 de la literatura). */
export function weightsFromLevels(levels: Record<string, Level>, base?: Weights): Weights {
  const w: Weights = {};
  for (const f of FACTORS) w[f.id] = (base ? base[f.id] ?? 0 : f.peso) * LEVEL_MULT[levels[f.grupo] ?? 2];
  return w;
}

/** Grupos que usa un conjunto de pesos (para mostrar solo las prioridades pertinentes). */
export function groupsUsed(w: Weights): Set<string> {
  return new Set(FACTORS.filter((f) => f.disponible && (w[f.id] ?? 0) > 0).map((f) => f.grupo));
}

export const PRESETS: { id: string; nombre: string; desc: string; levels: Record<string, Level>; scenario?: string }[] = [
  { id: "expertos", nombre: "Lo que recomiendan los expertos", desc: "Pesos de la bibliografía especializada.", levels: DEFAULT_LEVELS },
  {
    id: "seguro", nombre: "Agua y seguridad primero", desc: "Prioriza agua abundante y bajo riesgo de desastres.",
    levels: { ...DEFAULT_LEVELS, agua: 3, riesgo: 3, equilibrio: 1 },
  },
  {
    id: "federal", nombre: "Descentralizar el país", desc: "Prioriza lugares lejos del AMBA, como hizo Corea con Sejong.",
    levels: { ...DEFAULT_LEVELS, equilibrio: 3, acceso: 3, clima: 1 },
  },
  {
    id: "conectado", nombre: "Bien conectado", desc: "Cerca de rutas, ciudades y servicios existentes.",
    levels: { ...DEFAULT_LEVELS, acceso: 3, energia: 3, equilibrio: 1 },
  },
  {
    id: "dhi", nombre: "Como propone el Plan DHI", scenario: "E4",
    desc: "Desconcentrar, agua y conexión, según el Plan de Desarrollo Humano Integral (Fundación DHI, 2023).",
    levels: { ...DEFAULT_LEVELS, equilibrio: 3, riesgo: 1, clima: 1, topo: 1, energia: 3 },
  },
];

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
