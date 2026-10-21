// Corre simulaciones de proceso (web/src/model/proceso.ts) para el caso de cada instrumento y
// escribe docs/simulaciones-procesos.md con el proceso óptimo. Uso: npx vite-node scripts/simular.ts
import { writeFileSync } from "fs";
import { musd } from "../src/model/brief";
import { POLICIES } from "../src/model/policies";
import { rng, simular } from "../src/model/proceso";
import { compararEstrategias } from "../src/model/estrategias";
import { cargar, elegirCaso } from "./lib";

const { ds, loc } = cargar();
const n0 = (v: number) => Math.round(v).toLocaleString("es-AR");
const pc = (v: number) => `${Math.round(v * 100)} %`;
const N = 800;

let md = `# Simulaciones de proceso: cómo conviene hacerlo

Generado con \`web/scripts/simular.ts\` sobre el modelo \`web/src/model/proceso.ts\`. Para el caso de
cada instrumento (el mismo de \`docs/casos-concretos.md\`) se simulan varias estrategias año por año
durante 30 años, ${N} veces cada una, variando lo que no se sabe con certeza:

| Parámetro incierto | Rango | Fuente |
|---|---|---|
| Empleos locales por cada empleo del motor | 0,8 a 2,5 | Moretti (2010): 1,6; implícito en los casos exitosos: Tierra del Fuego 1987 ≈ 1,7, Canberra 1966 ≈ 1,9 (\`docs/recorridos-exitosos.md\`) |
| Parte del flujo migratorio hacia la provincia que capta un solo lugar | 2 % a 12 % | observado: Pilar 1,7 %, Colón (Córdoba) 4,3 %, Puerto Madryn 7,8 %, Confluencia 11,7 %; con un techo de 1,5 veces el mayor saldo observado (Pilar, ~2.900 personas netas por año) |
| Recién llegados sin trabajo que se van cada año | 20 % a 40 % | supuesto; uno de cada tres migrantes vuelve a su provincia (Censo 2022) |
| Parte del empleo nuevo que ocupan migrantes | 60 % (fijo) | Blanchard y Katz (1992) |
| Crecimiento vegetativo | 0,6 % a 1,2 % anual | INDEC |

En cada año: el empleo disponible para los que llegan es la mitad del crecimiento normal de la
zona más el motor de empleo (y su efecto multiplicador), la construcción (1,5 empleos-año por
vivienda) y los servicios públicos locales (3 empleos cada 100 habitantes). Llega gente solo si hay
vacantes, vivienda terminada y gente que se esté mudando hacia esa provincia (mudanzas por año del
RENAPER y del Censo 2022). Los primeros traen pocos chicos (1,6 personas por empleo; 2,2 después).
El saldo económico suma el beneficio anual por habitante radicado (del costo-beneficio) y resta la
conexión, el motor de empleo, los incentivos, las ayudas y el costo de oportunidad de las viviendas
vacías (las ocupadas se necesitarían igual en otro lugar).

El "proceso óptimo" es la estrategia con mayor saldo mediano; se muestran también la probabilidad
de que el saldo sea positivo y lo que más pesa en el resultado.

`;

const corr = (xs: number[], ys: number[]) => {
  const mx = xs.reduce((a, b) => a + b, 0) / xs.length, my = ys.reduce((a, b) => a + b, 0) / ys.length;
  let sxy = 0, sxx = 0, syy = 0;
  xs.forEach((x, k) => { sxy += (x - mx) * (ys[k] - my); sxx += (x - mx) ** 2; syy += (ys[k] - my) ** 2; });
  return sxy / Math.sqrt(sxx * syy || 1);
};

const resumenGeneral: string[] = [];

