import { FACTORS, GROUPS, SCENARIOS, effectiveWeights, type Restriction, type Weights } from "../../model/criteria";
import { caudalRequerido, type Aggregation, type WaterParams } from "../../model/mcda";
import { describe, type ValueFn } from "../../model/valueFunctions";

interface Props {
  scenario: string;
  setScenario: (id: string) => void;
  weights: Weights;
  setWeight: (id: string, v: number) => void;
  fns: Record<string, ValueFn>;
  setFn: (id: string, fn: ValueFn) => void;
  restrictions: Restriction[];
  setRestriction: (id: string, patch: Partial<Restriction>) => void;
  water: WaterParams;
  setWater: (patch: Partial<WaterParams>) => void;
  agg: Aggregation;
  setAgg: (a: Aggregation) => void;
  stats: { aptas: number; total: number; excl: { id: string; nombre: string; n: number }[] };
}

const n0 = (v: number) => v.toLocaleString("es-AR", { maximumFractionDigits: 0 });
const n2 = (v: number) => v.toLocaleString("es-AR", { maximumFractionDigits: 2 });

function EvTag({ e }: { e: string[] }) {
  const t: Record<string, string> = { E: "empírica", N: "norma", C: "caso", J: "juicio experto", D: "derivación" };
  return (
    <span className="ev">
      {e.map((x) => (
        <abbr key={x} title={t[x]}>
          {x}
        </abbr>
      ))}
    </span>
  );
}

function FnEditor({ fn, onChange }: { fn: ValueFn; onChange: (f: ValueFn) => void }) {
  const keys = fn.kind === "trapezoid" ? (["a", "b", "c", "d"] as const) : fn.kind === "piecewise" ? [] : (["a", "b"] as const);
  return (
    <div className="fn-edit">
      {keys.map((k) => (
        <label key={k}>
          {k}
          <input
            type="number"
            step="any"
            value={(fn as unknown as Record<string, number>)[k]}
            onChange={(e) => onChange({ ...fn, [k]: Number(e.target.value) } as ValueFn)}
          />
        </label>
      ))}
    </div>
  );
}

