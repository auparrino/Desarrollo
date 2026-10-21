import type { CostResult, Range } from "../../model/costs";

const musd = (v: number) => {
  if (!Number.isFinite(v)) return "—";
  if (Math.abs(v) >= 1e9) return `${(v / 1e9).toLocaleString("es-AR", { maximumFractionDigits: 1 })} mil M`;
  return `${(v / 1e6).toLocaleString("es-AR", { maximumFractionDigits: 0 })} M`;
};
const rng = (r: Range) => `USD ${musd(r[0])} – ${musd(r[2])}`;

export function CostSummary({ r, poblacionLabel }: { r: CostResult; poblacionLabel: string }) {
  return (
    <div className="tiles">
      <div className="tile">
        <span className="muted small">Inversión total</span>
        <b>USD {musd(r.totalCapital[1])}</b>
        <span className="muted small">{rng(r.totalCapital)}</span>
      </div>
      <div className="tile">
        <span className="muted small">Por {poblacionLabel}</span>
        <b>USD {Math.round(r.porHabitante[1]).toLocaleString("es-AR")}</b>
        <span className="muted small">
          {Math.round(r.porHabitante[0]).toLocaleString("es-AR")} – {Math.round(r.porHabitante[2]).toLocaleString("es-AR")}
        </span>
      </div>
      <div className="tile">
        <span className="muted small">{r.pctPBI ? "Equivale al PBI" : "Costo anual"}</span>
        <b>
          {r.pctPBI
            ? `${r.pctPBI[1].toLocaleString("es-AR", { maximumFractionDigits: 2 })} %`
            : `USD ${musd(r.totalOperacion[1])}`}
        </b>
        <span className="muted small">{r.pctPBI ? `de un año` : "operación y mantenimiento"}</span>
      </div>
    </div>
  );
}

export default function CostBreakdown({
  r,
  poblacionLabel = "habitante",
  fecha,
}: {
  r: CostResult;
  poblacionLabel?: string;
  fecha: string;
}) {
  const missing = [...r.capital, ...r.operacion].filter((l) => l.faltante);
  return (
    <div className="costs">
      <CostSummary r={r} poblacionLabel={poblacionLabel} />
      <div className="table-wrap">
        <table className="provs">
          <thead>
            <tr>
              <th>Rubro</th>
              <th>Cantidad</th>
              <th className="num">Central</th>
              <th className="num">Rango</th>
            </tr>
          </thead>
          <tbody>
            {r.capital.filter((l) => !l.faltante).map((l) => (
              <tr key={l.id} title={l.fuente}>
                <td>{l.rubro}</td>
                <td className="small muted">{l.cantidad}</td>
                <td className="num">{musd(l.usd[1])}</td>
                <td className="num small muted">
                  {musd(l.usd[0])} – {musd(l.usd[2])}
                </td>
              </tr>
            ))}
            <tr className="total">
              <td colSpan={2}>
                <b>Total inversión</b>
              </td>
              <td className="num">
                <b>{musd(r.totalCapital[1])}</b>
              </td>
              <td className="num small">
                {musd(r.totalCapital[0])} – {musd(r.totalCapital[2])}
              </td>
            </tr>
            {r.operacion.filter((l) => !l.faltante).map((l) => (
              <tr key={l.id} title={l.fuente}>
                <td>{l.rubro}</td>
                <td className="small muted">{l.cantidad}</td>
                <td className="num">{musd(l.usd[1])}/año</td>
                <td className="num small muted">
                  {musd(l.usd[0])} – {musd(l.usd[2])}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <p className="muted small">
        Montos en USD de {fecha}. Estimación paramétrica de orden de
        magnitud (±30–50 %): multiplica cantidades derivadas del sitio por costos unitarios argentinos con fuente (pasá el
        cursor sobre cada fila). No incluye el costo financiero, la inflación de obra ni el empleo necesario para sostener la
        población.
        {missing.length > 0 && ` Sin costo unitario verificado (no suman): ${missing.map((m) => m.rubro).join(", ")}.`}
      </p>
    </div>
  );
}
