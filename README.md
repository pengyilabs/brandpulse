# BrandPulse

White-label AI platform for brand audits, competitive pulse analytics, and on-brand multi-channel content generation — built for agencies and modern marketing teams.

## What it does

BrandPulse ingests social signals for any brand, runs a multi-dimensional audit against competitive benchmarks, and turns those insights into calendar-ready content that stays faithful to the brand's guideline kit (colors, fonts, voice, hashtags, topics, reference links).

## Tech Stack

- React 18 + TypeScript
- Vite 6
- Tailwind CSS v4
- Radix UI + shadcn/ui components
- Recharts for data visualization
- next-themes for dark / light mode
- Noto Sans SC + Noto Sans (CJK-friendly typography)

## Getting Started

```bash
npm install
npm run dev
```

The dev server runs at `http://localhost:5173/`.

## Build

```bash
npm run build
```

Output is in `dist/`.

## Deployment

Configured for Netlify:
- **Build command:** `npm run build`
- **Publish directory:** `dist`

## Origin

Designed as a Figma-first SPA. Now iterated independently using TRAE with Figma MCP for design-to-code updates.
