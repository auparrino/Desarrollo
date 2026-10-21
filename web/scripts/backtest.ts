// Prueba retrospectiva del modelo de proceso (web/src/model/proceso.ts) contra trayectorias
// reales de ciudades nuevas y polos exitosos (web/src/model/trayectorias_*.json).
// Uso: npx vite-node scripts/backtest.ts  → docs/backtest-trayectorias.md y web/src/model/backtest.json
import { existsSync, readFileSync, writeFileSync } from "fs";
import { simular, type Contexto, type Estrategia, type Inciertos } from "../src/model/proceso";

interface Punto { anio: number; pob?: number; empleos?: number; ambito?: string; tipo?: string; estimado?: boolean }
interface Caso { id: string; nombre: string; pais: string; tipo: string; t0: number; poblacion: Punto[]; motor: Punto[]; secuencia?: string[]; lecciones?: string[] }

const leer = (f: string): Caso[] => (existsSync(f) ? (JSON.parse(readFileSync(f, "utf8")).casos as Caso[]) : []);
const casos = [...leer("src/model/trayectorias_ar.json"), ...leer("src/model/trayectorias_int.json")];
const n0 = (v: number) => Math.round(v).toLocaleString("es-AR");

/** Interpola linealmente una serie anual entre puntos (antes del primero: 0 o el primer valor). */
function interpolar(pts: { anio: number; v: number }[], desde: number, hasta: number, antes = 0): number[] {
  const s = [...pts].sort((a, b) => a.anio - b.anio);
  const out: number[] = [];
  for (let y = desde; y <= hasta; y++) {
    if (!s.length || y < s[0].anio) { out.push(s.length && antes < 0 ? s[0].v : antes); continue; }
    const k = s.findIndex((p) => p.anio >= y);
    if (k === -1) { out.push(s[s.length - 1].v); continue; }
    if (s[k].anio === y || k === 0) { out.push(s[k].v); continue; }
    const a = s[k - 1], b = s[k];
    out.push(a.v + ((b.v - a.v) * (y - a.anio)) / (b.anio - a.anio));
  }
  return out;
}

const ESTR = (serie: number[]): Estrategia => ({
  id: "historia", nombre: "Historia", descripcion: "", regla: "a_demanda", motorEmpleos: 1, motorInicio: 1, motorDuracion: 1,
  motorCostoEmpleo: 0, motorFiscalAnual: 0, motorFiscalAnios: 0, captacionExtra: 1, ayudaHogar: 0, radicacion: 1, externos: 0.7, motorSerie: serie,
});

interface Ajuste { error: number; u: Inciertos; techo: number; serie: number[] }

function correr(c: Caso, pob: Punto[], motor: number[], pob0: number, H: number, u: Inciertos, techo: number) {
  const maxObs = Math.max(...pob.map((p) => p.pob!));
  const ctx: Contexto = {
    meta: maxObs * 3, puestosZona: pob0 * 0.3, crecEmpleo: 0, poolAnual: 1e9, costoVivienda: 0, costoTroncal: 0, beneficioHab: 0,
    retardo: 1, pob0, techo,
  };
  const r = simular(ctx, ESTR(motor), { ...u, captacion: 1 }, H);
  return r.serie.map((x) => x.pob);
}

const errorLog = (sim: number[], pob: Punto[], t0: number) => {
  const xs = pob.filter((p) => p.anio > t0 && p.anio - t0 <= sim.length);
  if (!xs.length) return NaN;
  return Math.sqrt(xs.reduce((a, p) => a + Math.log(Math.max(sim[p.anio - t0 - 1], 1) / p.pob!) ** 2, 0) / xs.length);
};

const resultados: Record<string, unknown>[] = [];
let md = `# Prueba retrospectiva: ¿el modelo de proceso reproduce los casos exitosos?

Generado con \`web/scripts/backtest.ts\`. Para cada caso con datos de población y de empleo del motor
(\`docs/trayectorias-argentina.md\`, \`docs/trayectorias-internacionales.md\`) se alimenta el modelo de
proceso con lo que pasó de verdad (año de inicio, población inicial, empleos del motor año por año) y se
compara la población simulada con la observada en cada censo.

- **A ciegas:** con los parámetros que usa la app para la Argentina (multiplicador 1,6, llegada espontánea
  de hasta ~4.300 personas por año, crecimiento vegetativo 1 %).
- **Calibrado:** con los parámetros que mejor reproducen la historia (búsqueda en grilla).

El error es el promedio cuadrático del logaritmo del cociente simulado/observado: 0,10 equivale a
errar en un ±10 % en promedio; 0,50, en un ±65 %.

`;

