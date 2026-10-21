// Modo presentación: mapa a pantalla completa y una lámina con los mejores lugares, para proyectar en una reunión.

import type { Dataset } from "../../data/load";
import { estimateCosts } from "../../model/costs";
import { cbaInput } from "../../model/labor";
import type { Policy } from "../../model/policies";
import type { Site } from "../../model/sites";
import { UNIT_COSTS } from "../../model/unitCostsData";
import { musd } from "../../model/brief";
import { PolicyIcon } from "../art/Icons";
import { plazo, runAll } from "./CostBenefit";
import { siteName, uniqueByPlace } from "./SimplePanel";

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
  const top = uniqueByPlace(p.sites, p.localidades).slice(0, 5);
  const polos = p.policy.id === "polos";
  return (
    <aside className="presenta" aria-label="Presentación">
      <header>
        <PolicyIcon id={p.policy.id} size={38} />
        <div>
          <h2>{p.policy.nombre}</h2>
          <p className="muted">{p.poblacion.toLocaleString("es-AR")} {polos ? "empleos" : "habitantes"} · los cinco mejores lugares</p>
        </div>
      </header>
      <ol>
        {top.map((s, k) => {
          const c = estimateCosts(p.policy.id, p.ds.col, s.best, s.provincia, { poblacion: p.poblacion, densidad: 75 }, UNIT_COSTS);
          const b = runAll(cbaInput(p.ds, p.policy.id, p.poblacion, c, s.best)).base;
          const a = b.anual.productividad + b.anual.aglomeracion + b.anual.congestion + b.anual.polo;
          const nombre = siteName(s, p.localidades);
          return (
            <li key={s.rank}>
              <button onClick={() => p.onSelect(s)}>
                <span className="site-rank">{k + 1}</span>
                <span>
                  <b>{nombre}</b> <span className="muted">{s.provincia}</span>
                  <span className="presenta-num">
                    Inversión {musd(c.totalCapital[1])} · <span className={a >= 0 ? "pos" : "neg"}>{a >= 0 ? "gana" : "pierde"} {musd(Math.abs(a))}/año</span>
                    {b.social.recupero !== null && ` · se paga ${plazo(b.social.recupero)}`}
                  </span>
                </span>
              </button>
              <button className="ficha-btn" onClick={() => p.onFicha(s, nombre)}>Ficha</button>
            </li>
          );
        })}
      </ol>
      <p className="small muted">Frente a que la misma población crezca en el AMBA, con la llegada de gente más probable. Estimación de orden de magnitud.</p>
    </aside>
  );
}
