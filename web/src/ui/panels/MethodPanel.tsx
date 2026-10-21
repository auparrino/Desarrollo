import { useEffect, useState } from "react";
import { loadJSON } from "../../data/load";

type Fuente = { cita: string; licencia: string; url: string };

const REPO = "https://github.com/auparrino/Desarrollo/blob/main/docs/";

export default function MethodPanel({ generado }: { generado: string }) {
  const [fuentes, setFuentes] = useState<Record<string, Fuente>>({});
  useEffect(() => {
    loadJSON<Record<string, Fuente>>("fuentes.json").then(setFuentes).catch(() => setFuentes({}));
  }, []);
  return (
    <div className="panel prose">
      <section>
        <h3>Método</h3>
        <ol>
          <li>
            <b>Unidad de análisis:</b> grilla hexagonal H3 de resolución 6 (≈36 km² por celda, ≈95.000 celdas) sobre la
            Argentina continental y Tierra del Fuego. Cada variable proviene de agregar píxeles de ~1 km.
          </li>
          <li>
            <b>Restricciones:</b> se excluyen las celdas que incumplen umbrales de la literatura o de la normativa (áreas
            protegidas, inundación, pendiente, sismicidad, altitud, costa baja, suficiencia hídrica).
          </li>
          <li>
            <b>Factores:</b> cada variable se transforma a una escala de 0 a 1 con funciones de valor de umbrales absolutos,
            no relativos al área de estudio, para que los puntajes sean comparables entre escenarios.
          </li>
          <li>
            <b>Agregación:</b> combinación lineal ponderada o OWA (Yager 1996; Malczewski 2006), con pesos jerárquicos por
            grupo propuestos en la revisión bibliográfica.
          </li>
          <li>
            <b>Incertidumbre:</b> cuatro escenarios obligatorios (E0–E3) y una simulación Monte Carlo de Dirichlet que da la
            probabilidad de cada celda de quedar en el grupo superior.
          </li>
          <li>
            <b>Regiones candidatas:</b> se agrupan las celdas contiguas del grupo superior y se exige la superficie mínima
            para la población objetivo.
          </li>
        </ol>
        <p>
          Documentación completa:{" "}
          <a href={REPO + "metodologia.md"} target="_blank" rel="noopener">
            metodología
          </a>{" "}
          ·{" "}
          <a href={REPO + "revision-bibliografica.md"} target="_blank" rel="noopener">
            revisión bibliográfica (82 referencias verificadas)
          </a>
        </p>
      </section>
      <section>
        <h3>Limitaciones conocidas</h3>
        <ul>
          <li>
            Sin datos nacionales abiertos y homogéneos de arsénico, suelos (INTA), deslizamientos, fallas activas,
            volcanes, OTBN ni glaciares. Los factores correspondientes figuran como "sin datos" y su peso se redistribuye.
          </li>
          <li>
            Un modelo de elevación de 1 km subestima la pendiente local, y el mapa global de inundación del JRC omite
            cuencas chicas y anegamientos por napa.
          </li>
          <li>
            La disponibilidad hídrica es un sustituto (aridez y caudal medio del río cercano), no un balance de cuenca.
          </li>
          <li>
            Los pesos son juicio experto como punto de partida (§7 de la revisión). Deben elicitarse con actores (AHP con
            CR &lt; 0,10) antes de usar los resultados para decidir.
          </li>
          <li>
            El clima es la normal 1970–2000: no incorpora escenarios de cambio climático.
          </li>
          <li>
            El mapa de peligro sísmico GEM tiene licencia no comercial (CC BY-NC-SA).
          </li>
        </ul>
        <p className="muted small">Datos generados el {generado}.</p>
      </section>
      <section>
        <h3>Fuentes</h3>
        <ul className="sources">
          {Object.entries(fuentes).map(([k, f]) => (
            <li key={k}>
              {f.cita} <span className="muted">({f.licencia})</span>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}