const grid = { mult: [0.3, 0.6, 1, 1.5, 2, 3, 4], techo: [0, 500, 1000, 2000, 4300, 8000, 15000, 30000, 60000], veg: [0.01, 0.02, 0.03] };

for (const c of casos) {
  const pob = (c.poblacion ?? []).filter((p) => Number.isFinite(p.pob) && p.pob! > 0).sort((a, b) => a.anio - b.anio);
  const mot = (c.motor ?? []).filter((p) => Number.isFinite(p.empleos));
  if (pob.length < 3) continue;
  const fin = pob[pob.length - 1].anio;
  const H = Math.min(80, fin - c.t0);
  if (H < 5) continue;
  const p0pt = [...pob].reverse().find((p) => p.anio <= c.t0) ?? pob[0];
  const pob0 = p0pt.anio <= c.t0 + 1 ? p0pt.pob! : 0;
  const motor = interpolar(mot.map((p) => ({ anio: p.anio - c.t0, v: p.empleos! })), 1, H, 0);
  const tieneMotor = mot.length > 0;

  const ciego = correr(c, pob, motor, pob0, H, { multiplicador: 1.6, captacion: 1, salidaDesocupados: 0.3, vegetativo: 0.01 }, 4300);
  const eCiego = errorLog(ciego, pob, c.t0);
  let best: Ajuste | null = null;
  for (const m of grid.mult) for (const t of grid.techo) for (const v of grid.veg) {
    const u = { multiplicador: m, captacion: 1, salidaDesocupados: 0.3, vegetativo: v };
    const s = correr(c, pob, motor, pob0, H, u, t);
    const e = errorLog(s, pob, c.t0);
    if (Number.isFinite(e) && (!best || e < best.error)) best = { error: e, u, techo: t, serie: s };
  }
  if (!best) continue;
  const obs = pob.filter((p) => p.anio > c.t0 && p.anio - c.t0 <= H);
  resultados.push({
    id: c.id, nombre: c.nombre, pais: c.pais, tipo: c.tipo, t0: c.t0, pob0, tieneMotor,
    errorCiego: eCiego, errorCalibrado: best.error, multiplicador: best.u.multiplicador, techo: best.techo, vegetativo: best.u.vegetativo,
    observado: obs.map((p) => ({ t: p.anio - c.t0, pob: p.pob })),
    ciego: ciego.map((v, k) => ({ t: k + 1, pob: Math.round(v) })).filter((_, k) => (k + 1) % 2 === 0 || k === 0),
    calibrado: best.serie.map((v, k) => ({ t: k + 1, pob: Math.round(v) })).filter((_, k) => (k + 1) % 2 === 0 || k === 0),
  });
  md += `## ${c.nombre} (${c.pais}, desde ${c.t0})\n\n`;
  md += `Población inicial ${n0(pob0)}; ${tieneMotor ? `motor de empleo con ${mot.length} datos (máximo ${n0(Math.max(...mot.map((p) => p.empleos!)))} empleos)` : "sin datos de empleo del motor: solo crecimiento espontáneo"}.\n\n`;
  md += `| Año | Observado | Simulado a ciegas | Simulado calibrado |\n|---|---|---|---|\n`;
  for (const p of obs) md += `| ${p.anio} | ${n0(p.pob!)} | ${n0(ciego[p.anio - c.t0 - 1])} | ${n0(best.serie[p.anio - c.t0 - 1])} |\n`;
  md += `\nError a ciegas ${Number.isFinite(eCiego) ? eCiego.toFixed(2) : "s/d"}; calibrado ${best.error.toFixed(2)}, con multiplicador ${best.u.multiplicador}, llegada espontánea de hasta ${n0(best.techo)} personas por año y crecimiento vegetativo ${Math.round(best.u.vegetativo * 100)} %.\n\n`;
}

writeFileSync("src/model/backtest.json", JSON.stringify({ generado: new Date().toISOString().slice(0, 10), casos: resultados }));
writeFileSync("../docs/backtest-trayectorias.md", md);
console.log(resultados.map((r) => `${r.nombre}: ciego ${(r.errorCiego as number)?.toFixed?.(2)} calibrado ${(r.errorCalibrado as number).toFixed(2)} mult ${r.multiplicador} techo ${r.techo} veg ${r.vegetativo}`).join("\n"));
