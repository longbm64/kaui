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
