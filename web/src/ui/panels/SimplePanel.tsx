import type { Dataset } from "../../data/load";
import { GROUPS } from "../../model/criteria";
import type { Site } from "../../model/sites";
import { LEVEL_LABELS, PRESETS, PRIORITIES, groupScores, verdict, type Level } from "../../model/plain";
import { nearestPlace } from "../plainFacts";

interface Props {
  ds: Dataset;
  levels: Record<string, Level>;
  setLevels: (l: Record<string, Level>) => void;
  preset: string | null;
  setPreset: (id: string) => void;
  tipo: "nueva" | "pueblos";
  setTipo: (t: "nueva" | "pueblos") => void;
  showDhi: boolean;
  setShowDhi: (v: boolean) => void;
  poblacion: number;
  setPoblacion: (n: number) => void;
  sites: Site[];
  agreement: (i: number) => { n: number; total: number };
  fScores: Record<string, Float32Array>;
  localidades?: GeoJSON.FeatureCollection;
  onSelect: (s: Site) => void;
  selected: Site | null;
  aptasPct: number;
  onExpert: () => void;
}

const SIZES = [
  // ejemplos: población 2022 del departamento (Censo INDEC)
  { n: 100_000, label: "100 mil", ej: "como Junín (Bs. As.)" },
  { n: 250_000, label: "250 mil", ej: "como Escobar" },
  { n: 500_000, label: "500 mil", ej: "como Confluencia (Neuquén)" },
  { n: 1_000_000, label: "1 millón", ej: "entre La Plata y Rosario" },
];

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

function Reasons({ fs, i }: { fs: Record<string, Float32Array>; i: number }) {
  const g = groupScores(fs, i);
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
          <span className="step">1</span> ¿Para cuánta gente?
        </h3>
        <div className="chips">
          {SIZES.map((s) => (
            <button key={s.n} className={`chip ${p.poblacion === s.n ? "on" : ""}`} onClick={() => p.setPoblacion(s.n)}>
              <b>{s.label}</b>
              <span className="small muted">{s.ej}</span>
            </button>
          ))}
        </div>
      </section>

      <section>
        <h3>
          <span className="step">2</span> ¿Qué tipo de crecimiento?
        </h3>
        <div className="chips">
          <button className={`chip ${p.tipo === "nueva" ? "on" : ""}`} onClick={() => p.setTipo("nueva")}>
            <b>Una ciudad nueva</b>
            <span className="small muted">en un lugar hoy casi vacío</span>
          </button>
          <button className={`chip ${p.tipo === "pueblos" ? "on" : ""}`} onClick={() => p.setTipo("pueblos")}>
            <b>Hacer crecer pueblos</b>
            <span className="small muted">a menos de 30 km de uno existente, como propone el Plan DHI</span>
          </button>
        </div>
      </section>

      <section>
        <h3>
          <span className="step">3</span> ¿Qué es más importante?
        </h3>
        <p className="muted small">Elegí un enfoque o ajustá cada tema a tu gusto.</p>
        <div className="presets">
          {PRESETS.map((x) => (
            <button key={x.id} className={`preset ${p.preset === x.id ? "on" : ""}`} onClick={() => p.setPreset(x.id)} title={x.desc}>
              {x.nombre}
            </button>
          ))}
        </div>
        {PRIORITIES.map((pr) => (
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
          Después de descartar las zonas sin agua, inundables, sísmicas, protegidas o de montaña, queda apto el{" "}
          {Math.round(p.aptasPct)} % del país. Estas son las zonas con mejor puntaje que además tienen espacio para{" "}
          {p.poblacion.toLocaleString("es-AR")} personas.
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
                    <Reasons fs={p.fScores} i={s.best} />
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
