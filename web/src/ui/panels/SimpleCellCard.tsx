import { cellToLatLng } from "h3-js";
import type { Dataset, Incentivos } from "../../data/load";
import { CLASSES, PLAIN_RESTRICTION, PRIORITIES, groupScores, verdict } from "../../model/plain";
import { facts, nearestPlace } from "../plainFacts";

interface Props {
  ds: Dataset;
  i: number;
  clase: number;
  reasonId: string | null;
  fScores: Record<string, Float32Array>;
  weights: Record<string, number>;
  localidades?: GeoJSON.FeatureCollection;
  incentivos?: Incentivos | null;
  onClose: () => void;
}

const MARK = { bien: "✓", regular: "~", mal: "✗" } as const;
const WORD = { bien: "Bien", regular: "Regular", mal: "Mal" } as const;

export default function SimpleCellCard(p: Props) {
  const d = p.ds.meta.departamentos[p.ds.dep[p.i]];
  const [lat, lng] = cellToLatLng(p.ds.h3[p.i]);
  const near = nearestPlace(p.localidades, lng, lat);
  const g = groupScores(p.fScores, p.i, p.weights);
  const cls = CLASSES.find((c) => c.id === p.clase);
  const why = p.reasonId ? PLAIN_RESTRICTION[p.reasonId] : null;
  return (
    <aside className="detail simple-card" aria-label="Detalle de la zona">
      <header>
        <div>
          <b>{near ? `Cerca de ${near.nombre}` : d?.nombre}</b>
          <div className="muted small">
            {d?.nombre}, {d?.provincia}
            {near && near.km > 3 ? ` · a ${Math.round(near.km)} km de ${near.nombre}` : ""}
          </div>
        </div>
        <button className="icon" onClick={p.onClose} aria-label="Cerrar">
          ×
        </button>
      </header>
      {why ? (
        <div className="badge no">
          <b>No apta: {why.corto}.</b> {why.largo}
        </div>
      ) : (
        cls && (
          <div className={`badge c${cls.id}`}>
            <b>{cls.nombre}</b> · {cls.desc}
          </div>
        )
      )}
      {!why && (
        <>
          <h4>Cómo le va en cada tema</h4>
          <ul className="themes">
            {PRIORITIES.filter((x) => Number.isFinite(g[x.grupo])).map((x) => {
              const v = verdict(g[x.grupo]);
              return (
                <li key={x.grupo} className={v}>
                  <span className="mark" aria-hidden>
                    {MARK[v]}
                  </span>
                  <span>
                    {x.icono} {x.titulo}
                  </span>
                  <span className="score">
                    <span className="bar">
                      <span style={{ width: `${Math.round(g[x.grupo] * 100)}%` }} />
                    </span>
                    {WORD[v]} ({Math.round(g[x.grupo] * 10)}/10)
                  </span>
                </li>
              );
            })}
          </ul>
        </>
      )}
      {(() => {
        const ids = p.incentivos?.por_dep[d?.cod ?? ""] ?? [];
        const list = (p.incentivos?.incentivos ?? []).filter((x) => ids.includes(x.id));
        const mun = (p.incentivos?.municipales ?? []).filter((x) => x.cod_dep === d?.cod);
        if (!p.incentivos) return null;
        return (
          <>
            <h4>Incentivos para radicarse aquí</h4>
            {mun.length > 0 && (
              <ul className="incent">
                {mun.map((x) => (
                  <li key={x.id}>
                    <span className={`tag ${x.beneficiario === "empresas" ? "emp" : "pers"}`}>municipal · {x.beneficiario}</span>{" "}
                    <a href={x.fuente_url} target="_blank" rel="noopener">
                      {x.municipio}: {x.nombre_programa}
                    </a>
                    {x.intensidad && <span className="small muted"> · {x.intensidad}</span>}
                    {x.verificado !== "si" && <span className="small muted"> · fuente periodística</span>}
                  </li>
                ))}
              </ul>
            )}
            {list.length === 0 && mun.length === 0 ? (
              <p className="small muted">No se registran incentivos vigentes específicos para este departamento.</p>
            ) : (
              <ul className="incent">
                {list.map((x) => (
                  <li key={x.id}>
                    <span className={`tag ${/hogar|persona|trabajador/i.test(x.beneficiario) ? "pers" : "emp"}`}>
                      {/hogar|persona|trabajador/i.test(x.beneficiario) ? "personas" : "empresas"}
                    </span>{" "}
                    <a href={x.fuente_url} target="_blank" rel="noopener">{x.nombre}</a>
                    {x.intensidad && <span className="small muted"> · {x.intensidad}</span>}
                    {x.vigencia_hasta && <span className="small muted"> · hasta {x.vigencia_hasta}</span>}
                  </li>
                ))}
              </ul>
            )}
          </>
        );
      })()}
      <h4>La zona en datos</h4>
      <ul className="facts">
        {facts(p.ds, p.i).map((f) => (
          <li key={f.texto}>
            <span aria-hidden>{f.icono}</span> {f.texto}
          </li>
        ))}
      </ul>
    </aside>
  );
}
