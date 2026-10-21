// Plan concreto de un sitio: qué se construiría en cada etapa, quiénes llegarían, desde
// dónde y a qué ritmo, y qué significaría para la región y para el país. Es el mismo
// razonamiento que docs/casos-concretos.md aplica a un caso por instrumento, generalizado.

import type { Dataset } from "../data/load";
import type { CBAResult, Escenario } from "./benefits";
import { empleoFaltante, mercadoLaboral } from "./labor";
import type { PolicyId } from "./policies";
import { UNIT_COSTS } from "./unitCostsData";
import { MIGRANTES_ANIO, PERFIL, origenObservado, ritmo, type Origen, type Ritmo2 } from "./migracion";

const U = UNIT_COSTS.items;
const c0 = (id: string, d: number) => U[id]?.central ?? d;

export interface Obra {
  que: string;
  cantidad: string;
}

export interface EtapaPlan {
  nombre: string;
  desde: number;
  hasta: number;
  llegan: number; // personas (o empleos) que se suman en la etapa
  porAnio: number;
  acumulado: number;
  obras: Obra[];
  condicion: string; // qué tiene que pasar para empezar la siguiente
}

export interface Plan {
  resumen: string;
  etapas: EtapaPlan[];
  quienes: string[]; // perfil de quienes llegan, por etapa del proceso
  deDonde: Origen[];
  ritmo: Ritmo2 | null;
  significa: { titulo: string; texto: string }[];
}

const n0 = (v: number) => (Number.isFinite(v) ? Math.round(v).toLocaleString("es-AR") : "s/d");
const red = (v: number) => {
  if (!(v > 0)) return 0;
  const m = 10 ** Math.max(0, Math.floor(Math.log10(v)) - 1);
  return Math.round(v / m) * m;
};

/** Población acumulada al final de cada año según el escenario base (desde el cronograma del costo-beneficio). */
const acumuladoAl = (r: CBAResult, anio: number) => r.cronograma.find((x) => x.anio === anio)?.poblacion ?? 0;

const NOMBRE: Record<PolicyId, string> = {
  ciudad_nueva: "una ciudad nueva",
  capital: "la nueva capital",
  intermedias: "el crecimiento de la ciudad",
  pueblos: "el repoblamiento de un pueblo",
  polos: "un polo productivo",
};

