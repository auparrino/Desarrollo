// Simulación del proceso de poblamiento año por año: empleo, vivienda, migración y
// nacimientos se condicionan entre sí. Sirve para comparar estrategias (qué se hace
// primero, a qué ritmo, con qué motor de empleo) y no solo resultados finales.
//
// Cada año:
//   empleo para recién llegados = parte del crecimiento normal de la zona + motor de empleo
//                                 (organismos, industria) × (1 + multiplicador local)
//                                 + empleo de la construcción + servicios públicos locales
//   llegadas = min(vacantes × personas por empleo, viviendas libres, tope de captación)
//   salidas  = recién llegados sin trabajo que se van + rotación normal
//   viviendas nuevas según la regla de la estrategia
// Parámetros inciertos con rango (Monte Carlo): multiplicador local, captación de migrantes,
// tasa de salida de los desocupados, crecimiento vegetativo.

export type ReglaVivienda = "todo_al_inicio" | "por_etapas" | "a_demanda";

export interface Estrategia {
  id: string;
  nombre: string;
  descripcion: string;
  regla: ReglaVivienda;
  /** empleos del motor (organismos trasladados, empresas ancla) */
  motorEmpleos: number;
  /** año en que empieza y años que tarda en llegar a pleno */
  motorInicio: number;
  motorDuracion: number;
  /** costo por empleo del motor (USD, una vez) y costo fiscal anual por empleo (incentivos) */
  motorCostoEmpleo: number;
  motorFiscalAnual: number;
  motorFiscalAnios: number;
  /** multiplica la captación de migrantes (programas de retorno, difusión, crédito de mudanza) */
  captacionExtra: number;
  /** costo por hogar que se muda con ayuda (USD) */
  ayudaHogar: number;
  /** fracción de los empleados del motor que se mudan con su familia (el resto viaja) */
  radicacion: number;
  /** fracción de los empleos del motor que se cubre con gente de afuera (traslados, reclutamiento) */
  externos: number;
}

export interface Contexto {
  meta: number; // habitantes objetivo
  puestosZona: number; // puestos privados registrados en la zona
  crecEmpleo: number; // % anual del empleo de la zona (2014–2022)
  poolAnual: number; // mudanzas por año hacia la provincia (de otras provincias y entre departamentos)
  costoVivienda: number; // USD por vivienda con urbanización
  costoTroncal: number; // conexión inicial (USD), se paga al inicio
  beneficioHab: number; // beneficio neto anual por habitante radicado (USD, del costo-beneficio)
  /** año en que pueden llegar los primeros (obras previas) */
  retardo: number;
}

export interface Inciertos {
  multiplicador: number; // empleos locales por empleo del motor (Moretti 2010: 0,6–1,6)
  captacion: number; // fracción máxima del flujo anual hacia la provincia que capta un solo lugar
  salidaDesocupados: number; // fracción de recién llegados sin trabajo que se va cada año
  vegetativo: number; // crecimiento natural anual
}

// captación: entre 0,5 % y 12 % del flujo hacia la provincia en los lugares que más crecieron
// (Pilar 1,7 %, Colón 4,3 %, Puerto Madryn 7,8 %, Confluencia 11,7 %)
export const INCIERTOS_CENTRAL: Inciertos = { multiplicador: 1.0, captacion: 0.06, salidaDesocupados: 0.3, vegetativo: 0.01 };

export interface Anio { t: number; pob: number; viviendas: number; ocupadas: number; empleos: number; ocupados: number; llegan: number; seVan: number; inversion: number }

export interface Resultado {
  serie: Anio[];
  pob30: number;
  vaciasMax: number; // máxima fracción de viviendas vacías
  desocupMedia: number; // desocupación media de los recién llegados
  inversion: number; // total sin descontar
  van: number; // beneficio de la gente radicada menos costos, descontado al 12 %
  costoPorRadicado: number;
  anioMeta50: number | null; // año en que llega a la mitad de la meta
}

const PERS_EMPLEO_INICIO = 1.6; // personas por empleo de los primeros en llegar (pocos chicos: 0,31 por adulto joven)
const PERS_EMPLEO_LUEGO = 2.2; // personas por empleo con las familias completas (tasa de empleo 0,45)
const EMPLEO_CONSTRUCCION = 1.5; // empleos-año por vivienda construida
const EMPLEO_PUBLICO_LOCAL = 0.03; // empleos en escuelas, salud y municipio por habitante
const TASA = 0.12;
const TECHO_ESPONTANEO = 1.5 * 2883;
const ATRAIDOS_POR_EMPLEO = 0.6;