for (const pol of POLICIES) {
  const caso = elegirCaso(ds, loc, pol);
  if (!caso) continue;
  const i = caso.s.best;
  const { rs, mejor, poblar, ref, marginal, ctx, merc } = compararEstrategias(ds, i, pol.id, caso.meta, caso.costos, caso.r, N);
  const polos = pol.id === "polos";
  // qué pesa más en el resultado de la mejor estrategia
  const r = rng(99);
  const Uu = (a: number, c: number) => a + (c - a) * r();
  const xs = { multiplicador: [] as number[], captacion: [] as number[], salidaDesocupados: [] as number[], vegetativo: [] as number[] };
  const vans: number[] = [];
  for (let k = 0; k < N; k++) {
    const u = { multiplicador: Uu(0.8, 2.5), captacion: Uu(0.02, 0.12), salidaDesocupados: Uu(0.2, 0.4), vegetativo: Uu(0.006, 0.012) };
    (Object.keys(xs) as (keyof typeof xs)[]).forEach((key) => xs[key].push(u[key]));
    vans.push(simular(ctx, mejor.estrategia, u).van);
  }
  const NOM = { multiplicador: "cuánto empleo local genera el motor", captacion: "cuánta gente que se muda elige este lugar", salidaDesocupados: "cuántos se van si no consiguen trabajo", vegetativo: "nacimientos" };
  const sens = (Object.keys(xs) as (keyof typeof xs)[]).map((key) => ({ key, c: corr(xs[key], vans) })).sort((a, b) => Math.abs(b.c) - Math.abs(a.c));

  md += `## ${pol.nombre}: ${caso.nombre} (${caso.s.departamento}, ${caso.s.provincia})\n\n`;
  md += `Meta: ${n0(caso.meta)} ${polos ? "empleos" : "habitantes"}. Hoy hay ${n0(merc.puestos)} puestos privados en la zona, que crecieron ${merc.empCrec.toLocaleString("es-AR", { maximumFractionDigits: 1 })} % por año; hacia ${caso.s.provincia} se mudan unas ${n0(ctx.poolAnual)} personas por año (de otras provincias y entre departamentos).\n\n`;
  md += `| Estrategia | Habitantes al año 30 (p10 – mediana – p90) | Viviendas vacías (máx.) | Saldo para el país (mediana) | Probabilidad de saldo positivo | Costo por habitante adicional |\n|---|---|---|---|---|---|\n`;
  for (const x of rs) {
    md += `| ${x === mejor ? "**" : ""}${x.estrategia.nombre}${x === mejor ? "** ✔" : ""} | ${n0(x.pob30[0])} – **${n0(x.pob30[1])}** – ${n0(x.pob30[2])} | ${pc(x.vaciasMax)} | ${musd(x.van[1])} | ${pc(x.pVanPositivo)} | ${x === ref ? "referencia" : Number.isFinite(marginal(x)) ? (marginal(x) <= 0 ? "gana" : `USD ${n0(marginal(x))}`) : "no suma gente"} |\n`;
  }
  const s = mejor.central.serie;
  const at = (t: number) => s[t - 1];
  md += `\n**Si el objetivo es no perder plata: ${mejor.estrategia.nombre.toLowerCase()}.** ${mejor.estrategia.descripcion}\n\n`;
  if (poblar) md += `**Si el objetivo es poblar: ${poblar.estrategia.nombre.toLowerCase()}.** ${poblar.estrategia.descripcion} Suma ${n0(poblar.pob30[1] - ref.pob30[1])} habitantes más que la referencia y cada uno le cuesta al país unos USD ${n0(Math.max(0, marginal(poblar)))} en valor presente.\n\n`;
  md += `Cómo evoluciona (valores centrales):\n\n| Año | Habitantes | Viviendas | Empleos para los que llegan | Llegan en el año | Se van en el año |\n|---|---|---|---|---|---|\n`;
  for (const t of [3, 5, 10, 15, 20, 30]) if (at(t)) md += `| ${t} | ${n0(at(t).pob)} | ${n0(at(t).viviendas)} | ${n0(at(t).empleos)} | ${n0(at(t).llegan)} | ${n0(at(t).seVan)} |\n`;
  md += `\nLo que más pesa en el resultado: ${sens.slice(0, 2).map((x) => `${NOM[x.key]} (correlación ${x.c.toLocaleString("es-AR", { maximumFractionDigits: 2 })})`).join(" y ")}.\n\n`;
  const peor = [...rs].sort((a, b) => a.van[1] - b.van[1])[0];
  resumenGeneral.push(`- **${pol.nombre}** (${caso.nombre}, meta ${n0(caso.meta)}): para no perder plata, *${mejor.estrategia.nombre.toLowerCase()}* (${n0(mejor.pob30[1])} habitantes al año 30, ${pc(mejor.pVanPositivo)} de probabilidad de saldo positivo).${poblar ? ` Para poblar, *${poblar.estrategia.nombre.toLowerCase()}*: ${n0(poblar.pob30[1])} habitantes${marginal(poblar) <= 0 ? ", y además mejora el saldo." : `, a unos USD ${n0(marginal(poblar))} por habitante adicional.`}` : ""} Lo peor: *${peor.estrategia.nombre.toLowerCase()}* (${musd(peor.van[1])}).`);
}

const principios = `## Procesos óptimos: lo que se repite en todas las simulaciones

1. **No construir por adelantado.** "Viviendas primero" es siempre la peor estrategia: la gente no llega más rápido por haber casas, llega si hay trabajo, y las viviendas vacías cuestan. Se construye a demanda o por etapas chicas.
2. **El empleo pone el ritmo, no la vivienda.** Sin un motor de empleo, un lugar nuevo crece como mucho al ritmo del flujo migratorio habitual (unos cientos de personas por año), y donde el empleo de la zona no crece directamente no llega nadie. Con el mejor motor, una ciudad nueva llega a unas decenas de miles de personas en 30 años, no a 500.000. Una meta realista para una ciudad nueva sin un motor excepcional es de decenas de miles de habitantes, no de cientos de miles.
3. **El motor de empleo más barato es público y permanente.** Trasladar o crear organismos, una universidad u hospitales regionales cuesta una vez (oficinas y mudanza, unos USD 23.000 por puesto) y suma gente a un costo muy bajo por habitante. Los incentivos fiscales por empleo, al nivel de los regímenes de promoción (unos USD 51.000 por puesto por año), no se pagan en ningún caso simulado.
4. **Capital: trasladar de a un ministerio y que las familias se muden.** El traslado gradual (12 años) con vivienda y ayuda para que el 85 % de los agentes se mude con su familia es el mejor proceso. Si el traslado va más rápido que la construcción, los agentes no encuentran dónde vivir y terminan viajando, como en Brasilia y en Putrajaya.
5. **Polos: urbanizar por etapas y sin incentivos fiscales.** El parque se urbaniza a medida que se venden los lotes; lo que hace falta son compromisos de inversión firmados, no exenciones por empleo.
6. **Lo que más define el resultado es el atractivo del lugar.** En los lugares sin motor, el resultado depende casi por completo de qué parte de quienes se mudan elige ese lugar. Servicios, conexión y programas de retorno para quienes nacieron en la región son la palanca; en la capital manda el empleo que genera el traslado.
7. **Donde la zona es menos productiva que el AMBA, el proceso no lo arregla.** En ciudades intermedias y pueblos de zonas con salarios más bajos que el AMBA el saldo es negativo con cualquier estrategia: es una decisión de equilibrio territorial, no de rentabilidad.

`;
md = md.replace("El \"proceso óptimo\" es", `## Resumen\n\n${resumenGeneral.join("\n")}\n\n${principios}El "proceso óptimo" es`);
writeFileSync("../docs/simulaciones-procesos.md", md);
console.log(resumenGeneral.join("\n"));
