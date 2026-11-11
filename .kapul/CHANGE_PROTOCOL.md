- **Flag SVG namespace contract:** `scripts/add-kaui-flags.mjs` and `scripts/build-icons.mjs` must emit `xmlns:xlink="http://www.w3.org/1999/xlink"` on all standalone flag SVGs because 44 national flag assets use internal `xlink:href` references. Verify all 195 files contain the namespace and direct HTTP responses return 200.

- Confirm component separation: `.k-confirm` and `.k-modal` are distinct independent components with separate demo pages (`demo/modal.html` and `demo/confirm.html`). Every demo page exposes both `Modal` and `Confirm` links under Components; changes must keep their markup, runtime triggers (`data-k-modal-*` vs `data-k-confirm-*`), and styling decoupled.

## Railway deployment protocol

- For deployment changes, preserve the static-site contract: no runtime framework or database is required.
- Railway must use `npm run build` and `npm start`; the server must bind `0.0.0.0` and `process.env.PORT`.
- Verify with `node --check server.mjs`, an HTTP smoke test for `/`, `/health`, `/button.html`, and an asset, then run `npm test`, `npm run build`, and `git diff --check`. The public demo is served at `/`; legacy `/demo` paths redirect to root equivalents.
- Verify with `node --check server.mjs`, an HTTP smoke test for `/`, `/health`, `/demo/index.html`, and an asset, then run `npm test`, `npm run build`, and `git diff --check`.
- Never use `serve:tailscale` as the Railway start command because it binds a fixed local port.

- `demo/templates.html` must be kept structurally aligned with a canonical component page such as `demo/card.html`: do not create a reduced sidebar or alternate footer. Verify the shared regions and theme dropdown before changing catalog content.
- **Protected release branch:** tuyệt đối không chỉnh sửa, commit hoặc push trực tiếp trên `release`. Nếu branch hiện tại là `release`, agent phải cảnh báo và dừng mọi hoạt động thay đổi/deploy ngay lập tức; chỉ được phát hành thông qua `#release` từ `main` hoặc feature branch.
- Local Git hooks (`.githooks/pre-commit`, `.githooks/pre-push`) chặn commit/push trực tiếp trên `release`; mỗi clone cần cấu hình `git config core.hooksPath .githooks`.
- **Canonical `#release` flow:** khi người dùng gửi lệnh `#release` (hoặc `npm run release`), agent và script thực hiện trọn vẹn mọi bước tự động không cần hỏi lại: tự stage/commit nếu working tree có thay đổi, bump version, build, test, verify token/release/license, merge branch `release`, push `main` và `release`, sau đó deploy lên đúng project `kaui` trên Railway.

- **Railway project isolation constraint:** Lệnh `#release` và mọi thao tác deployment của dự án KAUI **CHỈ ĐƯỢC PHÉP** thao tác trên project `kaui` (Project ID: `f651cd45-ac4e-41c1-b764-2dc7858292b6`) trên Railway. Tuyệt đối KHÔNG ĐƯỢC PHÉP deploy, link hay tác động sang bất kỳ project nào khác (như `kapul`). `scripts/release-flow.mjs` kiểm tra và xác thực `railway status` trỏ đúng project `kaui` trước khi thực hiện deploy.





- Sidebar menu changes must be applied atomically to all 20 `demo/*.html` pages. Keep exactly one `Templates` link per page, under `Resources`, with `.is-active` only on `demo/templates.html`; verify with a full-page count, `git diff --check`, and `npm test`.
- Sidebar component menu changes must be applied atomically to all demo HTML pages. Every page must expose exactly one `href="sidebar.html"` link under `Components`; `demo/sidebar.html` must mark it `.is-active` and include the `.k-sidebar` anatomy demo plus `data-copy-component="sidebar"`.
- Sidebar demo layout changes must keep `header`/`footer` as `flex: 0 0 auto` fixed regions and `body` as the sole `overflow-y: auto` region. Use `.demo-sidebar-preview` for demo-only sizing; do not alter public `.k-*` anatomy to force demo dimensions.
- Sidebar separator changes must preserve visible boundaries: header has a bottom border, footer has a top border, and body remains the sole scroll region between them. Verify both compiled CSS selectors and `demo/sidebar.html`.
- Full-width sidebar separators require `.k-sidebar` to keep `padding: 0`; apply spacing on header/body/footer regions so their borders span the entire sidebar width.
- Sidebar scrollbar alignment: `.k-sidebar__body` scrollbar must be flush with the right boundary with thin 0.35rem styling; verify both WebKit and Firefox scrollbar appearance in `dist/kaui.css` and `demo/sidebar.html`.







- Country table width changes are limited to the country modal selectors in `demo/demo.css`; preserve the four-column markup and modal header/body/footer scroll contract. Verify CSS braces, `git diff --check`, `npm test`, and `npm run build`.
- Modal trigger focus changes are limited to `demo/demo.js`; preserve existing modal close behavior and dropdown focus restoration. Verify with `node --check demo/demo.js`, `npm test`, `npm run build`, and `git diff --check`.


- Modal scroll changes affect `src/scss/extended/_overlay.scss` and all modal consumers in `demo/modal.html`; verify no modal selector retains dialog/overlay scrolling. Rebuild `dist/kaui.css`/`dist/kaui.min.css`, then run `npm test` and `npm run build`.

