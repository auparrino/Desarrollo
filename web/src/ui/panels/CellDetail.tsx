import { cellToLatLng } from "h3-js";
import type { Dataset } from "../../data/load";
import { FACTORS, type Weights } from "../../model/criteria";
import { VARIABLES, fmtVar } from "../variables";

interface Props {
  ds: Dataset;
  i: number;
  score: number;
  robust: number | null;
  reason: string | null;
  factorScores: Record<string, Float32Array>;
  weights: Weights;
  onClose: () => void;
}

export default function CellDetail(p: Props) {
  const d = p.ds.meta.departamentos[p.ds.dep[p.i]];
  const [lat, lng] = cellToLatLng(p.ds.h3[p.i]);
  const groups = [...new Set(VARIABLES.map((v) => v.grupo))];
  return (
    <aside className="detail" aria-label="Ficha de celda">
      <header>
        <div>
          <b>
            {d?.nombre}, {d?.provincia}
          </b>
          <div className="muted small">
            {lat.toFixed(3)}°, {lng.toFixed(3)}° · H3 {p.ds.h3[p.i]}
          </div>
        </div>
        <button className="icon" onClick={p.onClose} aria-label="Cerrar">
          ×
        </button>
      </header>
      {p.reason ? (
        <p className="excl">Excluida por: {p.reason}</p>
      ) : (
        <p>
          Aptitud <b className="big">{p.score.toFixed(3)}</b>
          {p.robust !== null && Number.isFinite(p.robust) && (
            <span className="muted"> · robustez {Math.round(p.robust * 100)} %</span>
          )}
        </p>
      )}
      <table className="factors">
        <thead>
          <tr>
            <th>Factor</th>
            <th>Valor 0–1</th>
            <th>Aporte</th>
          </tr>
        </thead>
        <tbody>
          {FACTORS.filter((f) => f.disponible && (p.weights[f.id] ?? 0) > 0).map((f) => {
            const s = p.factorScores[f.id]?.[p.i];
            return (
              <tr key={f.id}>
                <td>
                  {f.id} {f.nombre}
                </td>
                <td>
                  <span className="bar">
                    <span style={{ width: `${Math.round((s ?? 0) * 100)}%` }} />
                  </span>
                  {Number.isFinite(s) ? s.toFixed(2) : "s/d"}
                </td>
                <td>{Number.isFinite(s) ? ((p.weights[f.id] ?? 0) * s).toFixed(3) : "—"}</td>
              </tr>
            );
          })}
        </tbody>
      </table>
      {groups.map((g) => (
        <details key={g} open={g === "Población"}>
          <summary>{g}</summary>
          <dl>
            {VARIABLES.filter((v) => v.grupo === g).map((v) => (
              <div key={v.id}>
                <dt>{v.nombre}</dt>
                <dd>{fmtVar(v.id, p.ds.col[v.id]?.[p.i])}</dd>
              </div>
            ))}
          </dl>
        </details>
      ))}
    </aside>
  );
}
