// Cartel de portada inspirado en la gráfica de 1946–1955: fondo amarillo, figura de perfil
// con aerógrafo, banda negra con letras blancas y remate en bermellón. Dibujo propio.

export function Cartel() {
  return (
    <svg viewBox="0 0 300 400" className="cartel" role="img" aria-label="Cartel: trabajador de perfil con el plan territorial">
      <defs>
        <linearGradient id="piel" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#f47a3a" />
          <stop offset="0.55" stopColor="#e5522b" />
          <stop offset="1" stopColor="#9e2b14" />
        </linearGradient>
        <linearGradient id="pelo" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#c4381c" />
          <stop offset="1" stopColor="#6e1c0c" />
        </linearGradient>
        <linearGradient id="camisa" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0" stopColor="#ffffff" />
          <stop offset="0.7" stopColor="#f1f1ec" />
          <stop offset="1" stopColor="#8fb2d8" />
        </linearGradient>
        <linearGradient id="overol" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#3f7fd0" />
          <stop offset="1" stopColor="#1e4f9a" />
        </linearGradient>
        <linearGradient id="plan" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#f3e36a" />
          <stop offset="1" stopColor="#c9b13a" />
        </linearGradient>
      </defs>
      <rect width="300" height="400" fill="#efe337" />
      {/* banda superior */}
      <rect width="300" height="52" fill="#121212" />
      <text x="150" y="36" textAnchor="middle" className="cartel-t1" textLength="268" lengthAdjust="spacingAndGlyphs">ARGENTINA SE PUEBLA</text>
      {/* figura de perfil (mirando a la derecha) */}
      <path d="M78 300 Q70 250 92 228 L150 236 Q188 250 196 300 Z" fill="url(#camisa)" />
      <path d="M40 400 L40 300 Q60 286 92 290 L150 300 L210 294 Q250 300 262 318 L262 400 Z" fill="url(#overol)" />
      <path d="M92 290 L120 320 L150 300 Z M150 300 L178 322 L210 294 Z" fill="#ffffff" />
      <path
        d="M104 236 Q96 200 100 168 Q104 120 148 104 Q196 92 214 132 Q222 150 218 164 L232 188 Q236 196 226 198 L224 210
           Q228 218 220 222 Q224 236 210 240 Q196 244 186 238 L182 262 Q160 272 132 262 Z"
        fill="url(#piel)"
      />
      <path d="M100 170 Q92 108 150 92 Q206 82 220 132 Q190 116 168 126 Q150 134 146 162 Q130 150 118 172 Q108 180 100 170 Z" fill="url(#pelo)" />
      <path d="M190 160 Q200 156 208 162" stroke="#6e1c0c" strokeWidth="3" fill="none" strokeLinecap="round" />
      {/* plan territorial en la mano */}
      <g transform="rotate(-8 214 268)">
        <rect x="170" y="210" width="96" height="118" fill="url(#plan)" stroke="#121212" strokeWidth="2" />
        <text x="218" y="230" textAnchor="middle" className="cartel-plan">PLAN</text>
        <text x="218" y="244" textAnchor="middle" className="cartel-plan" textLength="80" lengthAdjust="spacingAndGlyphs">TERRITORIAL</text>
        <rect x="186" y="252" width="64" height="62" fill="none" stroke="#121212" strokeWidth="1.5" />
        {/* silueta esquemática del país */}
        <path d="M214 256 l10 4 l4 10 l-6 8 l2 10 l-6 8 l-2 10 l-6 6 l-2 -12 l2 -12 l-2 -10 l2 -12 Z" fill="#2a62b8" />
      </g>
      <path d="M160 300 Q176 280 196 286 L206 300 Q190 314 170 312 Z" fill="url(#piel)" />
      {/* leyenda inferior */}
      <text x="150" y="352" textAnchor="middle" className="cartel-t2" textLength="270" lengthAdjust="spacingAndGlyphs">CADA REGIÓN TIENE SU FUTURO</text>
      <rect x="168" y="362" width="118" height="30" fill="#e5522b" />
      <text x="150" y="386" textAnchor="middle" className="cartel-t3" textLength="236" lengthAdjust="spacingAndGlyphs">¡CONSTRÚYALO!</text>
    </svg>
  );
}

