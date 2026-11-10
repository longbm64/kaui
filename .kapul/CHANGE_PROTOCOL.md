
## Railway deployment protocol

- For deployment changes, preserve the static-site contract: no runtime framework or database is required.
- Railway must use `npm run build` and `npm start`; the server must bind `0.0.0.0` and `process.env.PORT`.
- Verify with `node --check server.mjs`, an HTTP smoke test for `/`, `/health`, `/button.html`, and an asset, then run `npm test`, `npm run build`, and `git diff --check`. The public demo is served at `/`; legacy `/demo` paths redirect to root equivalents.
- Verify with `node --check server.mjs`, an HTTP smoke test for `/`, `/health`, `/demo/index.html`, and an asset, then run `npm test`, `npm run build`, and `git diff --check`.
- Never use `serve:tailscale` as the Railway start command because it binds a fixed local port.
- Production release flow: changes merge/push to GitHub branch `release`; Railway GitHub Autodeploy builds `npm run build`, starts `npm start`, checks `/health`, and preserves `kaui.filekat.com`.
- `npm run release` is the implementation behind the `#release` workflow: it releases the current committed branch into `release` via an isolated worktree, validates test/build, and pushes only after success.



- `demo/templates.html` must be kept structurally aligned with a canonical component page such as `demo/card.html`: do not create a reduced sidebar or alternate footer. Verify the shared regions and theme dropdown before changing catalog content.
- **Protected release branch:** tuyệt đối không chỉnh sửa, commit hoặc push trực tiếp trên `release`. Nếu branch hiện tại là `release`, agent phải cảnh báo và dừng mọi hoạt động thay đổi/deploy ngay lập tức; chỉ được phát hành thông qua `#release` từ `main` hoặc feature branch.
- Local Git hooks (`.githooks/pre-commit`, `.githooks/pre-push`) chặn commit/push trực tiếp trên `release`; mỗi clone cần cấu hình `git config core.hooksPath .githooks`.
- **Canonical `#release` flow:** run `npm run release [patch|minor|major]` from a clean `main`/feature branch. It bumps and builds the version, runs `npm test`, `npm run verify:release`, `npm run tokens:verify`, and `npm run audit:license`, commits/pushes the source branch, merges with `--no-verify` into protected `release`, pushes `release`, then deploys with `railway up`. Set `KAUI_DEPLOY_COMMAND` to override the deploy command. Do not run from `release` or with uncommitted changes.




- Sidebar menu changes must be applied atomically to all 20 `demo/*.html` pages. Keep exactly one `Templates` link per page, under `Resources`, with `.is-active` only on `demo/templates.html`; verify with a full-page count, `git diff --check`, and `npm test`.


- Country table width changes are limited to the country modal selectors in `demo/demo.css`; preserve the four-column markup and modal header/body/footer scroll contract. Verify CSS braces, `git diff --check`, `npm test`, and `npm run build`.
- Modal trigger focus changes are limited to `demo/demo.js`; preserve existing modal close behavior and dropdown focus restoration. Verify with `node --check demo/demo.js`, `npm test`, `npm run build`, and `git diff --check`.


- Modal scroll changes affect `src/scss/extended/_overlay.scss` and all modal consumers in `demo/modal.html`; verify no modal selector retains dialog/overlay scrolling. Rebuild `dist/kaui.css`/`dist/kaui.min.css`, then run `npm test` and `npm run build`.


- Template page changes: keep standalone templates under `demo/templates/` and link from `demo/templates.html` using `target="_blank" rel="noopener noreferrer"`.
- Do not introduce runtime framework dependencies; use `.demo-template-*` auxiliary styles and standard `.k-*` component classes.


- Country modal changes must be atomic across `demo/modal.html`, `demo/demo.js`, `demo/demo.css`, and `demo/countries.js`; preserve existing `#demo-modal` and confirm IDs. Verify with `node --check demo/demo.js`, `node --check demo/countries.js`, `git diff --check`, `npm test`, and `npm run build`.


- Sidebar runtime owns active page/hash state, native body scrolling, theme preset dropdown, and mobile drawer behavior.

# KAUI — Change Protocol

## Before changes

1. Read `.kapul/PROJECT_CONTEXT.md`, `.kapul/TODO.md`, and `.kapul/DEPENDENCY_MAP.md`.
2. Search all references to the target selector/API and assess blast radius.
3. Preserve public `.k-*` and `.demo-*` contracts unless the task explicitly changes them.

## During changes

