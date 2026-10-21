import { costBenefit, type CBAResult, type Escenario } from "../../model/benefits";
import { BENEFIT_PARAMS } from "../../model/benefitParamsData";
import type { CBAInput } from "../../model/benefits";

const musd = (v: number) => {
  const a = Math.abs(v);
  const s = a >= 1e9 ? `${(a / 1e9).toLocaleString("es-AR", { maximumFractionDigits: 1 })} mil M` : `${Math.round(a / 1e6).toLocaleString("es-AR")} M`;
  return `${v < 0 ? "−" : ""}USD ${s}`;
};
const ESC: { id: Escenario; nombre: string; desc: string }[] = [
  { id: "optimista", nombre: "Optimista", desc: "se llena en ~20 años (Harlow, Brasília)" },
  { id: "base", nombre: "Base", desc: "55 % de la meta a los 30 años (Putrajaya, Sejong, Milton Keynes)" },
  { id: "pesimista", nombre: "Pesimista", desc: "≈12 % a los 30 años (ciudades nuevas egipcias)" },
];

export function runAll(inp: CBAInput): Record<Escenario, CBAResult> {
  return Object.fromEntries(ESC.map((e) => [e.id, costBenefit(inp, BENEFIT_PARAMS, e.id)])) as Record<Escenario, CBAResult>;
}

/** Resumen en lenguaje llano del escenario base. */
export function PlainVerdict({ r }: { r: Record<Escenario, CBAResult> }) {
  const b = r.base;
  const gana = b.social.van >= 0;
  return (
    <span className="small">
      {gana ? "📈" : "📉"} En el escenario más probable, al país {gana ? "le conviene" : "no le conviene"} ({musd(b.social.van)}
      {" "}frente a crecer en el AMBA)
      {b.fiscal.recupero !== null ? `; el Estado recupera lo que invierte en ~${b.fiscal.recupero} años.` : "; el Estado no recupera lo que invierte."}
    </span>
  );
}

export default function CostBenefit({ inp }: { inp: CBAInput }) {
  const r = runAll(inp);
  const b = r.base;
  return (
    <div className="cba">
      <table className="provs">
        <thead>
          <tr>
            <th>Escenario de llegada de población</th>
            <th className="num">¿Le conviene al país?</th>
            <th className="num">¿Lo recupera el Estado?</th>
          </tr>
        </thead>
        <tbody>
          {ESC.map((e) => (
            <tr key={e.id}>
              <td>
                <b>{e.nombre}</b> <span className="small muted">{e.desc}</span>
              </td>
              <td className={`num ${r[e.id].social.van >= 0 ? "pos" : "neg"}`}>
                {musd(r[e.id].social.van)}
                <div className="small muted">B/C {Number.isFinite(r[e.id].social.bc) ? r[e.id].social.bc.toFixed(2) : "—"}</div>
              </td>
              <td className={`num ${r[e.id].fiscal.van >= 0 ? "pos" : "neg"}`}>
                {r[e.id].fiscal.recupero !== null ? `en ~${r[e.id].fiscal.recupero} años` : "no recupera"}
                <div className="small muted">{musd(r[e.id].fiscal.van)}</div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <details>
        <summary className="small">Detalle del escenario base (valor presente a {Math.round(b.tasa * 100)} % en {b.horizonte} años)</summary>
        <table className="provs">
          <tbody>
            {[...b.social.beneficios, ...b.social.costos.map((c) => ({ ...c, vp: -c.vp }))].map((x) => (
              <tr key={x.id} title={x.nota}>
                <td>{x.nombre} <span className="small muted">· {x.nota}</span></td>
                <td className={`num ${x.vp >= 0 ? "pos" : "neg"}`}>{musd(x.vp)}</td>
              </tr>
            ))}
            <tr className="total"><td><b>Resultado para el país</b></td><td className="num"><b>{musd(b.social.van)}</b></td></tr>
            {[...b.fiscal.beneficios, ...b.fiscal.costos.map((c) => ({ ...c, vp: -c.vp }))].map((x) => (
              <tr key={"f" + x.id} title={x.nota}>
                <td>{x.nombre} <span className="small muted">· {x.nota}</span></td>
                <td className={`num ${x.vp >= 0 ? "pos" : "neg"}`}>{musd(x.vp)}</td>
              </tr>
            ))}
            <tr className="total"><td><b>Resultado para el Estado</b></td><td className="num"><b>{musd(b.fiscal.van)}</b></td></tr>
          </tbody>
        </table>
      </details>
      <p className="muted small">
        La pregunta es si conviene que esta población viva y trabaje acá <b>en lugar de en el AMBA</b>: vivienda, escuelas y
        hospitales se necesitarían igual, así que solo cuentan la infraestructura de conexión, las mudanzas y los edificios
        nuevos. El resultado depende sobre todo de la productividad relativa del destino (medida por salarios) y de cuánta
        gente llegue de verdad: en la experiencia internacional, la mayoría de las ciudades nuevas no alcanza su meta. No
        incluye beneficios difíciles de medir (soberanía, integración territorial, calidad de vida). Parámetros y fuentes en
        docs/beneficios-parametros.md.
      </p>
    </div>
  );
}
