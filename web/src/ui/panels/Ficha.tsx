// Ficha para gabinete: una página imprimible por sitio con lo necesario para decidir.

import { useMemo } from "react";
import { gridRing } from "h3-js";
import type { Dataset } from "../../data/load";
import { costBenefit, type CBAResult, type Escenario } from "../../model/benefits";
import { BENEFIT_PARAMS } from "../../model/benefitParamsData";
import { empleo, equilibrio, musd, porEtapa, riesgos, sinPolitica } from "../../model/brief";
import { estimateCosts } from "../../model/costs";
import { cbaInput } from "../../model/labor";
import { planConcreto } from "../../model/plan";
import { evaluarSitio } from "../evaluar";
import Recorridos from "./Recorridos";
import { centrosProvincia } from "../geo";
import { POLICY_BY_ID, type Policy, type PolicyId } from "../../model/policies";
import type { Site } from "../../model/sites";
import { UNIT_COSTS } from "../../model/unitCostsData";
import { plazo } from "./CostBenefit";

interface Props {
  ds: Dataset;
  site: Site;
  nombre: string;
  policy: Policy;
  poblacion: number;
  geo: Record<string, GeoJSON.FeatureCollection | undefined>;
  onClose: () => void;
}

const n0 = (v: number) => (Number.isFinite(v) ? Math.round(v).toLocaleString("es-AR") : "s/d");
const ESC: Escenario[] = ["optimista", "base", "pesimista"];
const anual = (r: CBAResult) => r.anual.productividad + r.anual.aglomeracion + r.anual.congestion + r.anual.polo;

function run(ds: Dataset, policy: PolicyId, pob: number, i: number, provincia: string) {
  const costos = estimateCosts(policy, ds.col, i, provincia, { poblacion: pob, densidad: 75 }, UNIT_COSTS);
  const inp = cbaInput(ds, policy, pob, costos, i);
  const r = Object.fromEntries(ESC.map((e) => [e, costBenefit(inp, BENEFIT_PARAMS, e)])) as Record<Escenario, CBAResult>;
  return { costos, r };
}

const PUBLICO = (c: ReturnType<typeof estimateCosts>) =>
  c.capital.filter((l) => l.id !== "vivienda" && l.id !== "mudanza" && l.id !== "rehab").reduce((a, l) => a + l.usd[1], 0);

/** Celda más cercana (≤ 50 km) que cumple la condición del instrumento: una ciudad para "intermedias", un pueblo para "pueblos". */
function sitioPara(ds: Dataset, i: number, id: PolicyId): number {
  const ok = (j: number) => {
    const pob = ds.col.pob[j];
    return id === "intermedias" ? pob >= 5000 : id === "pueblos" ? pob >= 200 && pob <= 5000 : true;
  };
  if (ok(i)) return i;
  for (let k = 1; k <= 8; k++) for (const h of gridRing(ds.h3[i], k)) { const j = ds.index.get(h); if (j !== undefined && ok(j)) return j; }
  return i;
}

/** Qué se logra en la misma zona con la misma inversión pública, según el instrumento. */
function mismoPresupuesto(ds: Dataset, i: number, provincia: string, presupuesto: number, actual: PolicyId) {
  const ids: PolicyId[] = ["ciudad_nueva", "intermedias", "pueblos", "polos"];
  return ids.map((id) => {
    const j = sitioPara(ds, i, id);
    let pob = 100_000;
    for (let k = 0; k < 5; k++) {
      const c = estimateCosts(id, ds.col, j, provincia, { poblacion: pob, densidad: 75 }, UNIT_COSTS);
      pob = Math.max(500, pob * (presupuesto / Math.max(PUBLICO(c), 1)));
    }
    const { r } = run(ds, id, pob, j, provincia);
    return { id, nombre: POLICY_BY_ID[id].nombre, pob, anual: anual(r.base), recupero: r.base.social.recupero, actual: id === actual };
  });
}

