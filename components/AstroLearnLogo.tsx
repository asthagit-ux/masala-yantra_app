// Reusable AstroLearn Saturn Logo Component
// Matches exact AstroLearn brand: yellow rounded square + black Saturn icon
// Uses 3-layer rendering for correct ring depth illusion

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
        {/*
          3-layer depth trick:
          1. Draw TOP arc of ring first  → planet drawn over it → ring appears BEHIND
          2. Draw planet with yellow fill → masks top arc of ring
          3. Draw BOTTOM arc of ring last → appears IN FRONT of planet
          
          Works in a rotated coordinate system (-33 deg tilt)
          Ring: horizontal ellipse rx=38 ry=10 centered at (50,50)
          Planet: circle r=21 centered at (50,50)
        */}
        <g transform="rotate(-33, 50, 50)">
          {/* Layer 1: TOP arc — counterclockwise sweep goes ABOVE center = behind planet */}
          <path
            d="M 12 50 A 38 10 0 0 0 88 50"
            stroke="black"
            strokeWidth="9"
            fill="none"
            strokeLinecap="round"
          />
          {/* Layer 2: Planet body — yellow fill hides layer 1 ring behind it */}
          <circle
            cx="50"
            cy="50"
            r="21"
            stroke="black"
            strokeWidth="9"
            fill="#FFD700"
          />
          {/* Layer 3: BOTTOM arc — clockwise sweep goes BELOW center = in front of planet */}
          <path
            d="M 12 50 A 38 10 0 0 1 88 50"
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
