// Reusable AstroLearn Saturn Logo Component
// Yellow background box with black Saturn/planet icon
// Ring passes BEHIND the planet on top, IN FRONT on bottom (correct depth)

interface AstroLearnLogoProps {
  size?: number;
  className?: string;
}

export function AstroLearnLogo({ size = 38, className = "" }: AstroLearnLogoProps) {
  const iconSize = Math.round(size * 0.74);
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
          {/* 1. TOP arc of ring — drawn FIRST so planet covers it (ring passes BEHIND) */}
          <path
            d="M 10 50 A 40 10.5 0 0 0 90 50"
            stroke="black"
            strokeWidth="8.5"
            fill="none"
            strokeLinecap="round"
          />
          {/* 2. Planet body — yellow fill masks the ring arc behind it */}
          <circle
            cx="50"
            cy="50"
            r="23"
            stroke="black"
            strokeWidth="8.5"
            fill="#FFD700"
          />
          {/* 3. BOTTOM arc of ring — drawn LAST so it appears IN FRONT of planet */}
          <path
            d="M 90 50 A 40 10.5 0 0 0 10 50"
            stroke="black"
            strokeWidth="8.5"
            fill="none"
            strokeLinecap="round"
          />
        </g>
      </svg>
    </div>
  );
}