function MiniMapa({ prov, punto, flujos = [] }: { prov?: GeoJSON.FeatureCollection; punto: [number, number]; flujos?: { lugar: string; pct: number }[] }) {
  const W = 150, H = 260;
  const x0 = -74, x1 = -53, y0 = -55.5, y1 = -21.5;
  const kx = W / (x1 - x0), ky = H / (y1 - y0);
  const px = (lon: number) => (lon - x0) * kx;
  const py = (lat: number) => (y1 - lat) * ky;
  const d = useMemo(() => {
    let s = "";
    for (const f of prov?.features ?? []) {
      const g = f.geometry;
      const polys = g?.type === "MultiPolygon" ? g.coordinates : g?.type === "Polygon" ? [g.coordinates] : [];
      for (const poly of polys) {
        const ring = poly[0];
        if (ring.length < 8 || ring[0][1] < -56) continue;
        const step = Math.max(1, Math.floor(ring.length / 120));
        s += "M" + ring.filter((_, k) => k % step === 0).map((p) => `${px(p[0]).toFixed(1)},${py(p[1]).toFixed(1)}`).join("L") + "Z";
      }
    }
    return s;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [prov]);
  const cs = useMemo(() => centrosProvincia(prov), [prov]);
  const tx = px(punto[0]), ty = py(punto[1]);
  return (
    <svg className="minimapa" viewBox={`0 0 ${W} ${H}`} width={W} height={H} aria-label="Ubicación y de dónde llegaría la gente">
      <path d={d} />
      {flujos.map((f) => {
        const c = cs.get(f.lugar);
        if (!c || f.pct < 2) return null;
        const x = px(c[0]), y = py(c[1]);
        const mx = (x + tx) / 2 + (ty - y) * 0.15, my = (y + ty) / 2 + (x - tx) * 0.15;
        return <path key={f.lugar} className="flujo" d={`M${x.toFixed(1)},${y.toFixed(1)}Q${mx.toFixed(1)},${my.toFixed(1)} ${tx.toFixed(1)},${ty.toFixed(1)}`} strokeWidth={Math.max(0.8, Math.sqrt(f.pct) * 0.9)} />;
      })}
      <circle cx={px(punto[0])} cy={py(punto[1])} r={7} className="pt-halo" />
      <circle cx={px(punto[0])} cy={py(punto[1])} r={3.5} className="pt" />
    </svg>
  );
}

export default function Ficha(p: Props) {
  const i = p.site.best;
  const polos = p.policy.id === "polos";
  // mismo cálculo que las tarjetas: costos, proceso recomendado y cuenta ajustada a la gente que llega
  const ev = useMemo(() => evaluarSitio(p.ds, p.site, p.nombre, 0, p.policy.id, p.poblacion), [p.ds, p.site, p.nombre, p.policy.id, p.poblacion]);
  const costos = ev.c;
  const r = ev.cba;
  const b = r.base;
  const mand = porEtapa(b);
  const emp = empleo(p.ds, i, p.policy.id, b, p.geo.proyectos);
  const cmp = ev.cmp;
  const elegido = ev.elegido;
  const tray = elegido.central.serie.map((x) => (polos ? x.pob / 2.2 : x.pob));
  const plan = useMemo(
    () => planConcreto(p.ds, i, p.policy.id, p.poblacion, p.nombre.replace(/^Cerca de /, ""), r, tray, elegido.estrategia.nombre, elegido.estrategia.motorEmpleos),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [p.ds, i, p.policy.id, p.poblacion, p.nombre, r, elegido],
  );
  const ries = riesgos(p.ds, i, p.policy.id, p.poblacion, r, emp);
  const otros = useMemo(
    () => (p.policy.id === "capital" ? [] : mismoPresupuesto(p.ds, i, p.site.provincia, PUBLICO(costos), p.policy.id)),
    [p.ds, i, p.site.provincia, costos, p.policy.id],
  );
  const comun = (costos.totalCapital[1] - b.inversionExtra) / Math.max(p.poblacion, 1);
  const sp = sinPolitica(comun);
  const a = anual(b);
  const inp = useMemo(() => cbaInput(p.ds, p.policy.id, p.poblacion, costos, i), [p.ds, p.policy.id, p.poblacion, costos, i]);
  // el equilibrio se busca escalando la curva sin ajustar; se compara con lo que da el proceso simulado
  const eq0 = useMemo(() => equilibrio(inp, ev.cbaCurva.base), [inp, ev]);
  const eq = { ...eq0, esperada: (polos ? elegido.pob30[1] / 2.2 : elegido.pob30[1]) / Math.max(p.poblacion, 1), conviene: b.social.van >= 0 };
  const reg = useMemo(() => (polos ? null : costBenefit({ ...inp, origen: "region" }, BENEFIT_PARAMS, "base")), [inp, polos]);
  const frente = polos ? "frente a no tener el polo" : "frente a que esa población crezca en el AMBA";
  const pct = (x: number) => `${Math.round(x * 100)} %`;
  const rec =
    b.social.van > 0
      ? `Conviene avanzar a estudios de factibilidad: con la llegada ${polos ? "de empresas" : "de gente"} más probable, el país gana ${frente}.`
      : r.optimista.social.van > 0
        ? `Solo conviene si se asegura que ${polos ? "se instalen las empresas" : "lleguen la gente y el empleo"}: avanzar por etapas, cada una condicionada a la ocupación de la anterior.`
        : `En términos económicos no conviene ${frente}. Solo se justifica por razones estratégicas que esta cuenta no mide (soberanía, integración territorial, calidad de vida).`;
  const cond = eq.conviene
    ? eq.ocupacion !== null && eq.ocupacion < eq.esperada
      ? `Sigue conviniendo aunque ${polos ? "se ocupe" : "llegue"} solo el ${pct(eq.ocupacion)} de la meta en 30 años (se espera el ${pct(eq.esperada)}).`
      : ""
    : eq.ocupacion !== null
      ? `Para que convenga tendría que ${polos ? "ocuparse" : "llegar"} el ${pct(eq.ocupacion)} de la meta en 30 años (se espera el ${pct(eq.esperada)}).`
      : eq.salario !== null
        ? `Más ${polos ? "empresas" : "gente"} no alcanza: haría falta que los salarios de la zona fueran ${eq.salario.toLocaleString("es-AR", { maximumFractionDigits: 2 })} veces el promedio nacional (hoy ${eq.salarioActual.toLocaleString("es-AR", { maximumFractionDigits: 2 })}), es decir, empleo más productivo que el que hay.`
        : "Ni con más gente ni con mejores salarios la cuenta llega a cero en el horizonte evaluado.";
  const hoy = new Date().toLocaleDateString("es-AR", { day: "numeric", month: "long", year: "numeric" });
  const [lat, lon] = [p.site.center[1], p.site.center[0]];

  return (
    <div className="ficha-wrap" role="dialog" aria-label="Ficha para gabinete">
      <article className="ficha">
        <div className="ficha-bar no-print">
          <button className="primary" onClick={() => window.print()}>Imprimir o guardar PDF</button>
          <button onClick={p.onClose}>Cerrar</button>
        </div>
        <header className="ficha-h">
          <div>
            <p className="lema">Ficha para gabinete · {hoy}</p>
            <h2>{p.policy.nombre}: {p.nombre}</h2>
            <p className="muted">
              {p.site.departamento}, {p.site.provincia} · {lat.toFixed(2)}°, {lon.toFixed(2)}° · meta: {n0(p.poblacion)} {polos ? "empleos" : "habitantes"}
            </p>
            <p className="ficha-rec"><b>Recomendación.</b> {rec} {cond && <b>{cond}</b>}</p>
          </div>
          <MiniMapa prov={p.geo.provincias} punto={p.site.center} flujos={plan.deDonde.filter((o) => o.tipo === "corredor")} />
        </header>

        <section className="ficha-tiles">
          <div className="tile"><span className="small">Inversión total</span><b>{musd(costos.totalCapital[1])}</b><span className="small muted">rango {musd(costos.totalCapital[0])} a {musd(costos.totalCapital[2])}</span></div>
          <div className="tile"><span className="small">Depende del lugar</span><b>{musd(costos.propio[1])}</b><span className="small muted">rutas, energía, agua, tierra y sobrecosto regional</span></div>
          <div className="tile"><span className="small">Resultado anual (año {b.anual.anio})</span><b className={a >= 0 ? "pos" : "neg"}>{a >= 0 ? "+" : ""}{musd(a)}</b><span className="small muted">{polos ? "producción nueva" : "frente a crecer en el AMBA"}{reg && <>; si vienen de la misma región: {anual(reg) >= 0 ? "+" : ""}{musd(anual(reg))}</>}</span></div>
          <div className="tile"><span className="small">Recupero para el país</span><b>{b.social.recupero !== null ? plazo(b.social.recupero) : "no se recupera"}</b><span className="small muted">de la inversión extra</span></div>
          <div className="tile"><span className="small">Para el Tesoro</span><b className={b.fiscal.van >= 0 ? "pos" : "neg"}>{b.fiscal.van >= 0 ? "+" : ""}{musd(b.fiscal.van)}</b><span className="small muted">pone {musd(b.fiscal.vpCostos)}, recupera {musd(b.fiscal.vpBeneficios)} en impuestos{b.fiscal.recupero !== null ? `; se recupera ${plazo(b.fiscal.recupero)}` : ""} (valor presente)</span></div>
        </section>

        <section>
          <h3>Qué se haría, paso a paso</h3>
          <p className="small">{plan.resumen}</p>
          <ol className="etapas">
            {plan.etapas.map((e) => (
              <li key={e.nombre}>
                <div className="etapa-h">
                  <b>{e.nombre}</b> <span className="muted small">años {e.desde} a {e.hasta}</span>
                  <span className="etapa-n">{polos ? `+${n0(e.llegan)} empleos` : `+${n0(e.llegan)} personas`} <span className="muted small">({n0(e.porAnio)} por año · total {n0(e.acumulado)})</span></span>
                </div>
                <ul className="small">
                  {e.obras.map((o) => <li key={o.que}>{o.que}: <b>{o.cantidad}</b></li>)}
                </ul>
                <p className="small muted">Para seguir: {e.condicion}</p>
              </li>
            ))}
          </ol>
        </section>

        <section>
          <h3>Cómo conviene hacerlo: {cmp.rs.length} procesos simulados</h3>
          <p className="small">
            Cada proceso se simuló {250} veces año por año (empleo, vivienda, migración y nacimientos), variando lo que no se sabe con
            certeza. Con los flujos migratorios argentinos, el proceso recomendado llega a{" "}
            <b>{n0(polos ? elegido.pob30[1] / 2.2 : elegido.pob30[1])} {polos ? "empleos" : "habitantes"}</b> en 30 años, y la cuenta económica de arriba ya usa
            esa cifra. Con la curva de la experiencia internacional habría llegado el {Math.round((100 * ev.cbaCurva.base.anual.poblacion) / Math.max(p.poblacion, 1))} % de la meta.
          </p>
          <div className="tabla-scroll">
            <table className="provs">
              <thead><tr><th>Proceso</th><th className="num">{polos ? "Población" : "Habitantes"} al año 30</th><th className="num">Viviendas vacías</th><th className="num">Saldo para el país</th><th className="num">Prob. saldo +</th><th className="num">Costo por habitante extra</th></tr></thead>
              <tbody>
                {cmp.rs.map((x) => {
                  const m = cmp.marginal(x);
                  return (
                    <tr key={x.estrategia.id} className={x === elegido ? "actual" : ""} title={x.estrategia.descripcion}>
                      <td>{x.estrategia.nombre}{x === elegido && " (recomendado)"}{x === cmp.mejor && x !== elegido && " (mejor saldo)"}</td>
                      <td className="num">{n0(x.pob30[1])} <span className="muted small">({n0(x.pob30[0])}–{n0(x.pob30[2])})</span></td>
                      <td className="num">{Math.round(x.vaciasMax * 100)} %</td>
                      <td className={`num ${x.van[1] >= 0 ? "pos" : "neg"}`}>{musd(x.van[1])}</td>
                      <td className="num">{Math.round(x.pVanPositivo * 100)} %</td>
                      <td className="num">{x === cmp.ref ? "referencia" : Number.isFinite(m) ? (m <= 0 ? "gana" : `USD ${n0(m)}`) : "no suma"}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
          <h3>Comparado con recorridos reales</h3>
          <Recorridos plan={[0, ...elegido.central.serie.map((x) => x.pob)]} etiqueta="Este lugar" />
          <p className="small muted">
            Recomendado: {elegido.estrategia.descripcion} El plan paso a paso de arriba sigue este proceso. Detalle del modelo y de los supuestos
            en docs/simulaciones-procesos.md.
          </p>
        </section>

        <div className="ficha-cols">
          <section>
            <h3>Quiénes llegarían</h3>
            <ul className="small facts">{plan.quienes.map((q) => <li key={q}>{q}</li>)}</ul>
            {plan.deDonde.length > 0 && (
              <>
                <h3>De dónde vendrían</h3>
                <table className="provs">
                  <tbody>
                    {plan.deDonde.filter((o) => o.pct >= 1).slice(0, 8).map((o) => (
                      <tr key={o.lugar}><td>{o.lugar}</td><td className="num">{Math.round(o.pct)} %</td><td className="num">{n0(o.personas)} personas</td></tr>
                    ))}
                  </tbody>
                </table>
                <p className="small muted">
                  Según quiénes ya se mudan hoy a {p.site.provincia} (Censo 2022, CEPAL/CELADE) y las mudanzas dentro de cada provincia (RENAPER
                  2012–2022). El AMBA se separa del resto de Buenos Aires con el Censo 2010. Las líneas del mapa muestran los corredores.
                </p>
              </>
            )}
          </section>
          <section>
            <h3>Qué significaría</h3>
            {plan.significa.map((x) => <p className="small" key={x.titulo}><b>{x.titulo}.</b> {x.texto}</p>)}
            {emp.proyectos.length > 0 && (
              <>
                <p className="small"><b>Proyectos productivos cerca:</b></p>
                <ul className="small facts">
                  {emp.proyectos.map((x) => <li key={x.nombre + x.km}>{x.nombre} <span className="muted">({x.tipo}, a {Math.round(x.km)} km)</span></li>)}
                </ul>
              </>
            )}
          </section>
        </div>

        <div className="ficha-cols">
          <section>
            <h3>La inversión en el tiempo</h3>
            <table className="provs">
              <thead><tr><th>Período</th><th className="num">Total</th><th className="num">Pública</th><th className="num">{polos ? "Empleos" : "Habitantes"}</th></tr></thead>
              <tbody>
                {mand.map((m) => (
                  <tr key={m.nombre}><td>{m.nombre}</td><td className="num">{musd(m.inversion)}</td><td className="num">{musd(m.publica)}</td><td className="num">{n0(m.poblacionAlFinal)}</td></tr>
                ))}
                <tr className="total"><td><b>Total a 30 años</b></td><td className="num"><b>{musd(mand.reduce((x, m) => x + m.inversion, 0))}</b></td><td className="num"><b>{musd(mand.reduce((x, m) => x + m.publica, 0))}</b></td><td className="num"><b>{n0(mand[mand.length - 1].poblacionAlFinal)}</b></td></tr>
              </tbody>
            </table>
            <p className="small muted">Escenario "lo más probable": las obras de conexión en los primeros 5 años y el resto al ritmo en que llega la gente. "Pública" excluye las viviendas y las mudanzas, que pagan los hogares. Montos sin descontar, en dólares de hoy. Los {musd(costos.totalCapital[1])} se completan solo si llega toda la gente.</p>
          </section>

          <section>
            <h3>Si no se hace nada</h3>
            <p className="small">
              Según el INDEC, entre 2022 y 2035 el país suma unas <b>{n0(sp.pais)} personas</b> y el AMBA{" "}
              {sp.amba < 0 ? <>pierde <b>{n0(-sp.amba)}</b></> : <>suma <b>{n0(sp.amba)}</b></>}. El crecimiento va sobre todo a{" "}
              {sp.dondeCrece.map((x) => `${x.lugar} (+${n0(x.delta)})`).join(", ")}.
            </p>
            <p className="small">
              {sp.amba <= 0
                ? "El AMBA ya no crece: descomprimirlo significa mudar a gente que ya vive ahí, no desviar crecimiento nuevo. La pregunta útil es dónde conviene que viva el millón de personas que se suma en el resto del país."
                : "Si no se hace nada, ese crecimiento se suma a la congestión del AMBA."}{" "}
              Alojar ese crecimiento donde ocurra cuesta unos {musd(sp.costoAbsorber)} en viviendas y servicios: esta política agrega{" "}
              {musd(b.inversionExtra)} a esa cuenta.
            </p>
            {otros.length > 0 && (
              <>
                <h3>Con la misma inversión pública ({musd(PUBLICO(costos))}), en esta zona</h3>
                <table className="provs">
                  <thead><tr><th>Instrumento</th><th className="num">Alcanza para</th><th className="num">Resultado anual</th><th className="num">Se paga</th></tr></thead>
                  <tbody>
                    {otros.map((o) => (
                      <tr key={o.id} className={o.actual ? "actual" : ""}>
                        <td>{o.nombre}{o.actual && " (elegido)"}</td>
                        <td className="num">{n0(o.pob)} {o.id === "polos" ? "empleos" : "hab."}</td>
                        <td className={`num ${o.anual >= 0 ? "pos" : "neg"}`}>{o.anual >= 0 ? "+" : ""}{musd(o.anual)}</td>
                        <td className="num">{o.recupero !== null ? (o.recupero < 5 ? "< 5 años" : `~${o.recupero} años`) : "no"}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                <p className="small muted">Inversión pública: todo salvo las viviendas y las mudanzas, que pagan los hogares. Fortalecer ciudades y pueblos existentes reutiliza viviendas desocupadas y no necesita obras de conexión nuevas; un polo se mide en empleos (cada empleo sostiene unos 2 habitantes).</p>
              </>
            )}
          </section>
        </div>

        <section>
          <h3>Qué puede salir mal y cómo evitarlo</h3>
          <table className="provs riesgos">
            <tbody>
              {ries.map((x) => (
                <tr key={x.que}><td><span className={`nivel ${x.nivel}`}>{x.nivel}</span></td><td>{x.que}</td><td className="muted">{x.mitigacion}</td></tr>
              ))}
            </tbody>
          </table>
        </section>

        <footer className="small muted ficha-pie">
          Estimación de orden de magnitud a escala nacional (Atlas del Desarrollo Argentino). Costos paramétricos tipo "clase 5"
          de AACE; beneficios frente a que la misma población crezca en el AMBA, tasa social {Math.round(b.tasa * 100)} %, horizonte {b.horizonte} años.
          No reemplaza estudios de factibilidad en el terreno. Fuentes y supuestos: docs/costos-unitarios.md y docs/beneficios-parametros.md.
        </footer>
      </article>
    </div>
  );
}