export function simular(ctx: Contexto, e: Estrategia, u: Inciertos = INCIERTOS_CENTRAL, H = 30): Resultado {
  const pph = 2.86;
  let pob = 0, viv = 0, ocupadosNuevos = 0;
  let inversion = 0, van = 0, vaciasMax = 0, desocSum = 0, desocN = 0;
  let anioMeta50: number | null = null;
  const serie: Anio[] = [];
  const metaViv = ctx.meta / pph;
  const g = Math.min(Math.max(ctx.crecEmpleo, 0), 3) / 100;
  let empleosPrev = 0;
  for (let t = 1; t <= H; t++) {
    let inv = t <= Math.min(3, ctx.retardo + 1) ? ctx.costoTroncal / Math.min(3, ctx.retardo + 1) : 0;
    // --- motor de empleo (organismos o empresas ancla)
    const frac = (x: number) => (e.motorEmpleos > 0 ? Math.min(1, Math.max(0, (x - e.motorInicio + 1) / e.motorDuracion)) : 0);
    const motor = e.motorEmpleos * frac(t);
    const dMotor = motor - e.motorEmpleos * frac(t - 1);
    inv += dMotor * e.motorCostoEmpleo;
    const fiscal = t >= e.motorInicio && t < e.motorInicio + e.motorFiscalAnios ? motor * e.motorFiscalAnual : 0;
    const radicados = motor * e.radicacion; // empleados del motor que viven en el lugar
    // llegadas "traídas" por el motor: agentes trasladados o personal reclutado afuera, con su hogar
    const persEmp = t - ctx.retardo < 8 ? PERS_EMPLEO_INICIO : PERS_EMPLEO_LUEGO;
    const traidos = t < ctx.retardo ? 0 : dMotor * e.radicacion * e.externos * persEmp;
    // --- demanda espontánea esperada: vacantes del año anterior, limitada por quiénes se mudan a la provincia
    // ningún lugar argentino atrajo más de ~2.900 personas netas por año (Pilar 2005–2010): techo de 1,5 veces eso
    const topeNormal = Math.min(ctx.poolAnual * u.captacion, TECHO_ESPONTANEO) * e.captacionExtra;
    // el empleo local que crea el motor atrae migrantes por encima del flujo habitual: cerca del 60 %
    // del empleo nuevo de una región lo terminan ocupando quienes llegan (Blanchard y Katz 1992)
    const dMult = Math.max(0, dMotor) * u.multiplicador;
    const tope = topeNormal + dMult * ATRAIDOS_POR_EMPLEO * persEmp;
    const demanda = Math.min(Math.max(0, empleosPrev - ocupadosNuevos) * persEmp, tope) + traidos;
    // --- vivienda (se habita desde el año siguiente)
    let nuevas = 0;
    const libres = Math.max(0, viv - pob / pph);
    if (t >= ctx.retardo - 1) {
      if (e.regla === "todo_al_inicio") nuevas = t <= ctx.retardo + 6 ? metaViv / 8 : 0;
      else if (e.regla === "por_etapas") nuevas = (viv === 0 || pob / pph >= 0.8 * viv) && viv < metaViv ? Math.min(metaViv * 0.2, metaViv - viv) / 2 : 0;
      else nuevas = Math.max(0, Math.min(metaViv - viv, (demanda * 1.1) / pph - libres + (viv === 0 ? Math.min(metaViv * 0.02, 300) : 0)));
    }
    const lugar = Math.max(0, viv * pph - pob); // viviendas terminadas hasta el año anterior
    viv += nuevas;
    const invVivienda = nuevas * ctx.costoVivienda;
    inv += invVivienda;
    // --- empleo disponible para los recién llegados
    const organico = ctx.puestosZona * ((1 + g) ** t - 1) * 0.5; // la mitad del crecimiento lo toman los que ya viven
    // los empleados del motor que se radican ocupan vacantes; los que viajan no suman población,
    // pero sus gastos sí generan empleo local (multiplicador sobre todo el motor)
    const empleos = organico + radicados + motor * u.multiplicador + nuevas * EMPLEO_CONSTRUCCION + pob * EMPLEO_PUBLICO_LOCAL;
    empleosPrev = empleos;
    // --- llegadas y salidas
    const vacantes = Math.max(0, empleos - ocupadosNuevos);
    const espontaneos = t < ctx.retardo ? 0 : Math.min(Math.max(0, vacantes * persEmp - traidos), tope);
    const llegan = Math.min(traidos + espontaneos, lugar);
    const ocupNuevos = Math.min(empleos, ocupadosNuevos + llegan / persEmp);
    const desocupados = Math.max(0, pob / PERS_EMPLEO_LUEGO - ocupNuevos);
    const seVan = desocupados * u.salidaDesocupados * PERS_EMPLEO_INICIO + pob * 0.01;
    pob = Math.max(0, pob + llegan - seVan) * (1 + u.vegetativo);
    ocupadosNuevos = Math.min(ocupNuevos, pob / persEmp);
    inv += (llegan / pph) * e.ayudaHogar;
    // --- indicadores
    const ocupadas = Math.min(viv, pob / pph);
    if (viv > 0 && t >= ctx.retardo + 1) vaciasMax = Math.max(vaciasMax, 1 - ocupadas / viv);
    if (pob > 0) { desocSum += Math.max(0, 1 - ocupadosNuevos / (pob / PERS_EMPLEO_LUEGO)); desocN++; }
    if (anioMeta50 === null && pob >= ctx.meta / 2) anioMeta50 = t;
    inversion += inv;
    const d = (1 + TASA) ** -t;
    // la vivienda ocupada se necesitaría igual en otro lugar (no es costo adicional); la vacía sí:
    // se cobra su costo de oportunidad cada año que queda sin usar
    const vacias = Math.max(0, viv - pob / pph);
    van += (pob * ctx.beneficioHab - (inv - invVivienda) - fiscal - vacias * ctx.costoVivienda * TASA) * d;
    serie.push({ t, pob, viviendas: viv, ocupadas, empleos, ocupados: ocupadosNuevos, llegan, seVan, inversion: inv + fiscal });
  }
  return {
    serie, pob30: pob, vaciasMax, desocupMedia: desocN ? desocSum / desocN : 0, inversion, van,
    costoPorRadicado: inversion / Math.max(pob, 1), anioMeta50,
  };
}

