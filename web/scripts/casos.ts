// Genera docs/casos-concretos.md: un caso concreto por instrumento, con el mismo cálculo
// que la app (modo simple, enfoque "lo que recomiendan los expertos", orden combinado).
// Uso: npx vite-node scripts/casos.ts
import { writeFileSync } from "fs";
import { cargar, elegirCaso } from "./lib";
import { compararEstrategias } from "../src/model/estrategias";
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

const { ds, loc, proyectos } = cargar();
const col = ds.col;

const ESC: Escenario[] = ["optimista", "base", "pesimista"];
const n0 = (v: number) => Math.round(v).toLocaleString("es-AR");
const pct = (x: number) => `${Math.round(x * 100)} %`;
const anual = (b: CBAResult) => b.anual.productividad + b.anual.aglomeracion + b.anual.congestion + b.anual.polo;

let md = `# Casos concretos: uno por instrumento

Generado con \`web/scripts/casos.ts\`, con los mismos cálculos que la app (modo simple con la
mejor combinación posible de prioridades, orden combinado de aptitud y economía, tamaño
predeterminado de cada instrumento). La app aplica el mismo razonamiento a cualquier lugar en la
sección "Qué se haría, paso a paso" de la ficha.

El plan de cada caso sigue el proceso recomendado por las simulaciones (\`docs/simulaciones-procesos.md\`), con los flujos migratorios argentinos.

Cada caso responde, en este orden: qué se haría y dónde; qué se construye en cada etapa y con qué
condición se pasa a la siguiente; quiénes llegan, desde dónde y a qué ritmo; qué significaría para
la región, el trabajo, el agua y el país; y, al final, la cuenta económica y los riesgos.

`;

for (const pol of POLICIES) {
  const e = elegirCaso(ds, loc, pol);
  const metaPob = e?.meta ?? 0;
  if (!e) continue;
  const i = e.s.best;
  const b = e.r.base;
  const cmp = compararEstrategias(ds, i, pol.id, metaPob, e.costos, e.rCurva, 250);
  const elegido = cmp.poblar && cmp.marginal(cmp.poblar) < 50_000 ? cmp.poblar : cmp.mejor;
  const tray = elegido.central.serie.map((x) => (pol.id === "polos" ? x.pob / 2.2 : x.pob));
  const plan = planConcreto(ds, i, pol.id, metaPob, e.nombre, e.r, tray, elegido.estrategia.nombre, elegido.estrategia.motorEmpleos);
  // equilibrio contra la curva sin ajustar; "se espera" = lo que da el proceso recomendado
  const eq0 = equilibrio(e.inp, e.rCurva.base);
  const eq = { ...eq0, esperada: (pol.id === "polos" ? elegido.pob30[1] / 2.2 : elegido.pob30[1]) / Math.max(metaPob, 1), conviene: b.social.van >= 0 };
  const emp = empleo(ds, i, pol.id, b, proyectos);
  const rs = riesgos(ds, i, pol.id, metaPob, e.r, emp);
  const polos = pol.id === "polos";

  md += `## ${pol.nombre}: ${e.nombre} (${e.s.departamento}, ${e.s.provincia})\n\n${plan.resumen}\n\n`;
  md += `Primer puesto en el orden combinado (${e.apt}.º por aptitud, ${e.eco}.º por economía, entre los 12 mejores lugares por aptitud).\n\n`;
  md += `### Qué se haría, paso a paso\n\n`;
  for (const et of plan.etapas) {
    md += `**${et.nombre} (años ${et.desde} a ${et.hasta})**: ${polos ? `se crean unos ${n0(et.llegan)} empleos` : `llegan unas ${n0(et.llegan)} personas`} (${n0(et.porAnio)} por año); total acumulado ${n0(et.acumulado)}.\n\n`;
    for (const o of et.obras) md += `- ${o.que}: ${o.cantidad}.\n`;
    md += `- Para pasar a la etapa siguiente: ${et.condicion}\n\n`;
  }
  md += `### Quiénes llegarían y desde dónde\n\n`;
  for (const q of plan.quienes) md += `- ${q}\n`;
  if (plan.deDonde.length) md += `\nDe dónde vendrían (corredores observados, Censo 2022 y RENAPER): ${plan.deDonde.filter((o) => o.pct >= 2).slice(0, 7).map((o) => `${o.lugar} ${Math.round(o.pct)} % (${n0(o.personas)})`).join(" · ")}.\n`;
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
4. **Quiénes y de dónde.** El perfil sale del Censo 2022: el 47 % de quienes cambian de provincia tiene de 15 a 34 años, estudió más y trae pocos chicos; uno de cada tres vuelve a su provincia de nacimiento. El origen se reparte entre la misma provincia (mudanzas entre departamentos, RENAPER) y los corredores que ya llegan a esa provincia (matriz 2017–2022), porque la distancia casi no explica los flujos.
5. **Ritmo.** Se compara la llegada anual con el total de quienes cambian de provincia por año (150.000) y con lo que crecieron los lugares argentinos que más crecieron.
6. **Qué significaría.** Se compara lo que llega con lo que ya hay en la región: población a 50 km, puestos de trabajo y caudal de agua.
`;

writeFileSync("../docs/casos-concretos.md", md);
console.log(md.slice(0, 200), "…", md.length, "caracteres");
