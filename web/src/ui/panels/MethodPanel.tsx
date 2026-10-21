import { useEffect, useState } from "react";
import { loadJSON } from "../../data/load";

type Fuente = { cita: string; licencia: string; url: string };

const REPO = "https://github.com/auparrino/Desarrollo/blob/HEAD/docs/";

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
            <b>Mejor combinación de prioridades (modo simple):</b> agua, seguridad y clima pesan siempre; el resto de los temas se
            combina de 300 maneras (Dirichlet uniforme) y cada zona se mide por la fracción de combinaciones en las que queda en el 5 %
            superior (análisis de aceptabilidad estocástica, SMAA). En el modo experto hay escenarios E0–E4 y Monte Carlo alrededor de
            los pesos elegidos.
          </li>
          <li>
            <b>Regiones candidatas:</b> se agrupan las celdas contiguas del grupo superior y se exige la superficie mínima
            para la población objetivo.
          </li>
          <li>
            <b>Costos y costo-beneficio:</b> costos paramétricos con coeficiente regional de construcción; beneficios frente a que la
            misma población crezca en el AMBA, con el salario del mercado de trabajo a 50 km y la mitad de la brecha salarial como
            efecto del lugar; lado fiscal e incentivos.
          </li>
          <li>
            <b>Migración:</b> de dónde llegaría la gente según los corredores observados (Censo 2022, CEPAL/CELADE) y las mudanzas
            entre departamentos (RENAPER); perfil de quienes migran.
          </li>
          <li>
            <b>Proceso:</b> simulación año por año de empleo, vivienda, migración y nacimientos para siete estrategias, con Monte Carlo
            sobre los parámetros inciertos, calibrada y probada con recorridos de ciudades que funcionaron.
          </li>
        </ol>
        <p className="small"><b>Documentación</b></p>
        <ul className="small docs-links">
          <li><a href={REPO + "metodologia.md"} target="_blank" rel="noopener">metodología</a></li>
          <li><a href={REPO + "revision-bibliografica.md"} target="_blank" rel="noopener">revisión bibliográfica</a></li>
          <li><a href={REPO + "mejor-combinacion.md"} target="_blank" rel="noopener">mejor combinación de prioridades</a></li>
          <li><a href={REPO + "costos-unitarios.md"} target="_blank" rel="noopener">costos unitarios</a></li>
          <li><a href={REPO + "costo-construccion-regional.md"} target="_blank" rel="noopener">costo regional de construcción</a></li>
          <li><a href={REPO + "beneficios-parametros.md"} target="_blank" rel="noopener">costo-beneficio</a></li>
          <li><a href={REPO + "migracion-interna.md"} target="_blank" rel="noopener">migración interna</a></li>
          <li><a href={REPO + "simulaciones-procesos.md"} target="_blank" rel="noopener">simulaciones de proceso</a></li>
          <li><a href={REPO + "casos-concretos.md"} target="_blank" rel="noopener">casos concretos por instrumento</a></li>
          <li><a href={REPO + "recorridos-exitosos.md"} target="_blank" rel="noopener">recorridos de ciudades que funcionaron</a></li>
          <li><a href={REPO + "backtest-trayectorias.md"} target="_blank" rel="noopener">prueba retrospectiva del modelo</a></li>
          <li><a href={REPO + "trayectorias-argentina.md"} target="_blank" rel="noopener">trayectorias argentinas</a></li>
          <li><a href={REPO + "trayectorias-internacionales.md"} target="_blank" rel="noopener">trayectorias internacionales</a></li>
          <li><a href={REPO + "datos-restricciones.md"} target="_blank" rel="noopener">capas de restricción</a></li>
          <li><a href={REPO + "propiedad-tierra.md"} target="_blank" rel="noopener">propiedad de la tierra</a></li>
          <li><a href={REPO + "incentivos-radicacion.md"} target="_blank" rel="noopener">incentivos a la radicación</a></li>
          <li><a href={REPO + "auditoria-datos.md"} target="_blank" rel="noopener">auditoría de datos</a></li>
          <li><a href={REPO + "casos-internacionales.md"} target="_blank" rel="noopener">políticas territoriales en el mundo</a></li>
        </ul>
      </section>
      <section>
        <h3>Limitaciones conocidas</h3>
        <ul>
          <li>
            La capacidad de uso de suelos (clases I–VIII) no está publicada a escala nacional: se usa el índice de productividad del
            INTA. La tierra fiscal es una estimación con poca cobertura en muchos departamentos.
          </li>
          <li>
            El modelo de proceso es de orden de magnitud: los datos de empleo de los motores en los casos reales son escasos, y hay
            supuestos sin dato argentino directo (empleo de la construcción por vivienda, empleo público local, salida de
            desocupados).
          </li>
          <li>
            La matriz migratoria 2022 no separa el AMBA del resto de Buenos Aires: esa división usa los flujos de 2005–2010.
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
