import { costBenefit, type CBAInput, type CBAResult, type Escenario } from "../../model/benefits";
import { BENEFIT_PARAMS } from "../../model/benefitParamsData";

const musd = (v: number, signed = true) => {
  const a = Math.abs(v);
  const s = a >= 1e9 ? `${(a / 1e9).toLocaleString("es-AR", { maximumFractionDigits: 1 })} mil millones` : `${Math.round(a / 1e6).toLocaleString("es-AR")} millones`;
  return `${signed && v < 0 ? "−" : signed && v > 0 ? "+" : ""}USD ${s}`;
};
const n0 = (v: number) => Math.round(v).toLocaleString("es-AR");
/** Plazo de recupero en palabras ("en menos de 5 años", "en unos 12 años"). */
export const plazo = (n: number) => (n < 5 ? "en menos de 5 años" : `en unos ${n} años`);

const ESC: { id: Escenario; nombre: string; desc: string }[] = [
  { id: "optimista", nombre: "Si llega toda la gente", desc: "se llena en ~20 años, como Harlow o Brasília" },
  { id: "base", nombre: "Lo más probable", desc: "llega algo más de la mitad en 30 años, como Putrajaya o Sejong" },
  { id: "pesimista", nombre: "Si casi nadie llega", desc: "~12 % en 30 años, como las ciudades nuevas egipcias" },
];

export function runAll(inp: CBAInput): Record<Escenario, CBAResult> {
  return Object.fromEntries(ESC.map((e) => [e.id, costBenefit(inp, BENEFIT_PARAMS, e.id)])) as Record<Escenario, CBAResult>;
}

const inpPolos = (b: CBAResult) => b.anual.polo !== 0;

/** Una frase para la tarjeta del modo simple. */
export function PlainVerdict({ r }: { r: Record<Escenario, CBAResult> }) {
  const b = r.base;
  const anual = b.anual.productividad + b.anual.aglomeracion + b.anual.congestion + b.anual.polo;
  return (
    <span className="small">
      <span className={`dot ${anual >= 0 ? "pos-bg" : "neg-bg"}`} aria-hidden /> Cuando esté funcionando (año {b.anual.anio}, con la gente que probablemente llegue), el país {anual >= 0 ? "gana" : "pierde"}{" "}
      <b>{musd(Math.abs(anual), false)} por año</b> {inpPolos(b) ? "frente a no tener el polo" : "frente a que esa gente viva en el AMBA"}
      {b.social.recupero !== null
        ? `; la inversión extra se paga ${plazo(b.social.recupero)}.`
        : anual > 0
          ? `, pero ${inpPolos(b) ? "los empleos llegan" : "la gente llega"} tan de a poco que la inversión extra no se termina de pagar en ${b.horizonte} años.`
          : "; la inversión extra no se recupera."}
    </span>
  );
}

export default function CostBenefit({ inp }: { inp: CBAInput }) {
  const r = runAll(inp);
  const b = r.base;
  const a = b.anual;
  const anual = a.productividad + a.aglomeracion + a.congestion + a.polo;
  const polos = inp.policy === "polos";
  return (
    <div className="cba">
      <ol className="cuenta">
        <li>
          <b>Se invierten {musd(b.inversionTotal, false)}.</b> La mayor parte (viviendas, escuelas, hospitales, redes) haría
          falta igual si esas personas vivieran en el AMBA. Lo que se agrega por hacerlo acá —rutas, líneas eléctricas,
          acueducto, edificios, mudanzas— es <b>{musd(b.inversionExtra, false)}</b>.
        </li>
        <li>
          <b>Cuando la ciudad funciona</b> (año {a.anio}, con {n0(a.poblacion)} {polos ? "empleos" : "habitantes"}), cada año el país:
          <ul>
            {!polos && (
              <li className={a.productividad >= 0 ? "pos" : "neg"}>
                {a.productividad >= 0 ? "gana" : "pierde"} {musd(Math.abs(a.productividad), false)} porque los salarios y la
                productividad del destino son {a.productividad >= 0 ? "más altos" : "más bajos"} que en el AMBA;
              </li>
            )}
            {!polos && (
              <li className={a.aglomeracion >= 0 ? "pos" : "neg"}>
                {a.aglomeracion >= 0 ? "gana" : "pierde"} {musd(Math.abs(a.aglomeracion), false)} por el efecto de concentración
                (la región que crece se vuelve más productiva; el AMBA, un poco menos);
              </li>
            )}
            {a.congestion > 0 && <li className="pos">ahorra {musd(a.congestion, false)} de congestión en el AMBA;</li>}
            {polos && (
              <li className="pos">
                suma {musd(a.polo, false)} de producción nueva: solo cuenta el {Math.round(b.supuestos.adicionalidad * 100)} % de
                los empleos, porque el resto se habría creado igual en otra región.
              </li>
            )}
          </ul>
          <b className={anual >= 0 ? "pos" : "neg"}>
            Resultado: {anual >= 0 ? "gana" : "pierde"} {musd(Math.abs(anual), false)} por año.
          </b>
        </li>
        <li>
          <b>
            {b.social.recupero !== null
              ? `La inversión extra se paga ${plazo(b.social.recupero)}.`
              : "La inversión extra no se paga en el horizonte de evaluación."}
          </b>{" "}
          Sumando todos los años (valor presente al {Math.round(b.tasa * 100)} % anual, {b.horizonte} años), el saldo es{" "}
          <b className={b.social.van >= 0 ? "pos" : "neg"}>{musd(b.social.van)}</b>.
        </li>
      </ol>
      <table className="provs">
        <thead>
          <tr>
            <th>¿Y si llega más o menos gente?</th>
            <th className="num">Saldo para el país</th>
            <th className="num">Se paga en</th>
          </tr>
        </thead>
        <tbody>
          {ESC.map((e) => (
            <tr key={e.id}>
              <td>
                <b>{e.nombre}</b> <span className="small muted">{e.desc}</span>
              </td>
              <td className={`num ${r[e.id].social.van >= 0 ? "pos" : "neg"}`}>{musd(r[e.id].social.van)}</td>
              <td className="num">{r[e.id].social.recupero !== null ? (r[e.id].social.recupero! < 5 ? "< 5 años" : `~${r[e.id].social.recupero} años`) : "no se paga"}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <p className="small">
        <b>Para el Estado:</b> pone {musd(b.fiscal.vpCostos, false)} extra (en valor presente) y recupera{" "}
        {musd(b.fiscal.vpBeneficios, false)} en impuestos y captura de plusvalía:{" "}
        {b.fiscal.recupero !== null ? `se recupera ${plazo(b.fiscal.recupero)}.` : "no lo recupera."}
      </p>
      <p className="muted small">
        Lo que más mueve la cuenta: cuánto más (o menos) productivo es el destino que el AMBA y cuánta gente llega de verdad.
        Se usa el salario promedio de la zona (50 km a la redonda: {b.supuestos.relDest.toLocaleString("es-AR", { maximumFractionDigits: 2 })} veces
        el promedio nacional; AMBA {b.supuestos.relAmba.toLocaleString("es-AR", { maximumFractionDigits: 2 })}), y solo el{" "}
        {Math.round(b.supuestos.brecha * 100)} % de la diferencia cuenta como ganancia de quien se muda: el resto se explica por
        quién trabaja en cada lugar (por ejemplo, los sueldos petroleros).
        No incluye beneficios difíciles de medir, como la soberanía, la integración territorial o la calidad de vida.
        Parámetros y fuentes: docs/beneficios-parametros.md.
      </p>
    </div>
  );
}
