import { useMemo } from "react";
import { isAMBA } from "../../model/simulator";
import { DIV_RED_BLUE, SEQ_BLUE, gradientCss } from "../colors";

export type DepMetric = "densidad" | "crec_anual" | "pob2022";

export interface DepProps {
  cod_dep: string;
  departamento: string;
  provincia: string;
  pob2010: number | null;
  pob2022: number | null;
  pob2035?: number | null;
  area_km2: number;
  densidad: number | null;
  crec_anual: number | null;
}

interface Props {
  deps: DepProps[];
  metric: DepMetric;
  setMetric: (m: DepMetric) => void;
  selected: DepProps | null;
}

const n0 = (v: number) => v.toLocaleString("es-AR", { maximumFractionDigits: 0 });
const n1 = (v: number) => v.toLocaleString("es-AR", { maximumFractionDigits: 1 });
const n2 = (v: number) => v.toLocaleString("es-AR", { maximumFractionDigits: 2 });

export const METRICS: Record<DepMetric, { nombre: string; legend: string; stops: typeof SEQ_BLUE; ticks: string[] }> = {
  densidad: { nombre: "Densidad 2022 (hab/km², escala log)", legend: "", stops: SEQ_BLUE, ticks: ["≤0,1", "10", "≥1.000"] },
  crec_anual: { nombre: "Crecimiento anual 2010–2022 (%)", legend: "", stops: DIV_RED_BLUE, ticks: ["≤−3 %", "0", "≥+3 %"] },
  pob2022: { nombre: "Población 2022 (escala log)", legend: "", stops: SEQ_BLUE, ticks: ["≤1.000", "30.000", "≥1 M"] },
};

export default function DiagnosticPanel(p: Props) {
  const s = useMemo(() => {
    let t10 = 0, t22 = 0, a10 = 0, a22 = 0, t35 = 0, a35 = 0;
    const prov = new Map<string, { p10: number; p22: number; area: number }>();
    for (const d of p.deps) {
      const x10 = d.pob2010 ?? 0, x22 = d.pob2022 ?? 0;
      t10 += x10; t22 += x22; t35 += d.pob2035 ?? 0;
      if (isAMBA(d.cod_dep)) { a10 += x10; a22 += x22; a35 += d.pob2035 ?? 0; }
      const q = prov.get(d.provincia) ?? { p10: 0, p22: 0, area: 0 };
      q.p10 += x10; q.p22 += x22; q.area += d.area_km2;
      prov.set(d.provincia, q);
    }
    const provs = [...prov.entries()].map(([nombre, v]) => ({
      nombre, ...v, crec: (Math.pow(v.p22 / v.p10, 1 / 12) - 1) * 100,
    })).sort((a, b) => b.p22 - a.p22);
    const growth = p.deps
      .filter((d) => (d.pob2022 ?? 0) >= 20000 && d.crec_anual !== null)
      .sort((a, b) => b.crec_anual! - a.crec_anual!);
    return { t10, t22, a10, a22, t35, a35, provs, growth };
  }, [p.deps]);
  const m = METRICS[p.metric];
  const maxP = Math.max(...s.provs.map((x) => x.p22));
  return (
    <div className="panel">
      <section>
        <h3>Diagnóstico poblacional</h3>
        <div className="tiles">
          <div className="tile">
            <span className="muted small">Población 2022*</span>
            <b>{n1(s.t22 / 1e6)} M</b>
            <span className="muted small">2010: {n1(s.t10 / 1e6)} M</span>
          </div>
          <div className="tile">
            <span className="muted small">AMBA (CABA + 24 partidos)</span>
            <b>{n1((100 * s.a22) / s.t22)} %</b>
            <span className="muted small">2010: {n1((100 * s.a10) / s.t10)} %{s.t35 > 0 && ` · 2035 (INDEC): ${n1((100 * s.a35) / s.t35)} %`}</span>
          </div>
          <div className="tile">
            <span className="muted small">Crec. anual país</span>
            <b>{n2((Math.pow(s.t22 / s.t10, 1 / 12) - 1) * 100)} %</b>
            <span className="muted small">AMBA: {n2((Math.pow(s.a22 / s.a10, 1 / 12) - 1) * 100)} %</span>
          </div>
        </div>
        <p className="muted small">
          *Censo 2022: población en viviendas particulares por radio censal (excluye viviendas colectivas y situación de calle,
          ≈1 % del total). 2010: población total. Las tasas están levemente sesgadas a la baja.
        </p>
      </section>
      <section>
        <h3>Mapa por departamento</h3>
        <select value={p.metric} onChange={(e) => p.setMetric(e.target.value as DepMetric)}>
          {(Object.keys(METRICS) as DepMetric[]).map((k) => (
            <option key={k} value={k}>
              {METRICS[k].nombre}
            </option>
          ))}
        </select>
        <div className="legend-inline">
          <div className="ramp" style={{ background: gradientCss(m.stops) }} />
          <div className="ticks small muted">
            {m.ticks.map((t) => (
              <span key={t}>{t}</span>
            ))}
          </div>
        </div>
        {p.selected && (
          <div className="card">
            <b>
              {p.selected.departamento}, {p.selected.provincia}
            </b>
            <dl>
              <div><dt>Población 2010</dt><dd>{n0(p.selected.pob2010 ?? NaN)}</dd></div>
              <div><dt>Población 2022</dt><dd>{n0(p.selected.pob2022 ?? NaN)}</dd></div>
              <div><dt>Crecimiento anual</dt><dd>{n2(p.selected.crec_anual ?? NaN)} %</dd></div>
              <div><dt>Superficie</dt><dd>{n0(p.selected.area_km2)} km²</dd></div>
              <div><dt>Densidad</dt><dd>{n1(p.selected.densidad ?? NaN)} hab/km²</dd></div>
            </dl>
          </div>
        )}
      </section>
      <section>
        <h3>Provincias</h3>
        <table className="provs">
          <thead>
            <tr><th>Provincia</th><th>Población 2022</th><th>%/año</th></tr>
          </thead>
          <tbody>
            {s.provs.map((x) => (
              <tr key={x.nombre}>
                <td>{x.nombre}</td>
                <td>
                  <span className="hbar"><span style={{ width: `${(100 * x.p22) / maxP}%` }} /></span>
                  {n0(x.p22)}
                </td>
                <td className="num">{n2(x.crec)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>
      <section>
        <h3>Departamentos de mayor crecimiento</h3>
        <p className="muted small">Departamentos con ≥20.000 hab. en 2022.</p>
        <table className="provs">
          <thead>
            <tr><th>Departamento</th><th>2022</th><th>%/año</th></tr>
          </thead>
          <tbody>
            {s.growth.slice(0, 15).map((d) => (
              <tr key={d.cod_dep}>
                <td>{d.departamento} <span className="muted small">{d.provincia}</span></td>
                <td className="num">{n0(d.pob2022!)}</td>
                <td className="num">{n2(d.crec_anual!)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>
    </div>
  );
}
