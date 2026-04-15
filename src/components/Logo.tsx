interface LogoMarkProps {
  size?: number;
  variant?: 'default' | 'light';
}

export function LogoMark({ size = 32, variant = 'default' }: LogoMarkProps) {
  const darkColor = variant === 'light' ? '#FFFFFF' : '#1A1714';

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 36 36"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-label="TruMate logo"
    >
      {/* Top-left square — coral */}
      <rect x="2" y="2" width="22" height="22" rx="7" fill="#D94F1E" />
      {/* Bottom-right square — dark, overlapping */}
      <rect x="12" y="12" width="22" height="22" rx="7" fill={darkColor} />
      {/* Overlap highlight to make it feel connected */}
      <rect x="12" y="12" width="12" height="12" rx="3" fill="#D94F1E" fillOpacity="0.35" />
      {/* Small white dot in top-left square center */}
      <circle cx="13" cy="13" r="3" fill="white" fillOpacity="0.9" />
      {/* Small white dot in bottom-right square center */}
      <circle cx="23" cy="23" r="3" fill="white" fillOpacity="0.9" />
    </svg>
  );
}

interface LogoProps {
  size?: number;
  variant?: 'default' | 'light';
  className?: string;
}

export default function Logo({ size = 32, variant = 'default', className = '' }: LogoProps) {
  const textColor = variant === 'light' ? 'text-white' : 'text-[#1A1714]';

  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <LogoMark size={size} variant={variant} />
      <span
        className={`font-bold ${textColor}`}
        style={{ fontSize: size * 0.55 }}
      >
        TruMate
      </span>
    </div>
  );
}
