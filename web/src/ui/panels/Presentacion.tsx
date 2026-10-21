// Modo presentación: mapa a pantalla completa y una lámina con los mejores lugares, para proyectar en una reunión.

import { useMemo } from "react";
import type { Dataset } from "../../data/load";
import type { Policy } from "../../model/policies";
import type { Site } from "../../model/sites";
import { musd } from "../../model/brief";
import { PolicyIcon } from "../art/Icons";
import { plazo } from "./CostBenefit";
import { evaluar, ordenar } from "../evaluar";

interface Props {
  ds: Dataset;
  sites: Site[];
  policy: Policy;
  poblacion: number;
  localidades?: GeoJSON.FeatureCollection;
  onSelect: (s: Site) => void;
  onFicha: (s: Site, nombre: string) => void;
}

export default function Presentacion(p: Props) {
  const top = useMemo(
    () => ordenar(evaluar(p.ds, p.sites, p.localidades, p.policy.id, p.poblacion), "ambos").slice(0, 5),
    [p.ds, p.sites, p.localidades, p.policy.id, p.poblacion],
  );
  const polos = p.policy.id === "polos";
  return (
    <aside className="presenta" aria-label="Presentación">
      <header>
        <PolicyIcon id={p.policy.id} size={38} />
        <div>
          <h2>{p.policy.nombre}</h2>
          <p className="muted">{p.poblacion.toLocaleString("es-AR")} {polos ? "empleos" : "habitantes"} de meta · los cinco mejores lugares</p>
        </div>
      </header>
      <ol>
        {top.map((e, k) => {
          const b = e.cba.base;
          return (
            <li key={e.s.rank}>
              <button onClick={() => p.onSelect(e.s)}>
                <span className="site-rank">{k + 1}</span>
                <span>
                  <b>{e.nombre}</b> <span className="muted">{e.s.provincia}</span>
                  <span className="presenta-num">
                    Inversión {musd(e.c.totalCapital[1])} · <span className={e.anual >= 0 ? "pos" : "neg"}>{e.anual >= 0 ? "gana" : "pierde"} {musd(Math.abs(e.anual))}/año</span>
                    {b.social.recupero !== null && ` · se paga ${plazo(b.social.recupero)}`}
                  </span>
                  <span className="presenta-num muted">
                    Con el mejor proceso: {Math.round(e.elegido.pob30[1]).toLocaleString("es-AR")} personas en 30 años
                    {e.parecido ? ` (como ${e.parecido.r.nombre.split(/[(:]/)[0].trim()})` : ""}
                  </span>
                </span>
              </button>
              <button className="ficha-btn" onClick={() => p.onFicha(e.s, e.nombre)}>Ficha</button>
            </li>
          );
        })}
      </ol>
      <p className="small muted">
        Orden combinado: buenos para vivir y convenientes. La cuenta económica es frente a que la misma población crezca en el AMBA;
        las personas en 30 años salen de simular el proceso con los flujos migratorios argentinos.
      </p>
    </aside>
  );
}
