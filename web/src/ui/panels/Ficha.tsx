// Ficha para gabinete: una página imprimible por sitio con lo necesario para decidir.

import { useMemo } from "react";
import { gridRing } from "h3-js";
import type { Dataset } from "../../data/load";
import { costBenefit, type CBAResult, type Escenario } from "../../model/benefits";
import { BENEFIT_PARAMS } from "../../model/benefitParamsData";
import { efectoPolitico, empleo, equilibrio, hitos, hojaDeRuta, musd, origen, porMandato, quienPaga, riesgos, sinPolitica } from "../../model/brief";
import { estimateCosts } from "../../model/costs";
import { cbaInput } from "../../model/labor";
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

function MiniMapa({ prov, punto }: { prov?: GeoJSON.FeatureCollection; punto: [number, number] }) {
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
  return (
    <svg className="minimapa" viewBox={`0 0 ${W} ${H}`} width={W} height={H} aria-label="Ubicación en el mapa del país">
      <path d={d} />
      <circle cx={px(punto[0])} cy={py(punto[1])} r={7} className="pt-halo" />
      <circle cx={px(punto[0])} cy={py(punto[1])} r={3.5} className="pt" />
    </svg>
  );
}

export default function Ficha(p: Props) {
  const i = p.site.best;
  const polos = p.policy.id === "polos";
  const { costos, r } = useMemo(() => run(p.ds, p.policy.id, p.poblacion, i, p.site.provincia), [p.ds, p.policy.id, p.poblacion, i, p.site.provincia]);
  const b = r.base;
  const mand = porMandato(b);
  const pagan = quienPaga(costos);
  const emp = empleo(p.ds, i, p.policy.id, b, p.geo.proyectos);
  const ori = polos ? [] : origen(p.ds, i);
  const pasos = hojaDeRuta(p.ds, i, p.policy.id, p.site.provincia);
  const ries = riesgos(p.ds, i, p.policy.id, p.poblacion, r, emp);
  const otros = useMemo(
    () => (p.policy.id === "capital" ? [] : mismoPresupuesto(p.ds, i, p.site.provincia, PUBLICO(costos), p.policy.id)),
    [p.ds, i, p.site.provincia, costos, p.policy.id],
  );
  const comun = (costos.totalCapital[1] - b.inversionExtra) / Math.max(p.poblacion, 1);
  const sp = sinPolitica(comun);
  const a = anual(b);
  const inp = useMemo(() => cbaInput(p.ds, p.policy.id, p.poblacion, costos, i), [p.ds, p.policy.id, p.poblacion, costos, i]);
  const eq = useMemo(() => equilibrio(inp, b), [inp, b]);
  const reg = useMemo(() => (polos ? null : costBenefit({ ...inp, origen: "region" }, BENEFIT_PARAMS, "base")), [inp, polos]);
  const hs = hitos(p.policy.id);
  const pol = polos ? [] : efectoPolitico(p.ds, i, p.site.provincia, b.anual.poblacion);
  const pbi = UNIT_COSTS.items.pbi_usd?.central ?? NaN;
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
          <MiniMapa prov={p.geo.provincias} punto={p.site.center} />
        </header>

        <section className="ficha-tiles">
          <div className="tile"><span className="small">Inversión total</span><b>{musd(costos.totalCapital[1])}</b><span className="small muted">rango {musd(costos.totalCapital[0])} a {musd(costos.totalCapital[2])}</span></div>
          <div className="tile"><span className="small">Depende del lugar</span><b>{musd(costos.propio[1])}</b><span className="small muted">rutas, energía, agua, tierra y sobrecosto regional</span></div>
          <div className="tile"><span className="small">Resultado anual (año {b.anual.anio})</span><b className={a >= 0 ? "pos" : "neg"}>{a >= 0 ? "+" : ""}{musd(a)}</b><span className="small muted">{polos ? "producción nueva" : "frente a crecer en el AMBA"}{reg && <>; si vienen de la misma región: {anual(reg) >= 0 ? "+" : ""}{musd(anual(reg))}</>}</span></div>
          <div className="tile"><span className="small">Recupero para el país</span><b>{b.social.recupero !== null ? plazo(b.social.recupero) : "no se recupera"}</b><span className="small muted">de la inversión extra</span></div>
          <div className="tile"><span className="small">Para el Tesoro</span><b className={b.fiscal.van >= 0 ? "pos" : "neg"}>{b.fiscal.van >= 0 ? "+" : ""}{musd(b.fiscal.van)}</b><span className="small muted">pone {musd(b.fiscal.vpCostos)}, recupera {musd(b.fiscal.vpBeneficios)} en impuestos{b.fiscal.recupero !== null ? `; se recupera ${plazo(b.fiscal.recupero)}` : ""} (valor presente)</span></div>
        </section>

        <div className="ficha-cols">
          <section>
            <h3>Plata por mandato</h3>
            <table className="provs">
              <thead><tr><th>Período</th><th className="num">Total</th><th className="num">Pública</th><th className="num">Pública por año</th><th className="num">{polos ? "Empleos" : "Habitantes"}</th></tr></thead>
              <tbody>
                {mand.map((m) => (
                  <tr key={m.nombre}><td>{m.nombre}</td><td className="num">{musd(m.inversion)}</td><td className="num">{musd(m.publica)}</td><td className="num">{((100 * m.publica) / (m.hasta - m.desde + 1) / pbi).toLocaleString("es-AR", { maximumFractionDigits: 2 })} % del PBI</td><td className="num">{n0(m.poblacionAlFinal)}</td></tr>
                ))}
                <tr className="total"><td><b>Total a 30 años</b></td><td className="num"><b>{musd(mand.reduce((x, m) => x + m.inversion, 0))}</b></td><td className="num"><b>{musd(mand.reduce((x, m) => x + m.publica, 0))}</b></td><td /><td className="num"><b>{n0(mand[mand.length - 1].poblacionAlFinal)}</b></td></tr>
              </tbody>
            </table>
            <p className="small muted">Escenario "lo más probable": las obras de conexión en los primeros 5 años y el resto al ritmo en que llega la gente. "Pública" excluye las viviendas y las mudanzas, que pagan los hogares. Montos sin descontar, en dólares de hoy. Los {musd(costos.totalCapital[1])} se completan solo si llega toda la gente.</p>
            <h3>Quién paga</h3>
            <table className="provs">
              <tbody>
                {pagan.map((x) => (
                  <tr key={x.quien}><td><b>{x.quien}</b> <span className="small muted">{x.rubros.join(", ")}</span></td><td className="num">{musd(x.usd)}</td><td className="num">{(100 * x.usd) / costos.totalCapital[1] < 1 ? "< 1" : Math.round((100 * x.usd) / costos.totalCapital[1])} %</td></tr>
                ))}
              </tbody>
            </table>
            <p className="small muted">Responsable principal según competencias habituales (educación y salud son provinciales, rutas y transporte eléctrico nacionales). El reparto real se acuerda en cada convenio.</p>
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
            <h3>Empleo</h3>
            <p className="small">
              {polos
                ? <>El polo sumaría unos <b>{n0(emp.necesarios)} empleos</b> al año {b.anual.anio}.</>
                : <>La población que probablemente llegue necesita unos <b>{n0(emp.necesarios)} puestos de trabajo</b> al año {b.anual.anio}.</>}{" "}
              {emp.publicos > 0 && <>El traslado lleva unos <b>{n0(emp.publicos)} agentes públicos nacionales</b> con su puesto, que con los servicios que demandan sostienen el doble de empleos. </>}
              Hoy hay {n0(emp.existentes)} puestos privados registrados en los departamentos a 50 km
              {emp.sectores.length > 0 && <> (sobre todo {emp.sectores.join(", ").toLowerCase()})</>}
              {Number.isFinite(emp.crecimiento) && <>, que crecieron {emp.crecimiento.toLocaleString("es-AR", { maximumFractionDigits: 1 })} % por año entre 2014 y 2022</>}.
            </p>
            {emp.proyectos.length > 0 && (
              <ul className="small facts">
                {emp.proyectos.map((x) => <li key={x.nombre + x.km}>{x.nombre} <span className="muted">({x.tipo}, a {Math.round(x.km)} km)</span></li>)}
              </ul>
            )}
            {ori.length > 0 && (
              <>
                <h3>De dónde vendría la gente</h3>
                <p className="small">
                  {ori.map((o) => `${o.lugar} ${Math.round(o.pct)} %`).join(" · ")}
                </p>
                <p className="small muted">Estimación orientativa (modelo de gravedad: más gente de los lugares grandes y cercanos). La cuenta de costo-beneficio supone que vienen del AMBA.</p>
              </>
            )}
          </section>
        </div>

        <section>
          <h3>Calendario</h3>
          <div className="gantt" role="table" aria-label="Calendario de hitos">
            <div className="g-row g-head" role="row">
              <span role="columnheader">Año</span>
              {Array.from({ length: 12 }, (_, k) => <span key={k} className={k % 4 === 0 ? "g-mandato" : ""} role="columnheader">{k + 1}</span>)}
            </div>
            {hs.map((h) => (
              <div className="g-row" role="row" key={h.que}>
                <span role="cell">{h.que}</span>
                <span className={`g-bar ${h.tipo}`} style={{ gridColumn: `${h.desde + 1} / ${h.hasta + 2}` }} role="cell" aria-label={`años ${h.desde} a ${h.hasta}`} />
              </div>
            ))}
          </div>
          <p className="small muted">Plazos típicos de obras públicas de esta escala; las líneas marcan el inicio de cada mandato. Normas en azul, obras en celeste, llegada de {polos ? "empresas" : "gente"} en amarillo.</p>
        </section>

        {pol.length > 0 && (
          <section>
            <h3>Quién gana y quién pierde población</h3>
            <p className="small">
              <b>Ganan:</b> {pol.filter((x) => x.delta > 0).map((x) => `${x.lugar} +${n0(x.delta)}`).join(" · ")}.{" "}
              <b>Pierden más:</b> {pol.filter((x) => x.delta < 0).reverse().slice(0, 4).map((x) => `${x.lugar} −${n0(-x.delta)}`).join(" · ")}
              {pol.filter((x) => x.delta < 0).length > 4 && "; el resto, hasta " + n0(-pol.filter((x) => x.delta < 0).reverse()[4].delta) + " cada una"}.
            </p>
            <p className="small muted">
              A 30 años, con la llegada más probable y el origen estimado arriba. Actores: gobernación de {p.site.provincia}, intendencias de los
              municipios del departamento {p.site.departamento} y legisladores de las provincias de origen. La población no cambia sola las bancas: el reparto de
              diputados sigue el Censo de 1980 (Ley 22.847) y la coparticipación usa coeficientes fijos (Ley 23.548).
            </p>
          </section>
        )}

        <section>
          <h3>Qué hace falta para hacerlo</h3>
          <ol className="pasos small">
            {pasos.map((x) => (
              <li key={x.que}><b>{x.que}.</b> {x.norma}. <span className="muted">Quién: {x.quien}.</span>{x.nota && <> {x.nota}</>}</li>
            ))}
          </ol>
        </section>

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