/** "Para que ESTO se transforme en ESTO": del campo vacío al pueblo planificado. */
export function Transformacion() {
  return (
    <svg viewBox="0 0 320 170" className="transf" role="img" aria-label="Para que esto (rancho aislado) se transforme en esto (pueblo planificado)">
      <defs>
        <linearGradient id="sepia" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#d9c7a3" />
          <stop offset="1" stopColor="#9c7f55" />
        </linearGradient>
      </defs>
      <rect width="320" height="170" fill="#79c0e6" />
      <path d="M0 170 L0 120 L320 70 L320 170 Z" fill="#121212" />
      {/* antes: rancho aislado */}
      <g>
        <rect x="10" y="10" width="140" height="82" fill="url(#sepia)" stroke="#121212" strokeWidth="2" />
        <path d="M10 70 L150 64 L150 92 L10 92 Z" fill="#8a6c44" />
        <rect x="48" y="50" width="44" height="22" fill="#6e5434" />
        <path d="M42 52 L70 38 L98 52 Z" fill="#4f3b22" />
        <rect x="64" y="58" width="9" height="14" fill="#2b1f10" />
        <line x1="118" y1="72" x2="118" y2="46" stroke="#4f3b22" strokeWidth="2" />
      </g>
      <g transform="translate(118 84) rotate(-14)">
        <polygon points="0,0 70,0 82,12 70,24 0,24" fill="#e5522b" />
        <text x="8" y="10" className="transf-s">PARA QUE</text>
        <text x="8" y="21" className="transf-b">ESTO</text>
      </g>
      {/* después: pueblo planificado (vista isométrica) */}
      <g transform="translate(150 76)">
        <path d="M0 40 L80 0 L160 40 L80 80 Z" fill="#7fbf5a" stroke="#121212" strokeWidth="1.5" />
        <path d="M40 40 L80 20 L120 40 L80 60 Z" fill="#cfe7a8" />
        {[[30, 32], [56, 20], [100, 22], [118, 34], [74, 50]].map(([x, y], k) => (
          <g key={k} transform={`translate(${x} ${y})`}>
            <path d="M0 6 L8 2 L16 6 L16 14 L8 18 L0 14 Z" fill="#f4eedf" stroke="#121212" strokeWidth="0.8" />
            <path d="M0 6 L8 -2 L16 6 L8 2 Z" fill="#e5522b" stroke="#121212" strokeWidth="0.8" />
          </g>
        ))}
        <rect x="136" y="8" width="4" height="20" fill="#121212" />
        <ellipse cx="138" cy="8" rx="7" ry="4" fill="#efe337" stroke="#121212" />
        {[[20, 44], [140, 46], [92, 66]].map(([x, y], k) => (
          <circle key={k} cx={x} cy={y} r="4" fill="#2f7a2a" />
        ))}
      </g>
      <g transform="translate(14 128) rotate(-12)">
        <polygon points="0,0 96,0 108,12 96,24 0,24" fill="#efe337" stroke="#121212" strokeWidth="1.5" />
        <text x="8" y="10" className="transf-s dark">SE TRANSFORME</text>
        <text x="8" y="21" className="transf-b dark">EN ESTO</text>
      </g>
    </svg>
  );
}

/** Bandera ondeante como separador. */
export function Flameo() {
  return (
    <svg viewBox="0 0 400 34" className="flameo" preserveAspectRatio="none" aria-hidden>
      <path d="M0 6 Q100 -4 200 6 T400 6 V12 Q300 2 200 12 T0 12 Z" fill="#79c0e6" />
      <path d="M0 12 Q100 2 200 12 T400 12 V22 Q300 12 200 22 T0 22 Z" fill="#ffffff" />
      <path d="M0 22 Q100 12 200 22 T400 22 V28 Q300 18 200 28 T0 28 Z" fill="#79c0e6" />
    </svg>
  );
}