- Modal/Confirm runtime contract: Core `src/js/kaui.js` keeps both dialogs static by default; only `data-k-backdrop="true"` enables backdrop dismissal, while Escape always closes. Keep demo controller behavior aligned with this public contract.


- Template page changes: keep standalone templates under `demo/templates/` and link from `demo/templates.html` using `target="_blank" rel="noopener noreferrer"`.
- Do not introduce runtime framework dependencies; use `.demo-template-*` auxiliary styles and standard `.k-*` component classes.


- Country modal changes must be atomic across `demo/modal.html`, `demo/demo.js`, `demo/demo.css`, and `demo/countries.js`; preserve existing `#demo-modal` and confirm IDs. Verify with `node --check demo/demo.js`, `node --check demo/countries.js`, `git diff --check`, `npm test`, and `npm run build`.


- Sidebar runtime owns active page/hash state, native body scrolling, theme preset dropdown, and mobile drawer behavior.

# KAUI — Change Protocol

## Before changes

1. Read `.kapul/PROJECT_CONTEXT.md`, `.kapul/TODO.md`, and `.kapul/DEPENDENCY_MAP.md`.
2. Search all references to the target selector/API and assess blast radius.
3. Preserve public `.k-*` and `.demo-*` contracts unless the task explicitly changes them.

- Shared theme dropdown behavior is initialized by `dist/kaui.js` (built from `src/js/kaui.js`); `demo/demo.js` must not bind the same `[data-k-theme-preset]` container a second time. Theme changes still flow through the hidden select `change` event and are persisted under `kaui-theme`.

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
- Icon expansion changes must add source SVGs through an idempotent generator, preserve existing names, run `npm run icons:priority:add` (or `npm run icons:build` after source edits), then run `npm test`, `npm run build`, and `git diff --check`. The gallery must continue to derive its catalog from the generated manifest rather than a hard-coded list.
- Country flag icon expansion uses `npm run icons:flags:add`; it downloads the 195 ISO flags idempotently from the attributed flag-icons source, then runs `npm run icons:build`. Verify `categories.flags` count, representative `flag-vn`/`flag-us` symbols, `npm test`, `npm run build`, and `git diff --check`.



- Phase 2 icon changes use `npm run icons:phase2:add`; verify the generated manifest count and representative names only after the build command completes (do not run concurrent artifact checks against the same generated files).

- Icon Gallery search changes are atomic across `demo/icons.html`, `demo/demo.js`, and `demo/demo.css`; preserve manifest loading, file:// fallback, category grouping, copy buttons, and accessible empty-state messaging. Verify `node --check demo/demo.js`, `npm test`, `npm run build`, and `git diff --check`.

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
- **License display contract:** README and public docs must label current `1.1.0+` releases as KAUI Personal / Non-Commercial; MIT references are historical `1.0.x` context only.

- Second-pass blur fix: keep footer background fully opaque and use the same font rendering as core reset (`antialiased`, `grayscale`, `text-rendering: auto`). Verify no `subpixel-antialiased`, `optimizeLegibility`, or transparent footer `color-mix` remains, then run `npm test`, `npm run build`, and `git diff --check`.
- Core package impact: when typography rendering changes are identified in demo, apply the equivalent source change in `src/scss/base/_reset.scss` before publishing; rebuild `dist/kaui.css` and `dist/kaui.min.css` because `package.json` exports those artifacts.
- Text contrast changes in shared tokens must update `src/scss/abstracts/_tokens.scss`, then rebuild both package CSS artifacts; preserve token names and verify `--k-color-text-muted` in expanded and minified output.



- Theme readability changes are scoped to `demo/demo.css`: keep `.demo-footer` opaque (no `backdrop-filter`) and apply consistent font weights across presets. Verify with `npm test`, `npm run build`, `git diff --check`, and grep that no demo footer blur remains.
- Scroll performance changes in `demo/demo.js` must retain passive listeners, coalesce layout reads/class updates via `requestAnimationFrame`, and avoid repositioning closed navbar menus. Verify with `node --check demo/demo.js`, `npm test`, `npm run build`, and `git diff --check`.
- For scroll jitter, prefer native `scroll-behavior: auto`; do not attach global capture-phase scroll listeners for component repositioning. Active-section tracking must be event-driven by hash/navigation or a scoped scroll container only when required.
- Sidebar scroll persistence must not write `sessionStorage` on every scroll event; save on navigation and page lifecycle events only to keep wheel/trackpad scrolling off the synchronous storage path.
- For perceived scroll delay, keep primary vertical containers native: `overscroll-behavior-y: auto`, `touch-action: pan-y`, and `-webkit-overflow-scrolling: touch`; retain `contain` only for intentionally isolated nested regions such as modal/table/dropdown.
- Chart and table optimizations must keep instance APIs backward-compatible; chart rendering pauses when scrolled out of view, pointermove uses requestAnimationFrame, and table resize synchronization batches layout reads/writes. Rebuild `dist/` JS artifacts and verify with `npm test`, `npm run build`, and `git diff --check`.
- Navbar runtime geometry checks must match the component modifier breakpoint: `.k-navbar--expand-lg` uses desktop geometry only at `min-width: 1024px`; verify mobile/tablet drawer at 768–1023px and desktop flyout at >=1024px.
- Code blocks (`pre`) must never set blanket `overscroll-behavior: contain`; restrict containment to `overscroll-behavior-x: contain` and keep `overscroll-behavior-y: auto`. Rebuild CSS artifacts and test scrolling continuity.
