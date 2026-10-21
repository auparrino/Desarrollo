// Instrumentos de política territorial. Cada uno define su unidad de análisis
// (mediante restricciones), sus factores y pesos y sus advertencias, según
// docs/politicas-territoriales.md (§6) y docs/revision-bibliografica.md.

import { FACTORS, RESTRICTIONS, SCENARIOS, type Restriction, type Weights } from "./criteria";

export type PolicyId = "ciudad_nueva" | "capital" | "intermedias" | "pueblos" | "polos";

export interface Cost {
  concepto: string;
  valor: number; // USD
  unidad: "USD/hab" | "USD/lote" | "USD/vivienda" | "USD/empleo";
  fuente: string;
}

export interface Policy {
  id: PolicyId;
  icono: string;
  nombre: string;
  pregunta: string; // en lenguaje llano
  unidad: string;
  evidencia: string[]; // lo que dice la evidencia, en lenguaje llano
  weights: () => Weights;
  restrictions: () => Restriction[];
  requiereSuperficie: boolean;
  agua: boolean; // aplica R13 (suficiencia hídrica para la población objetivo)
  tamanos: number[];
  costos: Cost[];
  plazo?: string;
}

const extra = (r: Omit<Restriction, "min" | "max" | "step" | "evidencia" | "refs"> & Partial<Restriction>): Restriction => ({
  min: 0, max: 100, step: 1, evidencia: ["C"], refs: [], ...r,
});

/** Restricciones base con cambios puntuales y restricciones propias del instrumento. */
function restr(over: Record<string, Partial<Restriction>>, extras: Restriction[] = []): Restriction[] {
  return [...RESTRICTIONS.map((r) => ({ ...r, ...(over[r.id] ?? {}) })), ...extras];
}

function weights(w: Record<string, number>): Weights {
  const out: Weights = Object.fromEntries(FACTORS.map((f) => [f.id, 0]));
  for (const [k, v] of Object.entries(w)) out[k] = v;
  return out;
}

const scale = (w: Weights, k: number): Weights => Object.fromEntries(Object.entries(w).map(([a, b]) => [a, b * k]));

const LOTE_DHI: Cost = { concepto: "Lote con servicios (tierra + obras)", valor: 12000, unidad: "USD/lote", fuente: "Plan DHI p. 39–40" };

