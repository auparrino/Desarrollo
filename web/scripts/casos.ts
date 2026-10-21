// Genera docs/casos-concretos.md: un caso concreto por instrumento, con el mismo cálculo
// que la app (modo simple, enfoque "lo que recomiendan los expertos", orden combinado).
// Uso: npx vite-node scripts/casos.ts
import { readFileSync, writeFileSync } from "fs";
import type { Dataset } from "../src/data/load";
import { costBenefit, type CBAResult, type Escenario } from "../src/model/benefits";
import { BENEFIT_PARAMS } from "../src/model/benefitParamsData";
import { equilibrio, musd, riesgos, empleo } from "../src/model/brief";
import { effectiveWeights } from "../src/model/criteria";
import { estimateCosts } from "../src/model/costs";
import { cbaInput } from "../src/model/labor";
import { DEFAULT_WATER, aggregate, computeMask, factorScores } from "../src/model/mcda";
import { planConcreto } from "../src/model/plan";
import { defaultPoints, weightsFromPoints } from "../src/model/plain";
import { POLICIES } from "../src/model/policies";
import { findSites } from "../src/model/sites";
import { UNIT_COSTS } from "../src/model/unitCostsData";
import { nearestPlace } from "../src/ui/plainFacts";

const meta = JSON.parse(readFileSync("public/data/cells.json", "utf8"));
const buf = readFileSync("public/data/cells.bin");
const ab = buf.buffer.slice(buf.byteOffset, buf.byteOffset + buf.byteLength);
const col: Record<string, Float32Array> = {};
for (const c of meta.columns) col[c.id] = new Float32Array(ab, c.offset, meta.n);
const dep = new Uint16Array(ab.slice(meta.layout.dep_idx, meta.layout.dep_idx + meta.n * 2));
const lo = new Uint32Array(ab, meta.layout.h3_lo, meta.n), hi = new Uint32Array(ab, meta.layout.h3_hi, meta.n);
const h3: string[] = [], index = new Map<string, number>();
for (let i = 0; i < meta.n; i++) { h3[i] = hi[i].toString(16) + lo[i].toString(16).padStart(8, "0"); index.set(h3[i], i); }
const ds: Dataset = { n: meta.n, h3, dep, col, meta, index };
const loc = JSON.parse(readFileSync("public/data/capas/localidades.geojson", "utf8"));
const proyectos = JSON.parse(readFileSync("public/data/capas/proyectos.geojson", "utf8"));

const ESC: Escenario[] = ["optimista", "base", "pesimista"];
const n0 = (v: number) => Math.round(v).toLocaleString("es-AR");
const pct = (x: number) => `${Math.round(x * 100)} %`;
const anual = (b: CBAResult) => b.anual.productividad + b.anual.aglomeracion + b.anual.congestion + b.anual.polo;

let md = `# Casos concretos: uno por instrumento

Generado con \`web/scripts/casos.ts\`, con los mismos cálculos que la app (modo simple, reparto de
prioridades "lo que recomiendan los expertos", orden combinado de aptitud y economía, tamaño
predeterminado de cada instrumento). La app aplica el mismo razonamiento a cualquier lugar en la
sección "Qué se haría, paso a paso" de la ficha.

Cada caso responde, en este orden: qué se haría y dónde; qué se construye en cada etapa y con qué
condición se pasa a la siguiente; quiénes llegan, desde dónde y a qué ritmo; qué significaría para
la región, el trabajo, el agua y el país; y, al final, la cuenta económica y los riesgos.

`;

