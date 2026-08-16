# BrandPulse Feature Inventory

Design source (internal): BrandPulse brand-analytics SPA specification

## Status Legend
- 💡 **Idea** — Concept only, no design yet
- 🎨 **Designing** — In Figma, work in progress
- ✅ **Ready** — Design is done, ready to spec and build
- 📋 **Spec'd** — Spec written, approved, ready to build
- 🚧 **Building** — Currently in development
- 🔍 **Review** — Built, on preview, ready for review
- 🚀 **Deployed** — Live on production
- 📦 **Archived** — Done, no longer active

## Phase 1 — Visual Rebrand & Content Cleanup (Deployed)

| Feature | Status | Notes |
|---------|--------|-------|
| Navy/Indigo palette (emerald → navy + light theme vars) | 🚀 Deployed | #4B56F2 dark / #3A44D8 light + success green fixed |
| Noto Sans SC + Noto Sans typography (Inter removed) | 🚀 Deployed | CJK fallback chain, 9 Figma wrapper files swept (412 refs) |
| Pulse-wave B brandmark | 🚀 Deployed | SVG tile, wordmark, monogram, `<BrandLogo>` icon/full variants |
| Favicon pack + manifest + metadata | 🚀 Deployed | SVG pack, PWA shortcuts, OG/Twitter, theme-color meta |
| 5-color Recharts palette | 🚀 Deployed | DARK/LIGHT constants + useChartPalette + buildChartConfig |

## Phase 1 — Content Cleanup

| Feature | Status | Notes |
|---------|--------|-------|
| Docs rebrand (legacy naming → BrandPulse in 5 markdown docs) | 🚀 Deployed | README, FEATURES, DEV_WORKFLOW |
| Amrit Yoga references removal | 📋 Spec'd | → fictional Lumina Wellness brand, 25 src files |
| Nike / Apple / FashionNova mock brands | 📋 Spec'd | → Velocity Athletics / Nexora / AUREA Studio |
| Figma image audit (87 assets) | 📋 Spec'd | Replace active refs with SVG gradient tiles, delete unused |

## Phase 2 — Chinese i18n / Auth / Mobile polish

| Feature | Status | Notes |
|---------|--------|-------|
| zh-CN UI layer (side nav, modals, toasts, empty states) | 💡 Idea | next-intl + lazy per-locale dictionaries |
| User auth (email + social) | 💡 Idea | Clerk/Auth.js + profile page integration |
| Mobile UI polish | 💡 Idea | Bottom nav, tap targets ≥48px, offline splash |

## Core Workspace Components (Built)

- App Sidebar (BrandPulse brandmark + responsive collapse)
- Project Dashboard
- Project View (content list / calendar / insights)
- Audit Wizard + Audit Results + Action Hub
- Brand Guidelines Manager (color / font / voice / hashtags / reference links)
- Project Settings Panel (themes, tone, fonts, writer settings)
- Smart Content Creation Modal (Long Form / Short Clip / Highlight Reel / Text to AI Video)
- Content Edit Modal, Content Review
- Calendar View (month grid, drag interactions, filters)
- Writer Profiles View / Resources View / Templates View / Integrations View / Settings / Profile
- Enhanced Dashboard (New Content + New Project CTAs)
- Theme + Topic Manager (two-level hierarchy)
- Recharts ChartContainer + palette helpers

## Future Backlog

| Feature | Status | Notes |
|---------|--------|-------|
| Multi-project workspaces with teams | 💡 Idea | RBAC, shareable audit reports |
| Live brand-pulse streaming dashboard | 💡 Idea | Realtime social pulse + anomaly alerts |
| Chinese copy suggestions & glossary | 💡 Idea | Per-brand zh-CN tone enforcement |
