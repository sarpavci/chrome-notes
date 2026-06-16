# Chrome Notes

A note-taking Chrome extension built with WXT, React 19, Tailwind CSS, and shadcn/ui.

## Development

```bash
npm install
npm run dev        # hot-reload dev server
npm run build      # production build
npm run zip        # package as .zip for store submission
npm test           # run test suite
```

To load the extension locally in Chrome:

1. `npm run build`
2. Open `chrome://extensions` → enable Developer mode
3. Click **Load unpacked** → select `.output/chrome-mv3/`

## Versioning

This project uses [release-please](https://github.com/googleapis/release-please) with [Conventional Commits](https://www.conventionalcommits.org/).

| Commit prefix | SemVer bump |
|---|---|
| `fix:` | patch (0.0.X) |
| `feat:` | minor (0.X.0) |
| `feat!:` / `BREAKING CHANGE:` | major (X.0.0) |
| `chore:`, `docs:`, `refactor:`, etc. | no bump |

## Publishing

### Required GitHub Secrets

Add these to **Settings → Secrets and variables → Actions** in the repository. All values come from the respective store developer consoles — never commit the values themselves.

**Chrome Web Store** (from the [Chrome Web Store Developer Dashboard](https://chrome.google.com/webstore/devconsole)):

| Secret name | Where to find it |
|---|---|
| `CHROME_EXTENSION_ID` | Extension dashboard URL / item ID |
| `CHROME_CLIENT_ID` | Google Cloud OAuth 2.0 client credentials |
| `CHROME_CLIENT_SECRET` | Google Cloud OAuth 2.0 client credentials |
| `CHROME_REFRESH_TOKEN` | OAuth refresh token obtained via the CWS API setup flow |

See **[Retrieving Chrome Web Store API credentials](docs/chrome-web-store-credentials.md)** for a step-by-step guide to obtaining `CHROME_CLIENT_ID`, `CHROME_CLIENT_SECRET`, and `CHROME_REFRESH_TOKEN`.

**Microsoft Edge Add-ons** (from the [Microsoft Partner Center](https://partner.microsoft.com/dashboard/microsoftedge/)):

| Secret name | Where to find it |
|---|---|
| `EDGE_PRODUCT_ID` | Product ID shown in the Edge Add-ons dashboard |
| `EDGE_CLIENT_ID` | API client ID from Partner Center API credentials |
| `EDGE_API_KEY` | API key from Partner Center API credentials |

> **Note on deprecated Edge secret names:** Earlier versions of the workflow used `EDGE_ACCESS_TOKEN_URL`, `EDGE_CLIENT_SECRET`, and `EDGE_PRODUCT_ID` (v1.0 naming). The current workflow uses the v1.1 set above (`EDGE_PRODUCT_ID`, `EDGE_CLIENT_ID`, `EDGE_API_KEY`). If you see the old names referenced anywhere, they are obsolete.

All 7 secrets must be present; the workflow's guard step fails fast with a clear error message listing any that are missing.

### Release ritual

Releases are tag-driven. The `release` workflow triggers on any tag matching `v*`.

With release-please managing versioning, the normal flow is:

1. Land commits on `main` using Conventional Commit messages.
2. release-please opens a Release PR bumping `package.json` and `CHANGELOG.md`.
3. Merge the Release PR — release-please creates the git tag automatically, which triggers the release workflow.

If you need to cut a release manually (e.g. for a hotfix):

```bash
git tag v1.2.3
git push --tags
```

The workflow will build, zip, and submit to both Chrome Web Store and Edge Add-ons.

### Pre-submit dry run

Before the first real submission (or whenever you want to verify secrets without actually publishing), trigger the workflow manually with **dry run** enabled:

1. Go to **Actions → Release → Run workflow**.
2. Set **Dry run** to `true`.
3. Run — the workflow builds, runs the secret guard, then calls `wxt submit --dry-run`, which validates credentials without submitting anything to the stores.

This is the recommended first step after adding secrets to a fresh repository.