export function planConcreto(
  ds: Dataset,
  i: number,
  policy: PolicyId,
  meta: number,
  lugar: string,
  r: Record<Escenario, CBAResult>,
): Plan {
  const c = ds.col;
  const b = r.base;
  const polos = policy === "polos";
  const nueva = policy === "ciudad_nueva" || policy === "capital";
  const pph = c0("personas_por_hogar", 2.86);
  const escolar = c0("share_edad_escolar", 0.19);
  const camas = c0("camas_por_1000", 3.36);
  const empHa = c0("empleos_por_ha_industrial", 8.2);
  const apn = policy === "capital" ? c0("empleados_apn_caba", 74000) : 0;
  const merc = mercadoLaboral(ds, i);
  const B = c.pob_50km[i];

  // ------------------------------------------------ etapas (años 1–5, 6–10, 11–20, 21–30)
  const cortes: [string, number, number][] = [
    ["Etapa 1 · obras y primeros habitantes", 1, 5],
    ["Etapa 2 · consolidación", 6, 10],
    ["Etapa 3 · crecimiento", 11, 20],
    ["Etapa 4 · madurez", 21, 30],
  ];
  let agentesPrevios = 0;
  const etapas: EtapaPlan[] = cortes.map(([nombre, desde, hasta], k) => {
    const a0 = acumuladoAl(b, desde - 1);
    const a1 = acumuladoAl(b, hasta);
    const d = Math.max(0, a1 - a0);
    const obras: Obra[] = [];
    if (k === 0 && (nueva || polos)) {
      if (c.d_ruta[i] > 1) obras.push({ que: "Ruta de acceso pavimentada", cantidad: `${n0(c.d_ruta[i])} km hasta la ruta nacional` });
      if (c.d_alta_tension[i] > 1) obras.push({ que: "Línea de alta tensión de 132 kV", cantidad: `${n0(c.d_alta_tension[i])} km y estación transformadora` });
      else obras.push({ que: "Estación transformadora", cantidad: "conexión a la línea existente" });
    }
    if (polos) {
      const ha = d / empHa;
      if (d > 0) obras.push({ que: "Lotes industriales urbanizados", cantidad: `${n0(red(ha))} ha (para ${n0(red(d))} empleos)` });
      if (k === 0) obras.push({ que: "Empresas ancla", cantidad: "2 o 3 con compromiso firmado antes de urbanizar" });
    } else if (d > 0) {
      const hog = d / pph;
      const ociosas = nueva ? 0 : Math.min(hog, (c.viv_ociosas_50km[i] || 0) * 0.1 * (d / Math.max(meta, 1)));
      if (ociosas > 50) obras.push({ que: "Viviendas desocupadas recuperadas", cantidad: `${n0(red(ociosas))}` });
      obras.push({ que: nueva ? "Viviendas nuevas" : "Viviendas nuevas en el ejido actual", cantidad: `${n0(red(hog - ociosas))}` });
      if (nueva) obras.push({ que: "Suelo urbanizado (redes, calles, desagües)", cantidad: `${n0(red(d / 75))} ha` });
      // los primeros migrantes traen menos chicos (0,31 por adulto joven contra 0,54): la escuela llega a pleno en la etapa 2
      const kEsc = k === 0 && nueva ? PERFIL.ninos / PERFIL.ninosNoMig : 1;
      obras.push({ que: "Lugares en escuelas", cantidad: `${n0(red(d * escolar * kEsc))} alumnos${kEsc < 1 ? " (los primeros en llegar traen pocos chicos)" : ""}` });
      obras.push({ que: "Camas de internación", cantidad: `${n0(red((d / 1000) * camas))}` });
      if (nueva && k === 0) {
        const m3 = (meta * 200) / 1000;
        obras.push({ que: "Planta potabilizadora (dimensionada para la meta, ampliable)", cantidad: `${n0(red(m3 / 4))} m³/día en la primera etapa` });
      }
      if (policy === "capital") {
        // cada agente trasladado trae su hogar y sostiene otro hogar de servicios
        const ag = Math.min(apn - agentesPrevios, d / (pph * 2));
        agentesPrevios += ag;
        if (ag > 0) obras.push({ que: "Organismos nacionales trasladados", cantidad: `${n0(red(ag))} agentes (acumulado ${n0(red(agentesPrevios))} de ${n0(apn)})` });
        if (k === 1) obras.push({ que: "Congreso, Corte y tribunales federales", cantidad: "edificios definitivos" });
      }
    }
    const condicion = polos
      ? k === 0 ? "Que las empresas ancla estén produciendo y haya pedidos de lotes por al menos la mitad de la etapa siguiente." : "Que los lotes de la etapa anterior estén ocupados en un 80 %."
      : k === 0
        ? policy === "capital" ? "Que los primeros organismos funcionen en el lugar y los agentes se hayan mudado con sus familias." : "Que la primera etapa esté habitada en un 80 % y haya empleo para quienes llegaron."
        : "Que la etapa anterior esté ocupada en un 80 %: no se construye por adelantado.";
    return { nombre, desde, hasta, llegan: d, porAnio: d / (hasta - desde + 1), acumulado: a1, obras, condicion };
  }).filter((e) => e.llegan > 0 || e.obras.length > 0);

  // ------------------------------------------------ quiénes y de dónde
  const prov = ds.meta.departamentos[ds.dep[i]]?.provincia ?? "";
  const llegan = b.anual.poblacion;
  const deDonde = polos ? [] : origenObservado(prov, llegan);
  const misma = deDonde.find((o) => o.tipo === "misma");
  const top = deDonde.filter((o) => o.tipo === "corredor").slice(0, 2).map((o) => o.lugar);
  const pico = etapas.reduce((m, e) => Math.max(m, e.porAnio), 0);
  const rt = ritmo(pico, B);
  const quienes = polos
    ? [
        "Primero llegan técnicos y operarios que ya trabajan en la industria, muchos desde la misma región, y quienes viajan a diario desde la ciudad base.",
        "Después, proveedores y servicios: por cada empleo industrial nuevo aparecen entre medio y uno y medio más en comercio y servicios de la zona (Moretti 2010).",
      ]
    : [
        policy === "capital"
          ? `Primero llegan los agentes públicos trasladados con sus familias, y con ellos quienes atienden a esa demanda: comercio, salud, educación, construcción. Si se mudaran los ${n0(apn)} agentes con sus hogares, la ciudad pasaría las ${n0(red(apn * pph * 2))} personas; el escenario probable supone que muchos no se mudan y viajan, como pasó en Brasilia y en Putrajaya.`
          : `Primero llegan adultos jóvenes que consiguen trabajo: entre quienes cambian de provincia, el ${Math.round(PERFIL.jovenes)} % tiene de 15 a 34 años (contra ${Math.round(PERFIL.jovenesNoMig)} % del resto) y estudió más (${PERFIL.estudio.toLocaleString("es-AR", { maximumFractionDigits: 1 })} años contra ${PERFIL.estudioNoMig.toLocaleString("es-AR", { maximumFractionDigits: 1 })}). La construcción de la propia ciudad es el primer empleo.`,
        `Traen pocos chicos (${PERFIL.ninos.toLocaleString("es-AR", { maximumFractionDigits: 2 })} por adulto joven, contra ${PERFIL.ninosNoMig.toLocaleString("es-AR", { maximumFractionDigits: 2 })}): al principio hacen falta más viviendas chicas y menos escuelas; las familias y los nacimientos llegan después.`,
        `La mayoría viene de cerca o por corredores que ya existen${misma ? `: cerca de ${Math.round(misma.pct)} % de la misma provincia` : ""}${top.length ? ` y, de afuera, sobre todo de ${top.join(" y ")}` : ""}. La gente se muda donde ya fueron parientes y conocidos; la distancia pesa poco.`,
        `Uno de cada tres migrantes recientes (${Math.round(PERFIL.retorno)} %) vuelve a su provincia de nacimiento: atraer a quienes nacieron en la región y se fueron es una vía concreta para poblar.`,
      ];

  // ------------------------------------------------ qué significaría
  const significa: { titulo: string; texto: string }[] = [];
  if (!polos) {
    significa.push({
      titulo: "Para la región",
      texto: `Hoy viven ${n0(B)} personas a 50 km. En 30 años se sumarían unas ${n0(llegan)} (${Math.round((100 * llegan) / Math.max(B, 1))} % más). ${
        llegan > B ? "La región cambiaría de escala: más que duplicarse obliga a rehacer transporte, agua y servicios de toda la zona, no solo del lugar nuevo." : llegan > 0.3 * B ? "Es un salto grande: los servicios de las ciudades vecinas también van a recibir más demanda." : "La región lo absorbe sin cambiar de escala."
      }`,
    });
    const empleos = llegan * 0.45;
    const ef = empleoFaltante(empleos, merc, 30, apn);
    significa.push({
      titulo: "Para el trabajo",
      texto: `Esa población necesita unos ${n0(empleos)} empleos nuevos: los ${n0(merc.puestos)} puestos privados que hay hoy en la zona${merc.sectores.length ? ` (sobre todo ${merc.sectores.slice(0, 2).join(" y ").toLowerCase()})` : ""} ya los ocupa quien vive ahí. ${
        ef.traslado > 0 ? `El traslado de organismos aporta unos ${n0(ef.traslado)} con los servicios que genera. ` : ""
      }Si la zona sigue creciendo como entre 2014 y 2022, para los recién llegados quedarían unos ${n0(ef.organico)}. ${
        ef.faltan > 0.2 * empleos
          ? `Faltan ${n0(ef.faltan)}: hay que crearlos con una actividad nueva. Si no, el trabajo pone el techo: llegarían unas ${n0(red((ef.organico + ef.traslado) / 0.45))} personas en 30 años y no ${n0(red(llegan))}.`
          : "Alcanza con el crecimiento esperado."
      }`,
    });
    const m3 = (llegan * 200) / 1000 / 86400;
    const q95 = c.q95_rio25[i];
    significa.push({
      titulo: "Para el agua",
      texto: q95 > 0
        ? `Se usarían ${m3.toLocaleString("es-AR", { maximumFractionDigits: 2 })} m³/s, el ${Math.max(1, Math.round((100 * m3) / q95))} % del caudal del río cercano en sequía (${q95.toLocaleString("es-AR", { maximumFractionDigits: 1 })} m³/s).`
        : `Se usarían ${m3.toLocaleString("es-AR", { maximumFractionDigits: 2 })} m³/s; no hay un río grande a 25 km, el agua tendría que venir de napas o de un acueducto.`,
    });
  } else {
    significa.push({
      titulo: "Para la región",
      texto: `El polo sumaría unos ${n0(llegan)} empleos en 30 años a los ${n0(merc.puestos)} puestos privados que hay hoy en la zona (${Math.round((100 * llegan) / Math.max(merc.puestos, 1))} % más). Con sus familias y los servicios que atraen, la región crecería en unas ${n0(llegan * 2.2)} personas.`,
    });
  }
  significa.push({
    titulo: "Para el país",
    texto: `En la etapa de más crecimiento llegarían unas ${n0(pico)} ${polos ? "contrataciones por año" : "personas por año"}: el ${rt.pctNacional.toLocaleString("es-AR", { maximumFractionDigits: 1 })} % de todos los que cambian de provincia en un año en la Argentina (${n0(MIGRANTES_ANIO)}, Censo 2022). La región crecería un ${rt.pctRegion.toLocaleString("es-AR", { maximumFractionDigits: 1 })} % por año. ${
      rt.veces > 1.5
        ? `Es ${rt.veces.toLocaleString("es-AR", { maximumFractionDigits: 1 })} veces el mayor saldo migratorio observado en un lugar argentino (${rt.maxNeto.lugar}: ${n0(rt.maxNeto.valor)} personas netas por año en ${rt.maxNeto.periodo}); incluso ${rt.maxTotal.lugar}, sumando nacimientos, creció ${n0(rt.maxTotal.valor)} por año en ${rt.maxTotal.periodo}. No hay antecedente en el país: haría falta un motor de empleo excepcional.`
        : rt.veces > 0.7
          ? `Está en el límite de lo observado: el lugar que más gente atrajo, ${rt.maxNeto.lugar}, sumó ${n0(rt.maxNeto.valor)} personas netas por año en ${rt.maxNeto.periodo}.`
          : `Está dentro de lo que ya pasó en el país (${rt.maxNeto.lugar} sumó ${n0(rt.maxNeto.valor)} personas netas por año en ${rt.maxNeto.periodo}).`
    } ${polos ? "" : "El AMBA no crece según el INDEC: lo que se mueva desde allí sale de su población actual."}`,
  });

  const lugarTxt = nueva || policy === "pueblos" ? `cerca de ${lugar}` : polos ? `junto a ${lugar}` : `en ${lugar}`;
  const resumen = `${NOMBRE[policy][0].toUpperCase()}${NOMBRE[policy].slice(1)} ${lugarTxt}, con una meta de ${n0(meta)} ${polos ? "empleos" : "habitantes"}. Con el ritmo más probable se alcanzarían ${n0(llegan)} en 30 años, construyendo por etapas y solo cuando la anterior se ocupa.`;
  return { resumen, etapas, quienes, deDonde, ritmo: polos ? null : rt, significa };
}
