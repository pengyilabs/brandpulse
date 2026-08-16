import { useTheme } from 'next-themes';
import type { ChartConfig } from './chart';

/**
 * BrandPulse 5-color chart palette (Visual Rebrand t100011).
 *
 * Palette semantics:
 *   chart-1 — Navy/Indigo  : primary brand / core series / default
 *   chart-2 — Violet       : accent / contrast secondary
 *   chart-3 — Cyan         : info / tech-vertical series
 *   chart-4 — Amber        : highlight / growth / warning series
 *   chart-5 — Coral-Red    : alert / decline / destructive series
 */

export const CHART_PALETTE_DARK = [
  '#4B56F2', // 1 — primary brand navy-indigo (dark theme)
  '#8A4FFF', // 2 — violet accent
  '#22B1F5', // 3 — bright cyan
  '#F6B440', // 4 — warm amber
  '#EC595F', // 5 — coral red
] as const;

export const CHART_PALETTE_LIGHT = [
  '#3A44D8', // 1 — navy-indigo (light theme denser hue to match white bg)
  '#7B3CF2', // 2 — violet (slightly denser)
  '#1490DB', // 3 — cyan (darker for light bg contrast)
  '#E08E00', // 4 — deep amber
  '#D94A4A', // 5 — deep coral-red
] as const;

export type ChartPaletteKey = 'chart-1' | 'chart-2' | 'chart-3' | 'chart-4' | 'chart-5';

export const CHART_PALETTE_KEYS: ChartPaletteKey[] = [
  'chart-1',
  'chart-2',
  'chart-3',
  'chart-4',
  'chart-5',
];

/** CSS custom property names (already mapped in styles/theme.css @theme inline block). */
export const CHART_PALETTE_CSS_VARS = CHART_PALETTE_KEYS.map(
  (k) => `var(--color-${k})` as const,
);

export interface ChartPaletteSeriesOverride {
  label?: React.ReactNode;
  icon?: React.ComponentType;
}

/**
 * Hook: return the 5-color brand palette for the currently active theme.
 *
 * Falls back to dark palette when theme is unknown (before hydration /
 * next-themes provider resolved).
 */
export function useChartPalette(): readonly string[] {
  const { resolvedTheme } = useTheme();
  return resolvedTheme === 'light' ? CHART_PALETTE_LIGHT : CHART_PALETTE_DARK;
}

/**
 * Build a shadcn/ui <ChartContainer> `ChartConfig` from a list of series keys,
 * assigning each key a theme-aware palette color in a 5-step cycle.
 *
 * @param series Array of series names (data keys) — must match Recharts `dataKey` values.
 * @param overrides Optional per-key overrides (label, icon).
 *
 * @example
 *   const config = buildChartConfig(
 *     ['impressions', 'clicks', 'conversions', 'spend', 'cpm'],
 *     { impressions: { label: 'Impressions' } }
 *   );
 */
export function buildChartConfig<Key extends string>(
  series: readonly Key[],
  overrides: Partial<Record<Key, ChartPaletteSeriesOverride>> = {},
): ChartConfig {
  const config: ChartConfig = {};
  series.forEach((key, index) => {
    const paletteIndex = index % 5;
    const paletteKey = CHART_PALETTE_KEYS[paletteIndex];
    const dark = CHART_PALETTE_DARK[paletteIndex];
    const light = CHART_PALETTE_LIGHT[paletteIndex];
    const extra = overrides[key];
    config[key] = {
      label: extra?.label ?? key,
      icon: extra?.icon,
      theme: { light, dark },
    };
    // Also register short alias `chart-1..5` under same config so consumers
    // can reference palette by semantic name when building Pie/Composed charts.
    if (!config[paletteKey]) {
      config[paletteKey] = { theme: { light, dark } };
    }
  });
  return config;
}

/**
 * Short alias: 1-tuple picker for single-color usage (e.g., `<Bar fill>` inside
 * a config-managed chart that reads from var(--color-chart-2)).
 */
export function pickChartCssVar(index: 0 | 1 | 2 | 3 | 4): `var(--color-chart-${1 | 2 | 3 | 4 | 5})` {
  return `var(--color-chart-${(index + 1) as 1 | 2 | 3 | 4 | 5})`;
}

export default {
  CHART_PALETTE_DARK,
  CHART_PALETTE_LIGHT,
  CHART_PALETTE_KEYS,
  CHART_PALETTE_CSS_VARS,
  useChartPalette,
  buildChartConfig,
  pickChartCssVar,
};
