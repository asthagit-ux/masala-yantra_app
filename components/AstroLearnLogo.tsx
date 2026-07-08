// Reusable AstroLearn Saturn Logo Component
// Renders the original cropped square logo icon asset to ensure perfect design fidelity.

interface AstroLearnLogoProps {
  size?: number;
  className?: string;
}

export function AstroLearnLogo({ size = 38, className = "" }: AstroLearnLogoProps) {
  return (
    <img
      src="/logo-icon.png"
      alt="AstroLearn Logo"
      width={size}
      height={size}
      className={`object-contain transition-transform duration-200 ${className}`}
      style={{ width: size, height: size }}
    />
  );
}