export const POLICIES: Policy[] = [
  {
    id: "ciudad_nueva",
    icono: "🏗️",
    nombre: "Crear una ciudad nueva",
    pregunta: "¿Dónde conviene fundar una ciudad desde cero?",
    unidad: "Lugares con terreno libre suficiente para toda la población",
    evidencia: [
      "En los casos con datos, las ciudades nuevas alcanzan en promedio menos del 15 % de la población planeada.",
      "La causa de fracaso más repetida es la falta de empleo: funcionan las conectadas a una ciudad grande o con una actividad económica que las sostenga (La Plata, Tierra del Fuego).",
    ],
    weights: () => ({
      ...scale(SCENARIOS[0].weights(), 0.55),
      F05: SCENARIOS[0].weights().F05 * 0.55 + 0.1,
      G01: 0.2, T01: 0.08, G04: 0.07,
    }),
    restrictions: () =>
      restr({ R11: { activo: true, umbral: 3600 }, R15: { activo: false } }, [
        extra({ id: "G-R1", nombre: "Pegada a una metrópoli", column: "d_metro", op: "<", umbral: 30, activo: true, max: 150, step: 5, unidad: "km",
          nota: "A menos de 30 km de una metrópoli sería un suburbio, no una ciudad nueva.", refs: ["docs/politicas-territoriales.md §6"] }),
      ]),
    requiereSuperficie: true,
    agua: true,
    tamanos: [100_000, 250_000, 500_000, 1_000_000],
    costos: [
      { concepto: "Nusantara (Indonesia): costo total / población meta", valor: 23000, unidad: "USD/hab", fuente: "Bappenas en Salim & Negara 2019" },
      { concepto: "Putrajaya (Malasia): costo / población meta", valor: 25000, unidad: "USD/hab", fuente: "estimación sobre fuentes secundarias" },
      LOTE_DHI,
    ],
    plazo: "Décadas: las new towns exitosas tardaron 20–40 años en consolidarse.",
  },
  {
    id: "capital",
    icono: "🏛️",
    nombre: "Trasladar la capital",
    pregunta: "¿Dónde podría ir una nueva capital del país?",
    unidad: "Lugares a menos de 45 minutos de una ciudad existente que sirva de base",
    evidencia: [
      "Ningún traslado de capital redujo de forma medible el peso de la ciudad de origen (Lagos, Karachi, El Cairo, Seúl).",
      "Sí hace crecer a la ciudad que recibe la capital: por cada empleo público trasladado se crea alrededor de un empleo privado, muy cerca.",
      "Las capitales aisladas de la población se asocian con más corrupción: conviene un lugar central y accesible.",
      "Viedma (1987) no fracasó por el sitio, sino por la crisis económica y política.",
    ],
    weights: () =>
      weights({ K01: 0.2, K02: 0.15, K03: 0.15, K04: 0.1, F15: 0.05, T01: 0.05, F01: 0.08, F02: 0.02, F03: 0.06, F08: 0.06, F09: 0.05, F07: 0.03 }),
    restrictions: () =>
      restr({ R11: { activo: false }, R15: { activo: false } }, [
        extra({ id: "K-R1", nombre: "Sin ciudad base cerca", column: "t_ciudad", op: ">", umbral: 45, activo: true, max: 180, step: 5, unidad: "min",
          nota: "La capital necesita una ciudad de ≥50.000 hab. a ≤45 min (Islamabad, Putrajaya, La Plata).", refs: ["docs/politicas-territoriales.md §1"] }),
      ]),
    requiereSuperficie: true,
    agua: true,
    tamanos: [100_000, 250_000, 500_000],
    costos: [
      { concepto: "Nusantara: costo total / población meta", valor: 23000, unidad: "USD/hab", fuente: "Bappenas en Salim & Negara 2019" },
      { concepto: "Putrajaya: costo por habitante real (2020)", valor: 74000, unidad: "USD/hab", fuente: "estimación sobre fuentes secundarias y auditoría nacional" },
    ],
    plazo: "Entre 15 y 46 años según los casos (Abuja, Canberra, Dodoma); exige continuidad política.",
  },
  {
    id: "intermedias",
    icono: "🏙️",
    nombre: "Fortalecer ciudades intermedias",
    pregunta: "¿Qué ciudades existentes podrían recibir más población?",
    unidad: "Ciudades de regiones de 50.000 a 1 millón de habitantes, fuera del AMBA",
    evidencia: [
      "Atraer población requiere empleo y vivienda a la vez: el empleo solo no alcanza.",
      "La movilidad entre provincias está bajando: el 15,8 % vive fuera de su provincia natal (20,9 % en 2010).",
      "Las ciudades de 50.000 a 500.000 habitantes son las que más crecieron en las últimas décadas.",
    ],
    weights: () =>
      weights({ I01: 0.25, I02: 0.1, S03: 0.15, S02: 0.05, F14: 0.05, F06: 0.1, G04: 0.1, S01: 0.1, F01: 0.05, F08: 0.05 }),
    restrictions: () =>
      restr({ R11: { activo: false }, R15: { activo: false }, R04: { activo: false } }, [
        extra({ id: "I-R0", nombre: "No es zona urbana", column: "pob", op: "<", umbral: 5000, activo: true, max: 50000, step: 500, unidad: "hab/celda" }),
        extra({ id: "I-R1", nombre: "Ciudad chica (región <50.000 hab.)", column: "pob_50km", op: "<", umbral: 50000, activo: true, max: 500000, step: 10000, unidad: "hab" }),
        extra({ id: "I-R2", nombre: "Metrópoli (región >1 M hab.)", column: "pob_50km", op: ">", umbral: 1_000_000, activo: true, max: 5_000_000, step: 100000, unidad: "hab" }),
        extra({ id: "I-R3", nombre: "Dentro del área del AMBA", column: "d_amba", op: "<", umbral: 100, activo: true, max: 400, step: 10, unidad: "km" }),
        extra({ id: "I-R4", nombre: "Poca cobertura de agua de red", column: "pct_agua_red", op: "<", umbral: 50, activo: true, unidad: "% hogares",
          nota: "Sin redes básicas la ciudad no puede absorber población sin obras previas." }),
      ]),
    requiereSuperficie: false,
    agua: false,
    tamanos: [20_000, 50_000, 100_000, 250_000],
    costos: [
      { concepto: "Vivienda social terminada con servicios", valor: 30000, unidad: "USD/vivienda", fuente: "fuente secundaria (Bekerman); verificar" },
      LOTE_DHI,
    ],
  },
  {
    id: "pueblos",
    icono: "🏡",
    nombre: "Repoblar pueblos",
    pregunta: "¿Qué pueblos podrían recuperar habitantes?",
    unidad: "Pueblos de 200 a 5.000 habitantes a menos de 40 minutos de una ciudad, como propone el Plan DHI",
    evidencia: [
      "Ningún programa de repoblamiento (España, Japón, Italia, Argentina) tiene una evaluación rigurosa de resultados.",
      "En Japón, el 57,5 % de quienes se mudan sigue en el pueblo años después: conviene medir la permanencia.",
      "Con un radio de 30 km a una ciudad es suburbanización rural más que ocupación del territorio vacío.",
    ],
    weights: () => weights({ S04: 0.2, S03: 0.15, S02: 0.1, F14: 0.05, E01: 0.2, F05: 0.15, P06: 0.1, F02: 0.05 }),
    restrictions: () =>
      restr({ R11: { activo: false }, R15: { activo: false } }, [
        extra({ id: "P-R0", nombre: "Sin pueblo (menos de 200 hab.)", column: "pob", op: "<", umbral: 200, activo: true, max: 5000, step: 50, unidad: "hab/celda" }),
        extra({ id: "P-R1", nombre: "Ya es ciudad (más de 5.000 hab. en la zona)", column: "pob", op: ">", umbral: 5000, activo: true, max: 100000, step: 1000, unidad: "hab/celda" }),
        extra({ id: "P-R2", nombre: "Lejos de una ciudad", column: "t_ciudad", op: ">", umbral: 40, activo: true, max: 180, step: 5, unidad: "min",
          refs: ["Plan DHI p. 39, 49"], nota: "El Plan DHI propone repoblar a ≤30 km de un ejido urbano." }),
      ]),
    requiereSuperficie: false,
    agua: true,
    tamanos: [1_000, 5_000, 20_000, 50_000],
    costos: [LOTE_DHI],
  },
  {
    id: "polos",
    icono: "🏭",
    nombre: "Crear polos productivos",
    pregunta: "¿Dónde conviene impulsar un polo de empleo?",
    unidad: "Lugares fuera del AMBA, a menos de 50 km de una ciudad de 100.000 habitantes o más y con red eléctrica",
    evidencia: [
      "Los polos sin una ciudad base o demasiados polos a la vez suelen fracasar.",
      "La promoción industrial de La Rioja, Catamarca, San Luis y San Juan costó cerca de USD 461.000 por empleo (estimación de una parte interesada).",
      "Parte del efecto es relocalización desde otras regiones, no empleo nuevo para el país.",
    ],
    weights: () => weights({ E01: 0.2, E02: 0.2, E03: 0.15, F06: 0.15, E06: 0.1, K04: 0.1, F11: 0.1 }),
    restrictions: () =>
      restr({ R11: { activo: false }, R15: { activo: false } }, [
        extra({ id: "E-R1", nombre: "Sin ciudad base (región <100.000 hab.)", column: "pob_50km", op: "<", umbral: 100000, activo: true, max: 1_000_000, step: 10000, unidad: "hab" }),
        extra({ id: "E-R3", nombre: "Dentro del área del AMBA", column: "d_amba", op: "<", umbral: 100, activo: true, max: 400, step: 10, unidad: "km",
          nota: "El objetivo es desconcentrar: los polos se evalúan fuera del AMBA." }),
        extra({ id: "E-R2", nombre: "Lejos de la red de alta tensión", column: "d_alta_tension", op: ">", umbral: 50, activo: true, max: 300, step: 5, unidad: "km" }),
      ]),
    requiereSuperficie: false,
    agua: false,
    tamanos: [5_000, 20_000, 50_000],
    costos: [
      { concepto: "Promoción industrial LR-CAT-SL-SJ: costo fiscal por empleo", valor: 461000, unidad: "USD/empleo", fuente: "Dagnino Pastore (CEM 1999), parte interesada" },
      { concepto: "Tierra del Fuego: costo fiscal anual por empleo electrónico (cota superior)", valor: 126000, unidad: "USD/empleo", fuente: "Fundar 2023" },
    ],
  },
];

export const POLICY_BY_ID = Object.fromEntries(POLICIES.map((p) => [p.id, p])) as Record<PolicyId, Policy>;
