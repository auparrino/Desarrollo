import type { Dataset } from "../../data/load";
import { GROUPS } from "../../model/criteria";
import type { Site } from "../../model/sites";
import { BUDGET, FIXED_GROUPS, PRESETS, PRIORITIES, groupScores, prefGroups, verdict, type Points } from "../../model/plain";
import { POLICIES, type Policy, type PolicyId } from "../../model/policies";
import { FACTORS } from "../../model/criteria";

const FACTOR_GROUP: Record<string, string> = Object.fromEntries(FACTORS.map((f) => [f.id, f.grupo]));
import { nearestPlace } from "../plainFacts";
import { estimateCosts } from "../../model/costs";
import { Scene } from "../art/Poster";
import { PlainVerdict, runAll } from "./CostBenefit";
import { downloadCSV } from "../../model/share";
import { useState } from "react";
import { UNIT_COSTS } from "../../model/unitCostsData";

interface Props {
  ds: Dataset;
  policy: Policy;
  setPolicy: (id: PolicyId) => void;
  points: Points;
  setPoints: (p: Points) => void;
  preset: string | null;
  setPreset: (id: string) => void;
  showDhi: boolean;
  setShowDhi: (v: boolean) => void;
  poblacion: number;
  setPoblacion: (n: number) => void;
  sites: Site[];
  agreement: (i: number) => { n: number; total: number };
  fScores: Record<string, Float32Array>;
  weights: Record<string, number>;
  localidades?: GeoJSON.FeatureCollection;
  onSelect: (s: Site) => void;
  selected: Site | null;
  aptasPct: number;
  onExpert: () => void;
  shareLink: () => string;
  saved: { nombre: string; sitios: { nombre: string; best: number }[] }[];
  onSave: (sitios: { nombre: string; best: number }[]) => void;
  onClearSaved: () => void;
}

// ejemplos: población 2022 del departamento (Censo INDEC)
const EJEMPLOS: Record<number, string> = {
  1_000: "un pueblo chico",
  5_000: "un pueblo mediano",
  20_000: "una ciudad pequeña",
  50_000: "una ciudad chica",
  100_000: "como Junín (Bs. As.)",
  250_000: "como Escobar",
  500_000: "como Confluencia (Neuquén)",
  1_000_000: "entre La Plata y Rosario",
};
const label = (n: number) => (n >= 1_000_000 ? `${n / 1_000_000} millón` : `${(n / 1000).toLocaleString("es-AR")} mil`);

const GROUP_NAME: Record<string, string> = Object.fromEntries(PRIORITIES.map((p) => [p.grupo, p.titulo]));

export function siteName(s: Site, loc?: GeoJSON.FeatureCollection) {
  const near = nearestPlace(loc, s.center[0], s.center[1]);
  return near ? `Cerca de ${near.nombre}` : s.departamento;
}

/** En modo simple, una tarjeta por lugar: se descartan regiones con el mismo nombre de referencia. */
function uniqueByPlace(sites: Site[], loc?: GeoJSON.FeatureCollection): Site[] {
  const seen = new Set<string>();
  return sites.filter((s) => {
    const k = siteName(s, loc);
    if (seen.has(k)) return false;
    seen.add(k);
    return true;
  });
}

function Reasons({ fs, i, w }: { fs: Record<string, Float32Array>; i: number; w: Record<string, number> }) {
  const g = groupScores(fs, i, w);
  const items = PRIORITIES.map((p) => ({ p, v: g[p.grupo] })).filter((x) => Number.isFinite(x.v));
  const good = items.filter((x) => verdict(x.v) === "bien").sort((a, b) => b.v - a.v).slice(0, 3);
  const bad = items.filter((x) => verdict(x.v) === "mal").sort((a, b) => a.v - b.v).slice(0, 2);
  return (
    <ul className="reasons">
      {good.map((x) => (
        <li key={x.p.grupo} className="good">
          ✓ {x.p.titulo}
        </li>
      ))}
      {bad.map((x) => (
        <li key={x.p.grupo} className="bad">
          ✗ {x.p.titulo}
        </li>
      ))}
    </ul>
  );
}

