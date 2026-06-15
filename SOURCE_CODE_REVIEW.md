# Source Code Review Instructions

This document describes how to reproduce the extension build from source, for store review purposes (e.g. Firefox AMO submission).

## Environment

- **Node.js:** 20 (LTS)
- **Package manager:** npm

## Steps

```bash
# 1. Install dependencies
npm ci

# 2. Build the extension (production, unpackaged)
npm run build
# Output: .output/chrome-mv3/

# 3. Package as a .zip for store submission
npm run zip
# Output: .output/<name>-<version>-chrome.zip
```

The `zip` command (`wxt zip`) is equivalent to `wxt build` followed by archiving the output directory. Either artifact can be used for source review.

## Notes

- `package.json` `version` is the single source of truth. WXT writes it into `manifest.json` at build time — do not hand-edit the manifest version.
- All build output lands in `.output/` (gitignored).
- Firefox support is deferred; when added, the zip target will be `wxt zip --browser firefox` producing a `.output/<name>-<version>-firefox.zip`.
