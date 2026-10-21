import type { Site, SiteParams } from "../../model/sites";
import type { Dataset } from "../../data/load";
import { fmtVar } from "../variables";

interface Props {
  ds: Dataset;
  sites: Site[];
  params: SiteParams;
  setParams: (p: Partial<SiteParams>) => void;
  onSelect: (s: Site) => void;
  selected: Site | null;
  mc: { kappa: number; samples: number; topFrac: number };
  setMc: (p: Partial<{ kappa: number; samples: number; topFrac: number }>) => void;
  runMc: () => void;
  mcProgress: number | null;
  hasMc: boolean;
}

const n0 = (v: number) => v.toLocaleString("es-AR", { maximumFractionDigits: 0 });
const pct = (v: number) => `${Math.round(v * 100)} %`;

export default function SitesPanel(p: Props) {
  const req = p.params.poblacion / p.params.densidad / 100;
  return (
    <div className="panel">
      <section>
        <h3>Regiones candidatas</h3>
        <p className="muted small">
          Se toman las celdas aptas del {pct(p.params.topFrac)} superior, se agrupan las contiguas y se exige superficie útil
          (descontando pendientes &gt;15 %) ≥ población / densidad (R14). Para {n0(p.params.poblacion)} hab. a{" "}
          {p.params.densidad} hab/ha: <b>{n0(req)} km²</b>.
        </p>
        <div className="grid2">
          <label>
            Población objetivo
            <input type="number" step={50000} value={p.params.poblacion} onChange={(e) => p.setParams({ poblacion: Number(e.target.value) })} />
          </label>
          <label>
            Densidad bruta (hab/ha)
            <input type="number" step={5} value={p.params.densidad} onChange={(e) => p.setParams({ densidad: Number(e.target.value) })} />
          </label>
          <label>
            Fracción superior
            <select value={p.params.topFrac} onChange={(e) => p.setParams({ topFrac: Number(e.target.value) })}>
              {[0.01, 0.02, 0.05, 0.1].map((v) => (
                <option key={v} value={v}>
                  {pct(v)}
                </option>
              ))}
            </select>
          </label>
        </div>
        <p className="muted small">
          Densidad de referencia: 60–90 hab/ha brutos (óptimo de costo de servicios ≈90 hab/ha, Libertun de Duren & Guerrero
          Compeán 2016; Sejong ≈66 hab/ha). Aglomerados argentinos sin AMBA: 39 hab/ha (CIPPEC 2018).
        </p>
      </section>

      <section>
        <h3>Robustez ante los pesos (Monte Carlo)</h3>
        <p className="muted small">
          Pesos muestreados de una Dirichlet(κ·w) alrededor del escenario actual. Resultado: probabilidad de que cada celda
          quede en el {pct(p.mc.topFrac)} superior. κ más chico implica más incertidumbre sobre los pesos.
        </p>
        <div className="grid2">
          <label>
            κ (concentración)
            <input type="number" min={2} step={5} value={p.mc.kappa} onChange={(e) => p.setMc({ kappa: Number(e.target.value) })} />
          </label>
          <label>
            Muestras
            <input type="number" min={100} step={100} value={p.mc.samples} onChange={(e) => p.setMc({ samples: Number(e.target.value) })} />
          </label>
          <label>
            Grupo superior
            <select value={p.mc.topFrac} onChange={(e) => p.setMc({ topFrac: Number(e.target.value) })}>
              {[0.01, 0.05, 0.1].map((v) => (
                <option key={v} value={v}>
                  {pct(v)}
                </option>
              ))}
            </select>
          </label>
        </div>
        <button className="primary" onClick={p.runMc} disabled={p.mcProgress !== null}>
          {p.mcProgress !== null ? `Calculando… ${Math.round(p.mcProgress * 100)} %` : "Calcular robustez"}
        </button>
      </section>

      <section>
        <ol className="sites">
          {p.sites.map((s) => (
            <li key={s.rank}>
              <button className={`site ${p.selected?.rank === s.rank ? "active" : ""}`} onClick={() => p.onSelect(s)}>
                <span className="site-rank">{s.rank}</span>
                <span className="site-body">
                  <b>
                    {s.departamento}, {s.provincia}
                  </b>
                  <span className="muted small">
                    aptitud {s.score.toFixed(3)} · {n0(s.areaKm2)} km² útiles
                    {s.robust !== undefined && ` · robustez ${pct(s.robust)}`}
                    {!s.requisitoOk && " · superficie insuficiente"}
                  </span>
                  <span className="muted small">
                    {fmtVar("t_media", p.ds.col.t_media[s.best])} · {fmtVar("prec", p.ds.col.prec[s.best])} · río{" "}
                    {fmtVar("q_rio25", p.ds.col.q_rio25[s.best])} · {fmtVar("t_ciudad", p.ds.col.t_ciudad[s.best])} a ciudad
                  </span>
                </span>
              </button>
            </li>
          ))}
        </ol>
        {!p.sites.length && <p className="muted">No hay celdas aptas con la configuración actual.</p>}
        {!p.hasMc && p.sites.length > 0 && (
          <p className="muted small">Calculá la robustez para ver qué regiones resisten cambios razonables en los pesos.</p>
        )}
      </section>
    </div>
  );
}