function Acciones({ p }: { p: Props }) {
  const [msg, setMsg] = useState("");
  const top = uniqueByPlace(p.sites, p.localidades).slice(0, 10);
  const rows = () =>
    top.map((s) => {
      const c = estimateCosts(p.policy.id, p.ds.col, s.best, s.provincia, { poblacion: p.poblacion, densidad: 75 }, UNIT_COSTS);
      const cba = runAll({ policy: p.policy.id, poblacion: p.poblacion, costos: c, c: p.ds.col, i: s.best,
        codProv: p.ds.meta.departamentos[p.ds.dep[s.best]]?.cod.slice(0, 2) ?? "" });
      return {
        puesto: s.rank, lugar: siteName(s, p.localidades), departamento: s.departamento, provincia: s.provincia,
        lon: s.center[0].toFixed(3), lat: s.center[1].toFixed(3), aptitud: s.score.toFixed(3), superficie_km2: Math.round(s.areaKm2),
        costo_central_usd: Math.round(c.totalCapital[1]), costo_bajo_usd: Math.round(c.totalCapital[0]), costo_alto_usd: Math.round(c.totalCapital[2]),
        van_social_base_usd: Math.round(cba.base.social.van), van_fiscal_base_usd: Math.round(cba.base.fiscal.van),
        politica: p.policy.nombre, poblacion_objetivo: p.poblacion,
      };
    });
  return (
    <div className="acciones">
      <button onClick={() => navigator.clipboard?.writeText(p.shareLink()).then(() => setMsg("Enlace copiado"), () => setMsg(p.shareLink()))}>
        🔗 Compartir este escenario
      </button>
      <button onClick={() => downloadCSV(`atlas-${p.policy.id}-${p.poblacion}.csv`, rows())}>⬇ Descargar resultados</button>
      <button onClick={() => { p.onSave(top.slice(0, 5).map((s) => ({ nombre: siteName(s, p.localidades), best: s.best }))); setMsg("Escenario guardado para comparar"); }}>
        ★ Guardar para comparar
      </button>
      {msg && <span className="small muted">{msg}</span>}
    </div>
  );
}

function Comparar({ saved, onClear }: { saved: Props["saved"]; onClear: () => void }) {
  const all = saved.map((x) => new Set(x.sitios.map((s) => s.nombre)));
  const common = [...all[0]].filter((n) => all.every((s) => s.has(n)));
  return (
    <div className="comparar">
      <h4>Comparación de escenarios</h4>
      <div className="cmp-grid" style={{ gridTemplateColumns: `repeat(${saved.length}, 1fr)` }}>
        {saved.map((x, k) => (
          <div key={k}>
            <b className="small">{x.nombre}</b>
            <ol className="small">
              {x.sitios.map((s) => (
                <li key={s.nombre} className={common.includes(s.nombre) ? "comun" : ""}>{s.nombre}</li>
              ))}
            </ol>
          </div>
        ))}
      </div>
      {saved.length > 1 && (
        <p className="small">
          {common.length
            ? `Aparecen en todos los escenarios: ${common.join(", ")}. Son las apuestas más sólidas.`
            : "Ningún lugar se repite entre los escenarios: la elección depende mucho de las prioridades."}
        </p>
      )}
      <button className="link" onClick={onClear}>Borrar comparación</button>
    </div>
  );
}

