import type { Dataset } from "../../data/load";
import { GROUPS } from "../../model/criteria";
import type { Site } from "../../model/sites";
import { LEVEL_LABELS, PRESETS, PRIORITIES, groupScores, groupsUsed, verdict, type Level } from "../../model/plain";
import { POLICIES, type Policy, type PolicyId } from "../../model/policies";
import { nearestPlace } from "../plainFacts";
import { estimateCosts } from "../../model/costs";
import { UNIT_COSTS } from "../../model/unitCostsData";

interface Props {
  ds: Dataset;
  policy: Policy;
  setPolicy: (id: PolicyId) => void;
  levels: Record<string, Level>;
  setLevels: (l: Record<string, Level>) => void;
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
    const k = `${siteName(s, loc)}|${s.provincia}`;
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

export default function SimplePanel(p: Props) {
  const used = groupsUsed(p.policy.weights());
  return (
    <div className="panel simple">
      <section className="intro">
        <h2>¿Dónde podría crecer Argentina?</h2>
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
        <p className="muted small">Elegí un enfoque o ajustá cada tema a tu gusto.</p>
        <div className="presets">
          {PRESETS.filter((x) => !x.scenario || p.policy.id === "ciudad_nueva").map((x) => (
            <button key={x.id} className={`preset ${p.preset === x.id ? "on" : ""}`} onClick={() => p.setPreset(x.id)} title={x.desc}>
              {x.nombre}
            </button>
          ))}
        </div>
        {PRIORITIES.filter((pr) => used.has(pr.grupo)).map((pr) => (
          <div key={pr.grupo} className="prio">
            <div className="prio-h">
              <span aria-hidden>{pr.icono}</span> <b>{pr.titulo}</b>
              <span className="muted small"> · {pr.pregunta}</span>
            </div>
            <div className="seg" role="radiogroup" aria-label={pr.titulo}>
              {LEVEL_LABELS.map((lab, k) => (
                <button
                  key={k}
                  role="radio"
                  aria-checked={p.levels[pr.grupo] === k}
                  className={p.levels[pr.grupo] === k ? "on" : ""}
                  onClick={() => p.setLevels({ ...p.levels, [pr.grupo]: k as Level })}
                >
                  {lab}
                </button>
              ))}
            </div>
          </div>
        ))}
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
                      const f = (v: number) => (v / 1e9).toLocaleString("es-AR", { maximumFractionDigits: 1 });
                      return (
                        <span className="small">
                          💰 Costo estimado: <b>USD {f(c.totalCapital[1])} mil millones</b>{" "}
                          <span className="muted">
                            ({f(c.totalCapital[0])}–{f(c.totalCapital[2])})
                            {c.pctPBI && ` · ${c.pctPBI[1].toLocaleString("es-AR", { maximumFractionDigits: 2 })} % del PBI`}
                          </span>
                        </span>
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
