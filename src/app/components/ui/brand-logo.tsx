import { useTheme } from 'next-themes';
import { clsx } from 'clsx';

type BrandLogoSize = 'sm' | 'md' | 'lg' | number;
type BrandLogoVariant = 'icon' | 'monogram' | 'full';
type BrandLogoTheme = 'auto' | 'dark' | 'light';

export interface BrandLogoProps {
  variant?: BrandLogoVariant;
  size?: BrandLogoSize;
  theme?: BrandLogoTheme;
  className?: string;
  /** When true, wordmark renders in foreground (default); pass false to force white for use on dark surfaces */
  wordmarkForeground?: boolean;
}

const TILE_SIZE_MAP: Record<'sm' | 'md' | 'lg', number> = {
  sm: 20,
  md: 28,
  lg: 36,
};

function resolveSize(size: BrandLogoSize): number {
  if (typeof size === 'number') return size;
  return TILE_SIZE_MAP[size];
}

/** Pulse-wave B monogram — drawn in theme-primary/primary-foreground via CSS variables. */
function PulseWaveBMonogram({
  tileSize,
  showTile,
  force,
}: {
  tileSize: number;
  showTile: boolean;
  force: 'dark' | 'light' | null;
}) {
  // Fixed viewBox 0 0 32 32; scale uniformly.
  const viewBox = '0 0 32 32';
  const tileFill = force === 'light' ? '#3A44D8' : force === 'dark' ? '#4B56F2' : 'var(--primary)';
  const tileFill2 = force === 'light' ? '#7B3CF2' : force === 'dark' ? '#8A4FFF' : 'var(--accent)';
  const letterFill =
    force === 'light' ? '#FFFFFF' : force === 'dark' ? '#FFFFFF' : 'var(--primary-foreground)';
  const pulseStroke =
    force === 'light' ? '#3A44D8' : force === 'dark' ? '#4B56F2' : 'var(--primary)';

  return (
    <svg
      viewBox={viewBox}
      width={tileSize}
      height={tileSize}
      aria-hidden="true"
      className="shrink-0"
    >
      {showTile && (
        <>
          <defs>
            <linearGradient id={`bp-g-${tileSize}-${force ?? 'auto'}`} x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor={tileFill} />
              <stop offset="100%" stopColor={tileFill2} />
            </linearGradient>
          </defs>
          <rect
            x="1"
            y="1"
            width="30"
            height="30"
            rx="7"
            ry="7"
            fill={`url(#bp-g-${tileSize}-${force ?? 'auto'})`}
          />
        </>
      )}
      {/* Letter B — top bowl, bottom bowl, stem */}
      <path d="M9 6.5h8.2a4.8 4.8 0 0 1 0 9.6H9V6.5z" fill={letterFill} />
      <path d="M9 15.9h9.6a4.8 4.8 0 0 1 0 9.6H9V15.9z" fill={letterFill} />
      <rect x="9" y="6.5" width="3.2" height="19" rx="1.2" fill={letterFill} />
      {/* Pulse waveform across the B constriction */}
      <polyline
        points="12.6,17.5 15.1,14.6 17.5,12.0 20.0,15.0 22.4,18.0"
        fill="none"
        stroke={pulseStroke}
        strokeWidth="1.85"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function BrandLogo({
  variant = 'full',
  size = 'md',
  theme = 'auto',
  className,
  wordmarkForeground = true,
}: BrandLogoProps) {
  const { resolvedTheme } = useTheme();
  const tilePx = resolveSize(size);
  const wordmarkSize = Math.max(12, Math.round(tilePx * 0.714)); // matches sidebar ratio
  const force: 'dark' | 'light' | null =
    theme === 'auto' ? (resolvedTheme === 'light' ? 'light' : 'dark') : theme;

  const wordmarkColor = wordmarkForeground
    ? force === 'light'
      ? '#0B0E14'
      : force === 'dark'
        ? '#FAFAFA'
        : 'var(--foreground)'
    : '#FFFFFF';
  const accentWordmark = force === 'light' ? '#3A44D8' : force === 'dark' ? '#4B56F2' : 'var(--primary)';

  if (variant === 'monogram' || variant === 'icon') {
    return (
      <span
        data-slot="brand-logo"
        className={clsx('inline-flex items-center justify-center', className)}
      >
        <PulseWaveBMonogram tileSize={tilePx} showTile={variant === 'icon'} force={force} />
      </span>
    );
  }

  // full = monogram icon tile + "BrandPulse" wordmark
  const gap = Math.max(6, Math.round(tilePx * 0.214));
  return (
    <span
      data-slot="brand-logo"
      className={clsx('inline-flex items-center overflow-hidden', className)}
      style={{ gap }}
      aria-label="BrandPulse"
    >
      <PulseWaveBMonogram tileSize={tilePx} showTile force={force} />
      <svg
        viewBox="0 0 160 36"
        width={Math.round(tilePx * (160 / 28))}
        height={tilePx}
        preserveAspectRatio="xMidYMid meet"
        aria-hidden="true"
      >
        <text
          x="0"
          y="26"
          fontFamily="'Noto Sans SC','Noto Sans',-apple-system,BlinkMacSystemFont,'PingFang SC','Microsoft YaHei','Segoe UI',Roboto,sans-serif"
          fontWeight="700"
          fontSize={wordmarkSize + 4}
          letterSpacing="-0.3"
          fill={wordmarkColor}
        >
          <tspan>Brand</tspan>
          <tspan fill={accentWordmark}>Pulse</tspan>
        </text>
      </svg>
    </span>
  );
}

export default BrandLogo;