- Theme footer uses `#theme-preset` with named presets and persists `kaui-theme`; do not reintroduce a Light/Dark toggle or system-preference fallback.
- Theme preset must reuse the standard `.k-dropdown-select` anatomy (`toggle`, `menu`, `item`, hidden select bridge), not a native visible `<select>`.


- Keep sidebar regions semantic: `<header>` for brand, scrollable `<div class="demo-sidebar__body">` for navigation, and `<footer>` for theme/GitHub actions.
- Keep `.demo-sidebar` as a fixed flex column; only `.demo-sidebar__body` may scroll.
- Keep mobile drawer behavior and `demo.js` active-link synchronization intact.
- Apply related markup/style/runtime changes atomically.

- Sidebar active state must not trigger layout scrolling: do not call `scrollIntoView()` or mutate `.demo-sidebar__body.scrollTop` from page/hash active-state synchronization. Keep explicit scroll controls independent.
- Persist sidebar body position with guarded `sessionStorage`; save on sidebar scroll/link navigation/pagehide and restore on load without active-item auto-scroll.


## Verification

- `npm run build` — compile Sass, build icons, and bundle icon CSS.
- `npm test` — run Node native test suite.
- `npm run tokens:verify` and `npm run verify:release` when token/release artifacts are affected.

- Header alignment: `.demo-sidebar__header` and `.demo-header` both use `--demo-header-height` with fixed border-box sizing; desktop and mobile values stay synchronized.

- Scroll contract: `.demo-body`/`.demo-right` are viewport-locked (`height: 100vh; overflow: hidden`); only `.demo-right__body` scrolls (`min-height: 0; overflow-y: auto`). Header/footer are non-scrolling fixed flex regions.

- Inspect `git diff`, status, and all edited files after tests pass.

## Current sidebar contract

All 19 demo pages must contain exactly one `.demo-sidebar` with `.demo-sidebar__header`, `.demo-sidebar__body`, and `.demo-sidebar__footer`. Navigation links live in body; body scroll is independent; header/footer remain fixed. `demo/demo.js` owns active state, scroll controls, theme toggle, and mobile drawer behavior.


## Current right-shell contract
All 19 demo pages must place the content area beside the sidebar as `.demo-right`, with semantic order `.demo-header`, `.demo-right__body` containing `<main class="demo-main">`, then `.demo-footer`. Keep this order stable for accessibility and responsive layout. The header must remain compact and the footer must not obscure main content.


- Table freeze columns changes must preserve sticky header/footer depth (`z-index: 3`) and striped/hover surface continuity across all themes.
- Table scrolling stabilization: apply `overscroll-behavior-x: contain` and GPU acceleration layers (`transform: translateZ(0)`, `will-change: transform`) to sticky cells to eliminate parallax jitter and bounce during aggressive touch/wheel scrolling.
- Navbar demo markup/style changes must keep the interactive overflow lab outside the `<nav>` menu tree; verify nested list structure, `node --check demo/demo.js`, `git diff --check`, `npm test`, and `npm run build`.

- Blue theme typography changes are scoped to `html:not([data-theme]) .demo-body` in `demo/demo.css`; do not change global `$typography` tokens unless all package themes are intentionally affected.

- Navbar flyout visibility changes are atomic across `src/scss/components/_navbar.scss`, `demo/navbar.html`, and generated dist CSS. Verify desktop flyout overflow, closed initial markup, mobile scroll fallback, `git diff --check`, `npm test`, and `npm run build`.

- Navbar guide changes must update `demo/navbar.html` and the matching `componentSnippets` keys in `demo/demo.js` atomically. Verify all `data-copy-component` keys have payloads, then run `node --check demo/demo.js`, `git diff --check`, `npm test`, and `npm run build`.
- **Package service links:** The public demo exposes `View on npm` (`https://www.npmjs.com/package/filekat`) and `View on pub.dev` (`https://pub.dev/packages/filekat`) actions with `target="_blank" rel="noopener noreferrer"`; version-specific registry links in `demo/versions.js` follow the same external-link contract.
- **Official public URL contract:** Public CDN, demo, release manifest, and version artifact links use `https://kaui.filekat.com`; project-owned GitHub source links are not published. Package ecosystem links (`npmjs.com`, `pub.dev`) and third-party attribution URLs remain external by design.
- **Public source policy:** The GitHub repository is intentionally public and must be linked from README/documentation as `https://github.com/longbm64/kaui`. Keep `https://kaui.filekat.com` as the official production site and retain the GitHub Pages demo URL `https://longbm64.github.io/kaui/demo` for the current showcase.
