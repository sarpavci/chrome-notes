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

## Versioning & Releases

This project uses **[release-please](https://github.com/googleapis/release-please)** to automate versioning and GitHub Releases. Everything is driven by commit messages following the [Conventional Commits](https://www.conventionalcommits.org/) spec.

### How it works

1. Merge commits with Conventional Commit messages into `main`.
2. release-please opens (or updates) a **Release PR** that bumps `package.json` `version` and updates `CHANGELOG.md`.
3. Merge the Release PR → release-please creates a **git tag** and a **GitHub Release** automatically.

### Commit type → SemVer bump mapping

| Commit prefix | Example | Bump |
|---|---|---|
| `fix:` | `fix: handle null note body` | **patch** (0.0.X) |
| `feat:` | `feat: add folder support` | **minor** (0.X.0) |
| `feat!:` or any type with `BREAKING CHANGE:` footer | `feat!: remove legacy storage key` | **major** (X.0.0) |
| `chore:`, `docs:`, `refactor:`, `test:`, `style:`, `ci:` | `chore: update deps` | no bump (changelog entry only) |

To force a **major** bump, either append `!` to the type (`feat!:`, `fix!:`) or include a `BREAKING CHANGE: <description>` trailer in the commit body.

### Version source of truth

`package.json` `version` is the **single source of truth**. WXT reads it and writes the value into `manifest.json` automatically during `build` and `zip`. Never hand-edit the `version` field in the manifest.

### Cutting a release (end-to-end)

1. Land all intended commits on `main` using Conventional Commit messages.
2. release-please opens or refreshes the Release PR — review the auto-generated changelog.
3. Merge the Release PR; the tag and GitHub Release are created automatically.
4. The `.zip` artifact attached to the GitHub Release is produced by the `release` CI job and is ready for Chrome Web Store submission.
