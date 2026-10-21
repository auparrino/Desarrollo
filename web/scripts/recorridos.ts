// Genera docs/recorridos-exitosos.md: cómo crecieron las ciudades nuevas y polos que funcionaron,
// si el modelo de proceso los reproduce y qué haría falta para que los lugares de la app sigan
// esos recorridos. Uso: npx vite-node scripts/recorridos.ts
import { readFileSync, writeFileSync } from "fs";
import { compararEstrategias } from "../src/model/estrategias";
import { POLICIES } from "../src/model/policies";
import { RECORRIDOS, emular } from "../src/model/recorridos";
import { cargar, elegirCaso } from "./lib";

const n0 = (v: number) => Math.round(v).toLocaleString("es-AR");
const f1 = (v: number) => v.toLocaleString("es-AR", { maximumFractionDigits: 1 });
const { ds, loc } = cargar();
const bt = JSON.parse(readFileSync("src/model/backtest.json", "utf8")).casos as { id: string; errorCiego: number; errorCalibrado: number; multiplicador: number; techo: number; tieneMotor: boolean }[];

let md = `# Recorridos de ciudades nuevas y polos que funcionaron

Generado con \`web/scripts/recorridos.ts\` a partir de \`docs/trayectorias-argentina.md\` y
\`docs/trayectorias-internacionales.md\` (censos y fuentes oficiales; los datos de empleo del motor son
escasos y varios son estimaciones de prensa). La población se interpola entre censos en escala
logarítmica; antes del primer censo se supone la población de ese censo.

## Cómo crecieron

"Comparable" = país con más del 70 % de población urbana al empezar, como la Argentina (92 %): no
había una gran reserva rural esperando migrar a la ciudad.

| Caso | Inicio | Comparable | Población al año 10 | Año 20 | Año 30 | Llegada máxima por año | Veces el récord argentino reciente |
|---|---|---|---|---|---|---|---|
`;
for (const r of RECORRIDOS) {
  const e = emular(r, 0, Math.min(30, r.hasta));
  const at = (k: number) => (k <= r.hasta ? n0(r.serie[k]) : "s/d");
  md += `| ${r.nombre} (${r.pais}) | ${r.t0} | ${r.urbanizado ? "sí" : "no"} | ${at(10)} | ${at(20)} | ${at(30)} | ${n0(e.llegadasPico)} (año ${e.anioPico}) | ${f1(e.vecesRecordAR)} |\n`;
}
md += `
El "récord argentino reciente" es el mayor saldo migratorio neto observado en un lugar entre 2005 y
2022: Pilar, unas 2.900 personas por año (\`docs/migracion-interna.md\`).

## Lo que se repite en los recorridos

1. **Primero la infraestructura, después el empleo masivo** (de 1 a 8 años después). La Plata tuvo
   ferrocarril y obreros de la construcción antes que empleados públicos; Puerto Madryn, acueducto,
   puerto y central térmica antes que ALUAR; Brasilia tenía 64.000 habitantes en 1959, antes de que
   llegara un solo ministerio.
2. **Dos motores en secuencia: la construcción y después un empleo estable.** Donde el segundo motor
   tardó, la ciudad se estancó: Canberra tardó unos 45 años en llegar a 30.000 habitantes, Goiânia casi
   no creció en los años cuarenta, y La Plata perdió población con la crisis de 1890.
3. **El motor directo es una parte chica del crecimiento.** Los ~900 empleos de ALUAR fueron con unos
   14.000 habitantes nuevos en 1970–1980; la construcción y los servicios multiplican.
4. **La vivienda llegó casi siempre a demanda e informal**, y después se regularizó: un tercio de la
   expansión urbana de Tierra del Fuego hasta 1991, las ciudades satélite de Brasilia, las villas de
   Belo Horizonte. La excepción es Puerto Madryn, donde ALUAR construyó barrios por adelantado.
5. **Si no hay vivienda, el empleo se vuelve viaje diario y no radicación** (Añelo hoy; Sejong y
   Putrajaya con sus funcionarios: en Sejong, en 2014, un tercio seguía viajando o se había mudado sin
   la familia, sobre todo por las escuelas).
6. **Cuando el motor se achica, deja de llegar gente pero casi nadie se va**: el empleo público y los
   nacimientos de una población joven sostienen la ciudad (Tierra del Fuego en los noventa).
7. **El ritmo máximo, en países urbanizados, fue de 8 a 14 % anual durante una década**, y bajó de 3 %
   después de 25 a 35 años. Ritmos de 17 a 24 % solo se vieron con una gran reserva rural (Shenzhen,
   Gaborone) o en un estado nuevo (Palmas).

## ¿El modelo de proceso los reproduce?

Sí, cuando se conoce el motor de empleo. Se alimentó el modelo con lo que pasó en cada caso (año de
inicio, población inicial, empleos del motor año por año) y se comparó con los censos
(\`docs/backtest-trayectorias.md\`). El error es el promedio cuadrático del logaritmo del cociente
simulado/observado (0,35 ≈ ±40 %).

| Caso | Datos del motor | Error con los parámetros de la app | Error calibrado | Multiplicador calibrado | Llegada espontánea calibrada (por año) |
|---|---|---|---|---|---|
`;
for (const b of bt.filter((x) => x.tieneMotor).sort((a, b) => a.errorCalibrado - b.errorCalibrado)) {
  const r = RECORRIDOS.find((x) => x.id === b.id);
  md += `| ${r?.nombre ?? b.id} | sí | ${Number.isFinite(b.errorCiego) ? b.errorCiego.toFixed(2) : "s/d"} | ${b.errorCalibrado.toFixed(2)} | ${f1(b.multiplicador)} | ${n0(b.techo)} |\n`;
}
md += `
- Los casos de países urbanizados con buenos datos del motor (Tierra del Fuego, Canberra, Milton Keynes)
  se reproducen con errores de ±30 a ±40 %. La calibración pide multiplicadores altos (hasta 4, el borde
  de la búsqueda) porque las series del motor cuentan solo una parte del empleo básico: la industria en
  Tierra del Fuego o ALUAR en Madryn, sin el empleo público ni la construcción.
- Neuquén, Sejong, Putrajaya y Palmas no se reproducen: hay uno o dos datos del motor, muy lejos del
  inicio, y la interpolación no representa lo que pasó.
  Brasilia, Shenzhen o Ciudad Guayana necesitan llegadas espontáneas de 30.000 a 60.000 por año: había
  millones de personas migrando del campo, algo que la Argentina ya no tiene.
- **Multiplicador implícito.** En Tierra del Fuego, hacia 1987, unos 6.000 empleos industriales iban con
  unos 36.000 habitantes nuevos: cada empleo del motor sostuvo ~1,7 empleos más. En Canberra (1966),
  14.600 empleos públicos con ~94.000 habitantes: ~1,9. Moretti (2010) da 1,6 para la industria. Con
  esto, el modelo de la app pasó de un multiplicador central de 1 (rango 0,5–1,6) a 1,6 (rango 0,8–2,5).
- Donde no hay datos del motor (Belo Horizonte, Goiânia, Palmas, Gaborone) el modelo no se puede probar:
  solo se conoce la población.

## ¿Qué haría falta para seguir esos recorridos?

Para cada caso de la app (el mismo de \`docs/casos-concretos.md\`) se calcula qué habría que lograr
para crecer como los casos comparables en sus primeros 30 años: las mismas personas por año, en el
mismo año de vida. Los empleos a crear salen de una tasa de empleo de 0,45; el motor es la parte que no
genera el multiplicador (1,6).

`;
md += `| Seguir el recorrido de | Habitantes al año 30 | Llegada máxima por año | Veces el récord argentino | Empleos a crear en ese año | De esos, del motor | Viviendas en ese año |\n|---|---|---|---|---|---|---|\n`;
for (const r of RECORRIDOS.filter((x) => x.urbanizado && x.hasta >= 15)) {
  const e = emular(r, 0, 30, 1.6);
  md += `| ${r.nombre} | ${n0(e.pob[30])} | ${n0(e.llegadasPico)} | ${f1(e.vecesRecordAR)} | ${n0(e.empleosPico)} | ${n0(e.motorPico)} | ${n0(e.viviendasPico)} |\n`;
}
md += `\nY lo que da el proceso recomendado por las simulaciones en cada caso de la app (\`docs/simulaciones-procesos.md\`):\n\n| Caso de la app | Proceso recomendado | Habitantes al año 30 | Recorrido real más parecido |\n|---|---|---|---|\n`;
const ref = RECORRIDOS.filter((x) => x.urbanizado && x.hasta >= 15).map((r) => ({ r, p30: emular(r, 0, 30, 1.6).pob[30] }));
for (const pol of POLICIES) {
  const caso = elegirCaso(ds, loc, pol);
  if (!caso) continue;
  const cmp = compararEstrategias(ds, caso.s.best, pol.id, caso.meta, caso.costos, caso.r, 250);
  const elegido = cmp.poblar && cmp.marginal(cmp.poblar) < 50_000 ? cmp.poblar : cmp.mejor;
  const p = pol.id === "polos" ? elegido.pob30[1] : elegido.pob30[1];
  const masCerca = [...ref].sort((a, b) => Math.abs(Math.log(a.p30 / p)) - Math.abs(Math.log(b.p30 / p)))[0];
  md += `| ${pol.nombre}: ${caso.nombre} | ${elegido.estrategia.nombre} | ${n0(p)} | ${masCerca.r.nombre} (${n0(masCerca.p30)}) |\n`;
}
md += `\n`;
md += `**Lectura.** Los recorridos argentinos más parecidos a una ciudad nueva (Puerto Madryn, Tierra del
Fuego, Neuquén) necesitaron en su mejor momento entre 2.700 y 6.600 personas por año: entre una y dos
veces y media el mayor saldo migratorio reciente del país, sostenido por un motor de empleo concreto
(ALUAR y su puerto; la promoción industrial; el Estado provincial, El Chocón y el petróleo). La Plata,
Palmas, Milton Keynes y Sejong llegaron más rápido, pero con condiciones difíciles de repetir: una
capital provincial completa trasladada en meses y la inmigración europea (La Plata), un estado nuevo
(Palmas), una política nacional de 25 años con una corporación de desarrollo (Milton Keynes) o el
traslado de 40 organismos nacionales con su región alrededor (Sejong). El proceso recomendado por las
simulaciones queda en el orden de esos recorridos argentinos: la ciudad nueva, como Puerto Madryn; la
capital, como Milton Keynes, Neuquén o La Plata.
`;
writeFileSync("../docs/recorridos-exitosos.md", md);
console.log(md.length);