// ---------------------------------------------------------------- Monte Carlo

/** Generador pseudoaleatorio reproducible (mulberry32). */
export function rng(seed: number) {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

export interface Resumen {
  estrategia: Estrategia;
  pob30: [number, number, number]; // p10, mediana, p90
  van: [number, number, number];
  vaciasMax: number; // mediana
  desocupMedia: number; // mediana
  costoPorRadicado: number; // mediana
  pVanPositivo: number;
  central: Resultado;
}

const q = (xs: number[], p: number) => {
  const s = [...xs].sort((a, b) => a - b);
  return s[Math.min(s.length - 1, Math.max(0, Math.round(p * (s.length - 1))))];
};

export function montecarlo(ctx: Contexto, e: Estrategia, n = 500, seed = 1): Resumen {
  const r = rng(seed);
  const U = (a: number, b: number) => a + (b - a) * r();
  const rs: Resultado[] = [];
  for (let k = 0; k < n; k++) {
    rs.push(simular(ctx, e, { multiplicador: U(0.5, 1.6), captacion: U(0.02, 0.12), salidaDesocupados: U(0.2, 0.4), vegetativo: U(0.006, 0.012) }));
  }
  const pick = (f: (x: Resultado) => number) => rs.map(f);
  const pobs = pick((x) => x.pob30), vans = pick((x) => x.van);
  return {
    estrategia: e,
    pob30: [q(pobs, 0.1), q(pobs, 0.5), q(pobs, 0.9)],
    van: [q(vans, 0.1), q(vans, 0.5), q(vans, 0.9)],
    vaciasMax: q(pick((x) => x.vaciasMax), 0.5),
    desocupMedia: q(pick((x) => x.desocupMedia), 0.5),
    costoPorRadicado: q(pick((x) => x.costoPorRadicado), 0.5),
    pVanPositivo: vans.filter((v) => v > 0).length / n,
    central: simular(ctx, e),
  };
}