export default function SimplePanel(p: Props) {
  const prefs = prefGroups(p.policy.weights());
  const spent = prefs.reduce((a, g) => a + (p.points[g] ?? 0), 0);
  const left = BUDGET - spent;
  const base = p.policy.weights();
  const fixed = PRIORITIES.filter(
    (x) => FIXED_GROUPS.includes(x.grupo) && Object.entries(base).some(([id, w]) => w > 0 && FACTOR_GROUP[id] === x.grupo),
  );
  return (
    <div className="panel simple">
      <section className="intro">
        <div className="hero">
          <Scene />
          <div className="hero-banner">¡La Argentina crece en todo su territorio!</div>
        </div>
        <p className="lema"><span>Gobernar es poblar</span></p>
        <h2>¿Dónde puede crecer la Argentina?</h2>
        <p>
          Esta herramienta divide el país en <b>95.000 zonas</b> y las compara según agua, seguridad, clima y conexión,
          para encontrar los mejores lugares donde crear una <b>ciudad nueva</b> o recibir población. Vos decidís qué es más
          importante.
        </p>
      </section>

      <section>
        <h3>
          <span className="step">1</span> ¿Qué política querés evaluar?
        </h3>
        <div className="policies">
          {POLICIES.map((x) => (
            <button key={x.id} className={`policy ${p.policy.id === x.id ? "on" : ""}`} onClick={() => p.setPolicy(x.id)}>
              <span className="picon" aria-hidden>{x.icono}</span>
              <span>
                <b>{x.nombre}</b>
                <span className="small muted">{x.pregunta}</span>
              </span>
            </button>
          ))}
        </div>
        <div className="evidence">
          <b className="small">Qué dice la experiencia internacional y argentina</b>
          <ul className="small">
            {p.policy.evidencia.map((e) => (
              <li key={e}>{e}</li>
            ))}
          </ul>
          {p.policy.plazo && <p className="small muted">⏳ {p.policy.plazo}</p>}
        </div>
      </section>

      <section>
        <h3>
          <span className="step">2</span> ¿{p.policy.id === "polos" ? "Cuántos empleos" : "Cuántas personas"}?
        </h3>
        <div className="chips">
          {p.policy.tamanos.map((n) => (
            <button key={n} className={`chip ${p.poblacion === n ? "on" : ""}`} onClick={() => p.setPoblacion(n)}>
              <b>{label(n)}</b>
              <span className="small muted">{p.policy.id === "polos" ? "puestos de trabajo" : EJEMPLOS[n]}</span>
            </button>
          ))}
        </div>
      </section>

      <section>
        <h3>
          <span className="step">3</span> ¿Qué es más importante?
        </h3>
        <div className="fixed">
          <b className="small">Siempre se exige (no se negocia)</b>
          <ul className="small">
            {fixed.map((x) => (
              <li key={x.grupo}>
                {x.icono} <b>{x.titulo}:</b> {x.pregunta.toLowerCase()}
              </li>
            ))}
            <li>
              🚫 Se descartan siempre las zonas inundables, las de sismicidad muy alta, las áreas protegidas y la alta montaña,
              más los requisitos propios de esta política.
            </li>
          </ul>
        </div>
        <p className="small">
          <b>Repartí {BUDGET} puntos</b> entre el resto de los temas. Lo que le das a uno se lo sacás a otro: así se ve qué
          resignás. {left > 0 ? <span className="left">Te quedan {left} puntos.</span> : <span className="muted">Usaste todos los puntos.</span>}
        </p>
        <div className="presets">
          {PRESETS.map((x) => (
            <button key={x.id} className={`preset ${p.preset === x.id ? "on" : ""}`} onClick={() => p.setPreset(x.id)} title={x.desc}>
              {x.nombre}
            </button>
          ))}
        </div>
        {PRIORITIES.filter((pr) => prefs.includes(pr.grupo)).map((pr) => {
          const v = p.points[pr.grupo] ?? 0;
          return (
            <div key={pr.grupo} className="prio">
              <div className="prio-h">
                <span aria-hidden>{pr.icono}</span> <b>{pr.titulo}</b>
                <span className="muted small"> · {pr.pregunta}</span>
              </div>
              <div className="budget" role="group" aria-label={`Puntos para ${pr.titulo}`}>
                <button aria-label={`Quitar un punto a ${pr.titulo}`} disabled={v <= 0} onClick={() => p.setPoints({ ...p.points, [pr.grupo]: v - 1 })}>−</button>
                <span className="dots" aria-hidden>
                  {Array.from({ length: BUDGET }, (_, k) => (
                    <span key={k} className={k < v ? "on" : ""} />
                  ))}
                </span>
                <b className="pts">{v}</b>
                <button aria-label={`Sumar un punto a ${pr.titulo}`} disabled={left <= 0} onClick={() => p.setPoints({ ...p.points, [pr.grupo]: v + 1 })}>+</button>
              </div>
            </div>
          );
        })}
      </section>

      <section>
        <h3>
          <span className="step">4</span> Los mejores lugares
        </h3>
        <p className="muted small">
          {p.policy.unidad}. Después de aplicar los descartes queda apto el {p.aptasPct.toFixed(1)} % del territorio.
          {p.policy.requiereSuperficie && ` Estas zonas además tienen espacio para ${p.poblacion.toLocaleString("es-AR")} personas.`}
        </p>
        <ol className="cards">
          {uniqueByPlace(p.sites, p.localidades).slice(0, 6).map((s) => {
            const a = p.agreement(s.best);
            return (
              <li key={s.rank}>
                <button className={`card-site ${p.selected?.rank === s.rank ? "active" : ""}`} onClick={() => p.onSelect(s)}>
                  <span className="site-rank">{s.rank}</span>
                  <span className="site-body">
                    <b>{siteName(s, p.localidades)}</b>
                    <span className="muted small">
                      {s.departamento}, {s.provincia}
                    </span>
                    <Reasons fs={p.fScores} i={s.best} w={p.weights} />
                    {(() => {
                      const c = estimateCosts(p.policy.id, p.ds.col, s.best, s.provincia,
                        { poblacion: p.poblacion, densidad: 75 }, UNIT_COSTS);
                      const cba = runAll({ policy: p.policy.id, poblacion: p.poblacion, costos: c, c: p.ds.col, i: s.best,
                        codProv: p.ds.meta.departamentos[p.ds.dep[s.best]]?.cod.slice(0, 2) ?? "" });
                      const f = (v: number) => (v / 1e9).toLocaleString("es-AR", { maximumFractionDigits: 1 });
                      return (
                        <>
                        <PlainVerdict r={cba} />
                        <span className="small">
                          💰 Costo estimado: <b>USD {f(c.totalCapital[1])} mil millones</b>{" "}
                          <span className="muted">
                            ({f(c.totalCapital[0])}–{f(c.totalCapital[2])})
                            {c.pctPBI && ` · ${c.pctPBI[1].toLocaleString("es-AR", { maximumFractionDigits: 2 })} % del PBI`}
                          </span>
                        </span>
                        </>
                      );
                    })()}
                    <span className={`trust t${a.n >= a.total - 1 ? "hi" : a.n >= 2 ? "mid" : "lo"}`}>
                      {a.n === a.total
                        ? "Muy confiable: aparece entre los mejores con todos los enfoques"
                        : `Aparece entre los mejores con ${a.n} de ${a.total} enfoques`}
                    </span>
                  </span>
                </button>
              </li>
            );
          })}
        </ol>
        <Acciones p={p} />
        {p.saved.length > 0 && <Comparar saved={p.saved} onClear={p.onClearSaved} />}
        <label className="check small">
          <input type="checkbox" checked={p.showDhi} onChange={(e) => p.setShowDhi(e.target.checked)} />
          Mostrar en el mapa las zonas y obras que propone el Plan DHI
        </label>
        {!p.sites.length && <p>Con estas prioridades no quedan zonas aptas. Probá con otro enfoque.</p>}
      </section>

      <section className="howto">
        <details>
          <summary>¿Cómo se calcula esto?</summary>
          <ol className="small">
            <li>
              Se juntaron datos oficiales y científicos de todo el país: población del Censo 2022, clima, ríos, terremotos,
              inundaciones, rutas, red eléctrica y áreas protegidas.
            </li>
            <li>Se descartan las zonas donde no conviene construir (sin agua, inundables, en parques, en montaña, etc.).</li>
            <li>
              Cada zona recibe una nota de 0 a 10 en cada tema ({GROUPS.filter((g) => GROUP_NAME[g.id]).map((g) => GROUP_NAME[g.id]).join(", ")}),
              con criterios tomados de estudios especializados.
            </li>
            <li>Las notas se combinan según la importancia que elegiste y se buscan áreas con espacio suficiente.</li>
            <li>
              Para saber si el resultado es confiable, se repite el cálculo con distintos enfoques: un lugar que gana con
              todos es una apuesta más sólida.
            </li>
          </ol>
          <p className="small muted">
            Es una primera aproximación a escala de país: cualquier proyecto real necesita estudios en el terreno.
          </p>
        </details>
        <button className="link" onClick={p.onExpert}>
          Ver modo experto (todos los criterios, pesos y fuentes) →
        </button>
      </section>
    </div>
  );
}