export default function CriteriaPanel(p: Props) {
  const eff = effectiveWeights(p.weights);
  const excluded = p.stats.total - p.stats.aptas;
  return (
    <div className="panel">
      <section>
        <h3>Escenario de pesos</h3>
        <select value={p.scenario} onChange={(e) => p.setScenario(e.target.value)}>
          {SCENARIOS.map((s) => (
            <option key={s.id} value={s.id}>
              {s.nombre}
            </option>
          ))}
          <option value="custom">Personalizado</option>
        </select>
        <p className="muted">{SCENARIOS.find((s) => s.id === p.scenario)?.desc ?? "Pesos modificados manualmente."}</p>
        <div className="row">
          <label>
            Agregación{" "}
            <select
              value={p.agg.method}
              onChange={(e) => p.setAgg(e.target.value === "owa" ? { method: "owa", orness: 0.3 } : { method: "wlc" })}
            >
              <option value="wlc">Combinación lineal ponderada (WLC)</option>
              <option value="owa">OWA (riesgo ajustable)</option>
            </select>
          </label>
        </div>
        {p.agg.method === "owa" && (
          <label className="slider">
            <span>
              ORness {n2(p.agg.orness)} —{" "}
              {p.agg.orness < 0.5 ? "pesimista: domina el peor criterio" : p.agg.orness > 0.5 ? "optimista" : "= WLC"}
            </span>
            <input
              type="range" min={0.05} max={0.95} step={0.05} value={p.agg.orness}
              onChange={(e) => p.setAgg({ method: "owa", orness: Number(e.target.value) })}
            />
          </label>
        )}
      </section>

      <section>
        <h3>
          Restricciones <span className="muted small">({n0(p.stats.aptas)} celdas aptas de {n0(p.stats.total)})</span>
        </h3>
        <div className="exclbar" aria-label="Celdas excluidas por restricción">
          {p.stats.excl.filter((x) => x.n > 0).map((x) => (
            <div key={x.id} title={`${x.nombre}: ${n0(x.n)} celdas`} style={{ flex: x.n }} />
          ))}
          <div className="ok" style={{ flex: p.stats.aptas }} title={`Aptas: ${n0(p.stats.aptas)}`} />
        </div>
        <p className="muted small">
          Excluidas {n0(excluded)} ({Math.round((100 * excluded) / p.stats.total)} %). Cada celda se atribuye a la primera
          restricción que incumple.
        </p>
        {p.restrictions.map((r) => {
          const n = p.stats.excl.find((x) => x.id === r.id)?.n ?? 0;
          return (
            <div key={r.id} className={`crit ${r.activo ? "" : "off"}`}>
              <label className="check">
                <input type="checkbox" checked={r.activo} onChange={(e) => p.setRestriction(r.id, { activo: e.target.checked })} />
                <b>{r.id}</b> {r.nombre} <EvTag e={r.evidencia} />
              </label>
              <label className="slider">
                <span>
                  excluir si {r.op === ">=" ? "≥" : r.op} {r.unidad === "fracción" ? `${Math.round(r.umbral * 100)} %` : `${n2(r.umbral)} ${r.unidad}`}
                  {r.activo && <span className="muted"> · {n0(n)} celdas</span>}
                </span>
                <input
                  type="range" min={r.min} max={r.max} step={r.step} value={r.umbral} disabled={!r.activo}
                  onChange={(e) => p.setRestriction(r.id, { umbral: Number(e.target.value) })}
                />
              </label>
              {r.nota && <p className="muted small">{r.nota}</p>}
            </div>
          );
        })}
        <div className={`crit ${p.water.activo ? "" : "off"}`}>
          <label className="check">
            <input type="checkbox" checked={p.water.activo} onChange={(e) => p.setWater({ activo: e.target.checked })} />
            <b>R13</b> Suficiencia hídrica para la población objetivo <EvTag e={["D", "J"]} />
          </label>
          <div className="grid2">
            <label>
              Población objetivo
              <input type="number" step={50000} value={p.water.poblacion} onChange={(e) => p.setWater({ poblacion: Number(e.target.value) })} />
            </label>
            <label>
              Dotación (L/hab/día)
              <input type="number" step={10} value={p.water.dotacion} onChange={(e) => p.setWater({ dotacion: Number(e.target.value) })} />
            </label>
            <label>
              Margen oferta/demanda
              <input type="number" step={0.1} value={p.water.margen} onChange={(e) => p.setWater({ margen: Number(e.target.value) })} />
            </label>
            <label>
              Fracción asignable del caudal
              <input type="number" step={0.05} min={0.01} max={1} value={p.water.fraccionAsignable} onChange={(e) => p.setWater({ fraccionAsignable: Number(e.target.value) })} />
            </label>
          </div>
          <p className="muted small">
            Demanda con margen: <b>{n2(caudalRequerido(p.water))} m³/s</b>. Es apta si un río a ≤25 km aporta esa demanda con
            la fracción asignable de su caudal medio, o si el clima es subhúmedo/húmedo (P/ET0 ≥ {p.water.aridezHumeda}), donde
            se supone oferta local. La dotación de 200 L/hab/día y el margen de 1,5 provienen de la revisión (§R13).
          </p>
        </div>
      </section>

      <section>
        <h3>Factores y pesos</h3>
        <p className="muted small">
          Pesos globales. Los factores sin datos se muestran tachados y su peso se redistribuye proporcionalmente entre el resto.
        </p>
        {GROUPS.map((g) => {
          const fs = FACTORS.filter((f) => f.grupo === g.id);
          const gw = fs.reduce((a, f) => a + (eff[f.id] ?? 0), 0);
          return (
            <div key={g.id} className="group">
              <div className="group-h">
                <span className="swatch" style={{ background: g.color }} />
                {g.nombre}
                <span className="muted"> · {Math.round(gw * 100)} % efectivo</span>
              </div>
              {fs.map((f) => (
                <div key={f.id} className={`crit ${f.disponible ? "" : "nodata"}`}>
                  <div className="crit-h">
                    <b>{f.id}</b> {f.nombre} <EvTag e={f.evidencia} />
                    {!f.disponible && <span className="tag">sin datos</span>}
                  </div>
                  <label className="slider">
                    <span>
                      peso {n2(p.weights[f.id] ?? 0)}
                      {f.disponible && <span className="muted"> · efectivo {Math.round((eff[f.id] ?? 0) * 100)} %</span>}
                    </span>
                    <input
                      type="range" min={0} max={0.4} step={0.01} value={p.weights[f.id] ?? 0} disabled={!f.disponible}
                      onChange={(e) => p.setWeight(f.id, Number(e.target.value))}
                    />
                  </label>
                  <details>
                    <summary className="small">{f.variable}</summary>
                    {(p.fns[f.id] ?? f.fn) && (
                      <>
                        <p className="small">
                          Función de valor: {describe(p.fns[f.id] ?? f.fn!, f.unidad)}
                          {f.score && f.fn ? " (componente editable)" : ""}
                        </p>
                        {f.fn && <FnEditor fn={p.fns[f.id] ?? f.fn} onChange={(fn) => p.setFn(f.id, fn)} />}
                      </>
                    )}
                    {f.nota && <p className="muted small">{f.nota}</p>}
                    <p className="muted small">Ref.: {f.refs.join("; ")}</p>
                  </details>
                </div>
              ))}
            </div>
          );
        })}
      </section>
    </div>
  );
}
