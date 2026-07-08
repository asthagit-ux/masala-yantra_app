// Reusable AstroLearn Saturn Logo Component
// Matches the exact AstroLearn brand logo from the design specifications:
// - Yellow rounded square background (#FFD700)
// - Black Saturn planet icon (ellipse ring + C-shaped planet outline)
// - The planet's outline does NOT cross the ring (clean yellow space gap at the top-right)
// - The ring passes in front at the top-right, and behind at the bottom-left

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
          Rotate the entire group by -33 degrees to match the diagonal tilt of the Saturn brand.
          Ring: horizontal ellipse rx=38 ry=10.5 centered at (50,50)
          Planet: C-shaped arc with radius r=22.5 centered at (50,50)
          Gap is at the right side (from -60 deg to +60 deg) so the ring passes through cleanly.
        */}
        <g transform="rotate(-33, 50, 50)">
          {/* Layer 1: Full ring (ellipse) drawn behind the planet */}
          <ellipse
            cx="50"
            cy="50"
            rx="38"
            ry="10.5"
            stroke="black"
            strokeWidth="9"
            fill="none"
          />

          {/* Layer 2: Planet body (C-shape) drawn on top */}
          {/* The C-shape arc goes counterclockwise from top-right (61.25, 30.51) to bottom-right (61.25, 69.49) */}
          {/* Its yellow fill (#FFD700) covers the bottom-left part of the ring that is inside the planet */}
          {/* Since it is open on the right, the top-right part of the ring remains fully visible */}
          <path
            d="M 61.25 30.51 A 22.5 22.5 0 1 0 61.25 69.49"
            stroke="black"
            strokeWidth="9"
            fill="#FFD700"
            strokeLinecap="round"
          />
        </g>
      </svg>
    </div>
  );
}
