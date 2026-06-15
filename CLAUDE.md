# Chrome Notes — Project Guide

## Stack
- **WXT 0.20** — Chrome extension framework (MV3)
- **React 19** + TypeScript
- **Tailwind CSS 3** + **shadcn/ui** (CSS variables approach, `default` style)
- **clsx** + **tailwind-merge** via `@/lib/utils` `cn()` helper

## Key commands

```bash
npm run dev      # wxt — hot-reload dev server (loads from .output/chrome-mv3)
npm run build    # wxt build — production build
npm run zip      # wxt zip — packages extension as .zip for Chrome Web Store
```

## Load extension in Chrome (load-unpacked)
1. `npm run build`
2. Open `chrome://extensions` → enable Developer mode
3. Click **Load unpacked** → select `.output/chrome-mv3/`

## Structure
```
entrypoints/
  sidepanel/     — side panel (full-height, flexible-width)
    index.html
    main.tsx
    App.tsx
    style.css    — Tailwind + shadcn CSS variable base + Linear tokens
  background.ts  — service worker; sets openPanelOnActionClick on install
components/
  ui/            — shadcn/ui components (add with `npx shadcn@latest add <component>`)
lib/
  utils.ts       — cn() helper
```

## shadcn/ui
Config is in `components.json`. Add components:
```bash
npx shadcn@latest add button
```
CSS variables are defined in `entrypoints/sidepanel/style.css`.

## Path aliases
`@/` maps to the repo root (e.g. `@/components/ui/button`).

## Manifest
MV3, permissions: `["storage", "sidePanel"]`. Toolbar click opens the side panel via `openPanelOnActionClick`. No `default_popup`.
