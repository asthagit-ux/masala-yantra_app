// AstroLearn Saturn Logo — exact match to brand logo
//
// DEPTH ORDER (back to front):
//   Layer 1: Full ring ellipse (both arcs) — drawn behind everything
//   Layer 2: Planet circle with YELLOW fill — masks the ring's BOTTOM arc inside planet
//            (makes bottom of ring appear "behind" the planet)
//   Layer 3: TOP arc of ring — REDRAWN in front of planet
//            (ring passes IN FRONT of planet at top — no planet arc visible above the ring)
//
// Result: ring is complete, planet upper portion is HIDDEN behind the ring (yellow space visible),
//         planet lower portion extends below the ring.

interface AstroLearnLogoProps {
  size?: number;
  className?: string;
}

export function AstroLearnLogo({ size = 38, className = "" }: AstroLearnLogoProps) {
  const iconSize = Math.round(size * 0.72);
  return (
    <div
      className={`bg-[#FFD700] rounded-xl flex items-center justify-center shrink-0 shadow-md border border-black/10 transition-transform duration-200 ${className}`}
      style={{ width: size, height: size }}
    >
      <svg
        viewBox="0 0 100 100"
        width={iconSize}
        height={iconSize}
        xmlns="http://www.w3.org/2000/svg"
      >
        <g transform="rotate(-33, 50, 50)">
          {/*
            Ring is a horizontal ellipse: center=(50,50), rx=38, ry=10
            Planet is a circle: center=(50,50), r=21
            
            Top arc:    M 12 50 A 38 10 0 0 0 88 50  (sweep=0 = counterclockwise = goes UPWARD)
            Bottom arc: from (88,50) sweep=0 back to (12,50) = goes DOWNWARD through (50,60)
          */}

          {/* LAYER 1: Full ring — both top + bottom arcs, drawn FIRST (behind) */}
          <path
            d="M 12 50 A 38 10 0 0 0 88 50 A 38 10 0 0 0 12 50 Z"
            stroke="black"
            strokeWidth="9"
            fill="none"
            strokeLinecap="round"
            strokeLinejoin="round"
          />

          {/* LAYER 2: Planet circle — yellow fill hides ring's BOTTOM arc inside planet */}
          {/* This makes the bottom ring arc appear to go BEHIND the planet */}
          <circle
            cx="50"
            cy="50"
            r="21"
            stroke="black"
            strokeWidth="9"
            fill="#FFD700"
          />

          {/* LAYER 3: TOP arc of ring — redrawn on top of planet */}
          {/* Ring passes IN FRONT of the planet's top portion */}
          {/* Planet upper arc is NOT visible (covered by this) — yellow space shows instead */}
          <path
            d="M 12 50 A 38 10 0 0 0 88 50"
            stroke="black"
            strokeWidth="9"
            fill="none"
            strokeLinecap="round"
          />
        </g>
      </svg>
    </div>
  );
}
