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
];

export const DEFAULT_LEVELS: Record<string, Level> = Object.fromEntries(PRIORITIES.map((p) => [p.grupo, 2]));

/** "Importante" en todo = escenario base de la literatura (E1). */
export function weightsFromLevels(levels: Record<string, Level>): Weights {
  const w: Weights = {};
  for (const f of FACTORS) w[f.id] = f.peso * LEVEL_MULT[levels[f.grupo] ?? 2];
  return w;
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
  R13: { corto: "Falta agua", largo: "No hay un río con caudal suficiente cerca y el clima es seco." },
};

// ------------------------------------------------------------------ explicación por tema

export type Verdict = "bien" | "regular" | "mal";

export function verdict(v: number): Verdict {
  if (!Number.isFinite(v)) return "regular";
  return v >= 0.7 ? "bien" : v >= 0.4 ? "regular" : "mal";
}

/** Puntaje 0–1 de cada grupo (promedio ponderado de sus factores). */
export function groupScores(fs: Record<string, Float32Array>, i: number): Record<GroupId, number> {
  const out = {} as Record<GroupId, number>;
  for (const g of GROUPS) {
    let s = 0;
    let w = 0;
    for (const f of FACTORS) {
      if (f.grupo !== g.id || !f.disponible || !fs[f.id]) continue;
      const v = fs[f.id][i];
      if (Number.isFinite(v)) {
        s += v * f.peso;
        w += f.peso;
      }
    }
    out[g.id] = w ? s / w : NaN;
  }
  return out;
}
