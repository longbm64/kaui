# Third-Party Notices & Dependency Attribution

KAUI bundles and integrates certain third-party libraries and tools subject to their respective licenses.

## 1. Dart Sass (`sass`)
- Project: https://github.com/sass/dart-sass
- License: MIT License
- Used for compile-time SCSS compilation into production CSS.

## 2. KAUI Icon Set
- All icon SVG sources under `icons/source/kaui/` are authored for KAUI and built into `dist/icons/`; brand references retain their respective trademark ownership.

- `social-zalo` is a KAUI-authored wordmark reference for integration previews; the Zalo name/trademark remains owned by Zalo Corporation.
- The icon registry contains no third-party icon source or CDN dependency.
## 3. Country Flag Assets (`flag-icons`)
- Project: https://github.com/lipis/flag-icons
- License: MIT License
- The 195 `flag-*.svg` sources use the project's 4:3 SVG set. Flag designs remain the national symbols of their respective countries; KAUI only supplies registry/build integration.

## 3. KAUI Core Icon Set
- `icons/source/kaui/` contains the Phase 1 KAUI-owned core registry and per-icon ownership metadata.
- Build with `npm run icons:core:build`; generated files are `dist/icons/kaui-core-sprite.svg`, `kaui-core-icons.css`, and `kaui-core-icons.json`.


## 3. Node.js Test Runner
- Project: https://nodejs.org
- License: MIT License
- Native test execution (`node:test`, `node:assert/strict`).

All other original architecture, tokens, components, documentation, scripts, and release pipelines are Copyright (c) 2026 KAUI Contributors / Dang Long under the terms specified in `LICENSE`, `NON_COMMERCIAL_LICENSE.md`, and `COMMERCIAL_LICENSE.md`.
