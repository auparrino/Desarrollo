// Íconos sólidos y planos inspirados en la iconografía de la gráfica pública argentina de mediados
// del siglo XX: sol, espiga, engranaje, columnas, chimenea. Dibujo propio, dos tintas.
import type { PolicyId } from "../../model/policies";

const INK = "var(--azul)";
const SOL = "var(--sol)";

/** Sol de Mayo esquemático: rayos rectos y flamígeros alternados, sin rostro. */
export function SolDeMayo({ size = 40 }: { size?: number }) {
  const rays = Array.from({ length: 32 }, (_, k) => k);
  return (
    <svg width={size} height={size} viewBox="-50 -50 100 100" aria-hidden className="sol">
      {rays.map((k) =>
        k % 2 === 0 ? (
          <polygon key={k} points="0,-47 3,-24 -3,-24" transform={`rotate(${k * 11.25})`} fill={SOL} />
        ) : (
          <path key={k} d="M0 -24 C 4 -30, -4 -34, 0 -42" transform={`rotate(${k * 11.25})`} fill="none" stroke={SOL} strokeWidth="2.4" strokeLinecap="round" />
        ),
      )}
      <circle r="20" fill={SOL} />
    </svg>
  );
}

export function PolicyIcon({ id, size = 30 }: { id: PolicyId; size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 32 32" aria-hidden className="picon">
      {id === "ciudad_nueva" && (
        <g>
          <circle cx="16" cy="14" r="7" fill={SOL} />
          {[...Array(9)].map((_, k) => (
            <rect key={k} x="15.3" y="1" width="1.4" height="5" fill={SOL} transform={`rotate(${-80 + k * 20} 16 14)`} />
          ))}
          <path d="M3 30V18h6v12zM10 30V12h7v18zM18 30V16h5v14zM24 30V20h5v10z" fill={INK} />
        </g>
      )}
      {id === "capital" && (
        <g fill={INK}>
          <path d="M16 3a6 6 0 0 1 6 6H10a6 6 0 0 1 6-6z" />
          <rect x="15.2" y="0.5" width="1.6" height="3" />
          <path d="M4 12h24v2H4z" />
          <path d="M6 15h2.5v11H6zM11 15h2.5v11H11zM18.5 15H21v11h-2.5zM23.5 15H26v11h-2.5z" />
          <path d="M3 27h26v3H3z" />
          <path d="M8 9h16l2 3H6z" fill={SOL} />
        </g>
      )}
      {id === "intermedias" && (
        <g fill={INK}>
          <path d="M3 30V14h7v16zM11 30V7h8v23zM20 30V17h9v13z" />
          <path d="M13 10h1.5v2H13zM16 10h1.5v2H16zM13 14h1.5v2H13zM16 14h1.5v2H16zM13 18h1.5v2H13zM16 18h1.5v2H16z" fill={SOL} />
        </g>
      )}
      {id === "pueblos" && (
        <g>
          <path d="M3 16 12 8l9 8v14H3z" fill={INK} />
          <path d="M9 30v-7h5v7z" fill={SOL} />
          {/* espiga */}
          <path d="M26 30V9" stroke={SOL} strokeWidth="1.6" />
          {[10, 14, 18, 22].map((y) => (
            <g key={y} fill={SOL}>
              <ellipse cx="23.8" cy={y} rx="2.2" ry="1.2" transform={`rotate(-35 23.8 ${y})`} />
              <ellipse cx="28.2" cy={y} rx="2.2" ry="1.2" transform={`rotate(35 28.2 ${y})`} />
            </g>
          ))}
        </g>
      )}
      {id === "polos" && (
        <g>
          <path d="M3 30V17l7 4v-4l7 4v-4l7 4V6h4v24z" fill={INK} />
          {/* engranaje */}
          <g transform="translate(10 9)" fill={SOL}>
            {[...Array(8)].map((_, k) => (
              <rect key={k} x="-1.3" y="-7" width="2.6" height="3" transform={`rotate(${k * 45})`} />
            ))}
            <circle r="4.6" />
            <circle r="1.8" fill="var(--paper)" />
          </g>
        </g>
      )}
    </svg>
  );
}