for (const pol of POLICIES) {
  const metaPob = pol.tamanos[Math.min(2, pol.tamanos.length - 1)];
  const reason = computeMask(col, ds.n, pol.restrictions(), { ...DEFAULT_WATER, poblacion: metaPob, activo: pol.agua });
  const fs = factorScores(col, ds.n, {}, { poblacion: metaPob });
  const w = effectiveWeights(weightsFromPoints(defaultPoints(pol.weights()), pol.weights()));
  const score = aggregate(fs, w, reason, { method: "wlc" });
  const sites = findSites(ds, score, { topFrac: pol.requiereSuperficie ? 0.02 : 0.1, poblacion: metaPob, densidad: 75, maxSites: 20, requiereSuperficie: pol.requiereSuperficie }, null);
  const seen = new Set<string>();
  const evs = sites
    .map((s) => ({ s, nombre: nearestPlace(loc, s.center[0], s.center[1])?.nombre ?? s.departamento }))
    .filter((x) => (seen.has(x.nombre) ? false : (seen.add(x.nombre), true)))
    .slice(0, 12)
    .map((x, k) => {
      const costos = estimateCosts(pol.id, col, x.s.best, x.s.provincia, { poblacion: metaPob, densidad: 75 }, UNIT_COSTS);
      const inp = cbaInput(ds, pol.id, metaPob, costos, x.s.best);
      const r = Object.fromEntries(ESC.map((e) => [e, costBenefit(inp, BENEFIT_PARAMS, e)])) as Record<Escenario, CBAResult>;
      return { ...x, apt: k + 1, costos, inp, r };
    });
  const porPlata = [...evs].sort((a, b) => b.r.base.social.van - a.r.base.social.van);
  const rk = new Map(porPlata.map((x, k) => [x.s.rank, k + 1]));
  const e = [...evs].sort((a, b) => a.apt + rk.get(a.s.rank)! - (b.apt + rk.get(b.s.rank)!) || a.apt - b.apt)[0];
  if (!e) continue;
  const i = e.s.best;
  const b = e.r.base;
  const plan = planConcreto(ds, i, pol.id, metaPob, e.nombre, e.r);
  const eq = equilibrio(e.inp, b);
  const emp = empleo(ds, i, pol.id, b, proyectos);
  const rs = riesgos(ds, i, pol.id, metaPob, e.r, emp);
  const polos = pol.id === "polos";

  md += `## ${pol.nombre}: ${e.nombre} (${e.s.departamento}, ${e.s.provincia})\n\n${plan.resumen}\n\n`;
  md += `Primer puesto en el orden combinado (${e.apt}.º por aptitud, ${rk.get(e.s.rank)}.º por economía, entre los 12 mejores lugares por aptitud).\n\n`;
  md += `### Qué se haría, paso a paso\n\n`;
  for (const et of plan.etapas) {
    md += `**${et.nombre} (años ${et.desde} a ${et.hasta})**: ${polos ? `se crean unos ${n0(et.llegan)} empleos` : `llegan unas ${n0(et.llegan)} personas`} (${n0(et.porAnio)} por año); total acumulado ${n0(et.acumulado)}.\n\n`;
    for (const o of et.obras) md += `- ${o.que}: ${o.cantidad}.\n`;
    md += `- Para pasar a la etapa siguiente: ${et.condicion}\n\n`;
  }
  md += `### Quiénes llegarían y desde dónde\n\n`;
  for (const q of plan.quienes) md += `- ${q}\n`;
  if (plan.deDonde.length) md += `\nOrigen probable (modelo de gravedad, orientativo): ${plan.deDonde.map((o) => `${o.lugar} ${Math.round(o.pct)} % (${n0(o.personas)})`).join(" · ")}.\n`;
  md += `\n### Qué significaría\n\n`;
  for (const s of plan.significa) md += `- **${s.titulo}.** ${s.texto}\n`;
  md += `\n### La cuenta y los riesgos\n\n`;
  md += `- Inversión total ${musd(e.costos.totalCapital[1])}; de eso, ${musd(e.costos.propio[1])} dependen del lugar.\n`;
  md += `- Resultado anual al año 30: ${anual(b) >= 0 ? "+" : ""}${musd(anual(b))}; saldo para el país ${musd(b.social.van)}; para el Tesoro ${musd(b.fiscal.van)}.\n`;
  md += `- ${eq.conviene ? (eq.ocupacion !== null && eq.ocupacion < eq.esperada ? `Sigue conviniendo aunque llegue solo el ${pct(eq.ocupacion)} de la meta (se espera el ${pct(eq.esperada)}).` : "Conviene con la llegada esperada.") : eq.ocupacion !== null ? `Para que convenga tendría que llegar el ${pct(eq.ocupacion)} de la meta (se espera el ${pct(eq.esperada)}).` : eq.salario !== null ? `No alcanza con más gente: harían falta salarios de ${eq.salario.toFixed(2)} veces el promedio nacional en la zona (hoy ${eq.salarioActual.toFixed(2)}).` : "No llega a convenir en el horizonte evaluado."}\n`;
  for (const x of rs.filter((x) => !x.que.startsWith("Especulación"))) md += `- Riesgo ${x.nivel}: ${x.que} ${x.mitigacion}\n`;
  md += `\n`;
}

md += `## Cómo se replica

La ficha de cualquier lugar de la app arma el mismo plan con \`web/src/model/plan.ts\`:

1. **Etapas.** Se toma la llegada de gente del escenario "lo más probable" en cuatro etapas (años 1–5, 6–10, 11–20 y 21–30).
2. **Obras.** Cada etapa construye solo lo que corresponde a quienes llegan en ella: viviendas (2,86 personas por hogar), lugares en escuelas (19 % de la población en edad escolar), camas (3,36 cada 1.000 habitantes) y suelo urbanizado a 75 hab/ha. Las obras de conexión (ruta, energía, agua) van en la primera etapa.
3. **Condición.** No se pasa a la etapa siguiente hasta que la anterior esté ocupada en un 80 % y tenga empleo.
4. **Quiénes y de dónde.** El perfil de quienes llegan sigue lo que se sabe de la migración interna: primero adultos jóvenes con trabajo, después familias y redes. El origen sale del modelo de gravedad, que se reemplazará por la matriz de migración observada.
5. **Qué significaría.** Se compara lo que llega con lo que ya hay en la región: población a 50 km, puestos de trabajo y caudal de agua.
`;

writeFileSync("../docs/casos-concretos.md", md);
console.log(md.slice(0, 200), "…", md.length, "caracteres");
