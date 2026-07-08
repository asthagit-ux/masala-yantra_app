// Reusable AstroLearn Saturn Logo Component
// Renders the original high-resolution logo image asset directly to ensure perfect design fidelity.

interface AstroLearnLogoProps {
  size?: number;
  className?: string;
}

export function AstroLearnLogo({ size = 38, className = "" }: AstroLearnLogoProps) {
  return (
    <img
      src="/logo.png"
      alt="AstroLearn Logo"
      width={size}
      height={size}
      className={`rounded-xl object-contain shadow-md border border-black/10 transition-transform duration-200 ${className}`}
      style={{ width: size, height: size }}
    />
  );
}
