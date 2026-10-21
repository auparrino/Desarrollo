import Recorridos, { RecorridosLista } from "./Recorridos";
import { RECORRIDOS } from "../../model/recorridos";
import bt from "../../model/backtest.json";
import { useState } from "react";
import data from "../../model/casos.json";
import { POLICIES, type PolicyId } from "../../model/policies";

export interface Caso {
  id: string;
  pais: string;
  programa: string;
  periodo: string;
  instrumento_app: PolicyId[];
  tipo_instrumento: string;
  costo: string;
  resultado: string;
  evidencia: "E" | "O" | "A";
  leccion: string;
  lat?: number;
  lon?: number;
  fuente: string;
}
export const CASOS = data as unknown as Caso[];

const EV: Record<string, string> = { E: "evidencia causal", O: "datos oficiales", A: "fuente secundaria" };
const ORDER = { E: 0, O: 1, A: 2 };

function Item({ c, full }: { c: Caso; full?: boolean }) {
  const url = c.fuente.match(/https?:\/\/\S+|doi:\S+/)?.[0];
  return (
    <li className="caso">
      <div className="caso-h">
        <b>{c.pais}</b> · {c.programa} <span className="muted small">({c.periodo})</span>
        <span className={`tag ev-${c.evidencia}`}>{EV[c.evidencia]}</span>
      </div>
      <p className="small">{c.leccion}</p>
      {full && (
        <>
          <p className="small muted"><b>Instrumento:</b> {c.tipo_instrumento}. <b>Resultado:</b> {c.resultado}</p>
          {c.costo && <p className="small muted"><b>Costo:</b> {c.costo}</p>}
          <p className="small muted">
            Fuente:{" "}
            {url ? (
              <a href={url.startsWith("doi:") ? `https://doi.org/${url.slice(4)}` : url} target="_blank" rel="noopener">{c.fuente}</a>
            ) : (
              c.fuente
            )}
          </p>
        </>
      )}
    </li>
  );
}

/** Casos internacionales relacionados con un instrumento (modo simple). */
export function CasosPolitica({ policy, max = 4 }: { policy: PolicyId; max?: number }) {
  const [open, setOpen] = useState(false);
  const list = CASOS.filter((c) => c.instrumento_app.includes(policy)).sort((a, b) => ORDER[a.evidencia] - ORDER[b.evidencia]);
  if (!list.length) return null;
  return (
    <div className="casos">
      <b className="small">Casos del mundo</b>
      <ul>
        {(open ? list : list.slice(0, max)).map((c) => (
          <Item key={c.id} c={c} full={open} />
        ))}
      </ul>
      {list.length > max && (
        <button className="link small" onClick={() => setOpen((o) => !o)}>
          {open ? "Ver menos" : `Ver los ${list.length} casos con resultados y fuentes`}
        </button>
      )}
    </div>
  );
}

/** Pestaña completa del modo experto. */
const BACKTEST = (bt as { casos: { id: string; nombre: string; tieneMotor: boolean; errorCiego: number; errorCalibrado: number }[] }).casos;

export default function CasosPanel() {
  const [f, setF] = useState<PolicyId | "todos">("todos");
  const list = CASOS.filter((c) => f === "todos" || c.instrumento_app.includes(f)).sort(
    (a, b) => ORDER[a.evidencia] - ORDER[b.evidencia] || a.pais.localeCompare(b.pais),
  );
  return (
    <div className="panel">
      <section>
        <h3>Casos del mundo</h3>
        <p className="muted small">
          {CASOS.length} políticas de desarrollo territorial y redistribución de población con resultados medidos. Detalle y
          síntesis en docs/casos-internacionales.md.
        </p>
        <select value={f} onChange={(e) => setF(e.target.value as PolicyId | "todos")}>
          <option value="todos">Todos los instrumentos</option>
          {POLICIES.map((p) => (
            <option key={p.id} value={p.id}>{p.nombre}</option>
          ))}
        </select>
        <div className="lecciones">
          <b className="small">Ocho lecciones</b>
          <ol className="small">
            <li>Sin trabajo no hay población: la tierra, la vivienda o el dinero para mudarse no alcanzan solos.</li>
            <li>El ingreso de una región puede crecer sin que la gente se quede (Alemania del Este).</li>
            <li>Las exenciones en zonas chicas mueven empresas de un lugar a otro: hay que contar empleos netos.</li>
            <li>Concentrar en pocos polos con base urbana e industrial rinde más que repartir.</li>
            <li>Trasladar oficinas públicas trae cerca de un empleo privado por cada público, pero muy cerca y sin muchas familias.</li>
            <li>Las rutas pueblan más la frontera que los decretos.</li>
            <li>Una política de pocos años no produce nada; una eterna sin evaluación se vuelve privilegio: continuidad con fecha de revisión.</li>
            <li>Si no se mide desde el inicio, nunca se sabe si funcionó: la mitad de los casos no tiene evaluación.</li>
          </ol>
        </div>
      </section>
      <section>
        <h3>Recorridos de ciudades que funcionaron</h3>
        <p className="muted small">
          Cómo crecieron, desde que se decidieron, {RECORRIDOS.length} ciudades nuevas y polos con datos de censo
          (docs/recorridos-exitosos.md). En el gráfico, los de países ya urbanizados como la Argentina.
        </p>
        <Recorridos />
        <h4>Prueba del modelo de proceso</h4>
        <p className="small">
          Con el empleo que creó el motor en cada caso, el modelo reproduce los censos de Tierra del Fuego, Canberra y Milton Keynes con
          errores de ±30 a ±40 %. Donde casi no hay datos del motor (Neuquén, Sejong, Palmas, las ciudades brasileñas) no se puede
          probar. Con estos casos se recalibró el multiplicador de empleo local: cada empleo del motor sostiene entre 1,6 y 1,9 más.
        </p>
        <table className="provs small">
          <thead><tr><th>Caso</th><th className="num">Error con los parámetros de la app</th><th className="num">Error calibrado</th></tr></thead>
          <tbody>
            {BACKTEST.filter((b) => b.tieneMotor).sort((a, b) => a.errorCalibrado - b.errorCalibrado).map((b) => (
              <tr key={b.id}><td>{b.nombre.split(/[(:]/)[0].trim()}</td><td className="num">{Number.isFinite(b.errorCiego) ? `±${Math.round((Math.exp(b.errorCiego) - 1) * 100)} %` : "s/d"}</td><td className="num">±{Math.round((Math.exp(b.errorCalibrado) - 1) * 100)} %</td></tr>
            ))}
          </tbody>
        </table>
        <h4>Los recorridos, uno por uno</h4>
        <RecorridosLista soloComparables={false} />
      </section>
      <section>
        <ul className="casos-list">
          {list.map((c) => (
            <Item key={c.id} c={c} full />
          ))}
        </ul>
      </section>
    </div>
  );
}
