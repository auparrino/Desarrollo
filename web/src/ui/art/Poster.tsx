// Ilustraciones planas inspiradas en la gráfica estatal argentina de 1946–1955
// (sol radiante, campo, industria y vivienda). Dibujo propio, sin reproducir obras.

export function SunBurst({ size = 44 }: { size?: number }) {
  const rays = Array.from({ length: 16 }, (_, k) => k * (360 / 16));
  return (
    <svg width={size} height={size} viewBox="-50 -50 100 100" aria-hidden className="sunburst">
      {rays.map((a) => (
        <polygon key={a} points="0,-48 5,-20 -5,-20" transform={`rotate(${a})`} fill="var(--sol)" />
      ))}
      <circle r="19" fill="var(--sol)" />
      <circle r="19" fill="none" stroke="var(--azul)" strokeWidth="2" />
    </svg>
  );
}

/** Escena de portada: sol naciente detrás de campo, fábrica, viviendas y camino. */
export function Scene() {
  const rays = Array.from({ length: 13 }, (_, k) => -90 + (k - 6) * 13);
  return (
    <svg viewBox="0 0 400 170" className="scene" role="img" aria-label="Ilustración: sol naciente sobre campos, fábrica y viviendas">
      <rect width="400" height="170" fill="var(--celeste)" />
      <g transform="translate(200 118)">
        {rays.map((a) => (
          <polygon key={a} points="0,0 -9,-200 9,-200" transform={`rotate(${a + 90})`} fill="var(--paper)" opacity="0.55" />
        ))}
        <circle r="46" fill="var(--sol)" />
      </g>
      {/* campos */}
      <path d="M0 120 Q100 100 200 116 T400 112 V170 H0Z" fill="var(--ocre)" />
      <path d="M0 140 Q120 122 230 138 T400 134 V170 H0Z" fill="var(--verde)" />
      {Array.from({ length: 14 }, (_, k) => (
        <g key={k} transform={`translate(${12 + k * 13} ${150 - (k % 2) * 3})`} stroke="var(--sol)" strokeWidth="2" strokeLinecap="round">
          <line x1="0" y1="14" x2="0" y2="-6" />
          <line x1="0" y1="-2" x2="-4" y2="-7" />
          <line x1="0" y1="-2" x2="4" y2="-7" />
          <line x1="0" y1="4" x2="-4" y2="-1" />
          <line x1="0" y1="4" x2="4" y2="-1" />
        </g>
      ))}
      {/* fábrica */}
      <g fill="var(--azul)">
        <rect x="286" y="84" width="10" height="40" />
        <rect x="304" y="74" width="10" height="50" />
        <path d="M272 124 V100 l18 -10 v10 l18 -10 v10 l18 -10 v10 l18 -10 V124Z" />
      </g>
      <g fill="var(--paper)" opacity="0.8">
        <circle cx="291" cy="76" r="6" />
        <circle cx="297" cy="66" r="8" />
        <circle cx="309" cy="64" r="6" />
        <circle cx="318" cy="54" r="9" />
      </g>
      {/* viviendas */}
      {[0, 1, 2].map((k) => (
        <g key={k} transform={`translate(${44 + k * 34} ${104 - k * 3})`}>
          <rect x="0" y="12" width="26" height="20" fill="var(--paper)" stroke="var(--ink)" strokeWidth="1.5" />
          <path d="M-3 13 L13 0 L29 13Z" fill="var(--rojo)" stroke="var(--ink)" strokeWidth="1.5" />
          <rect x="10" y="21" width="7" height="11" fill="var(--azul)" />
        </g>
      ))}
      {/* camino */}
      <path d="M200 170 L214 128 L222 128 L250 170Z" fill="var(--paper)" opacity="0.9" />
    </svg>
  );
}

/** Pictogramas en serie (estilo isotipo): un ícono = `unit` unidades. */
export function Isotype({ value, unit, kind, label }: { value: number; unit: number; kind: "casa" | "escuela" | "cama"; label: string }) {
  const n = Math.max(0, Math.round(value / unit));
  const shown = Math.min(n, 40);
  const Icon = () =>
    kind === "casa" ? (
      <svg viewBox="0 0 20 20" width="16" height="16" aria-hidden>
        <path d="M2 10 L10 3 L18 10Z" fill="var(--rojo)" />
        <rect x="4" y="10" width="12" height="8" fill="var(--azul)" />
      </svg>
    ) : kind === "escuela" ? (
      <svg viewBox="0 0 20 20" width="16" height="16" aria-hidden>
        <rect x="3" y="8" width="14" height="10" fill="var(--azul)" />
        <path d="M2 8 L10 3 L18 8Z" fill="var(--sol)" />
        <rect x="9" y="1" width="2" height="4" fill="var(--ink)" />
      </svg>
    ) : (
      <svg viewBox="0 0 20 20" width="16" height="16" aria-hidden>
        <rect x="2" y="9" width="16" height="5" fill="var(--azul)" />
        <rect x="2" y="6" width="5" height="4" fill="var(--rojo)" />
        <rect x="2" y="14" width="2" height="4" fill="var(--ink)" />
        <rect x="16" y="14" width="2" height="4" fill="var(--ink)" />
      </svg>
    );
  return (
    <div className="isotype">
      <div className="iso-icons">
        {Array.from({ length: shown }, (_, k) => (
          <Icon key={k} />
        ))}
        {n > shown && <span className="small">+{n - shown}</span>}
      </div>
      <span className="small">
        {label} · cada ícono = {unit.toLocaleString("es-AR")}
      </span>
    </div>
  );
}
