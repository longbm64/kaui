- Custom sidebar scroll controls are removed; sidebar body uses native overflow scrolling.

- **Node:** `demo/` theme dropdown
  - **Exports/public contract:** `.k-dropdown.k-dropdown-select[data-k-theme-preset]`, `.k-dropdown__toggle`, `.k-dropdown__menu`, `.k-dropdown__item`, hidden `#theme-preset` select.
  - **Dependencies:** `demo/demo.js` dropdown controller and theme preset synchronization; `demo/demo.css` footer/dropdown styling.
  - **Dependents:** all 19 demo pages and `demo/versions.js`.

- **Node:** `demo/versions.js`
  - **Exports/public contract:** Version Registry theme preset synchronization; mirrors `demo/demo.js` presets and `kaui-theme` storage.
  - **Dependencies:** `#theme-preset`, `document.documentElement`, `localStorage`.
  - **Dependents:** `demo/versions.html`.

- **Node:** `demo/*.html` region markers
  - **Exports/public contract:** each sidebar header/body/footer carries `data-sidebar-region="header|body|footer"` in addition to the existing BEM class.
  - **Dependencies:** no runtime dependency; `demo/demo.js` continues to target classes for compatibility.
  - **Dependents:** documentation and static HTML contract checks.

# KAUI — Dependency Map

## Shared demo sidebar

- **Node:** `demo/*.html` (19 demo pages)
  - **Exports/public contract:** shared `.demo-sidebar` landmark with `.demo-sidebar__header`, `.demo-sidebar__body`, `.demo-sidebar__footer`; `.demo-sidebar__link` navigation links; `.demo-sidebar-toggle` mobile control.
  - **Dependencies:** `demo/demo.css`, `demo/demo.js`, `dist/kaui.css`, `dist/icons/kaui-icons.css`.
  - **Dependents:** browser demo pages and `test/kit.test.mjs` demo contract checks.
- **Node:** `demo/demo.css`
  - **Exports/public contract:** fixed left sidebar layout; header/footer `flex: 0 0 auto`; body `flex: 1 1 auto; min-height: 0; overflow-y: auto`; mobile drawer styles; scroll-control overlay.
  - **Dependencies:** KAUI CSS custom properties and `.k-*` classes from `dist/kaui.css`.

- **Scroll contract:** `.demo-body` and `.demo-right` lock the viewport; `.demo-right__body` owns vertical scrolling. `.demo-header` and `.demo-footer` are fixed-size flex siblings and never participate in body scrolling.
- Header height dependency: `.demo-sidebar__header` and `.demo-header` both consume `--demo-header-height`; changing this token updates both landmarks atomically.


  - **Dependents:** every `demo/*.html` page.

## Right content shell
- **Node:** `demo/*.html` (19 pages)
  - **Exports/public contract:** `.demo-right` with ordered `.demo-header`, `.demo-right__body`, `.demo-footer`; `.demo-main` remains the semantic content landmark inside body.
  - **Dependencies:** `demo/demo.css`, KAUI tokens, existing sidebar and component markup.
  - **Dependents:** `test/kit.test.mjs` and browser demo navigation.
- **Node:** `demo/demo.css`
  - **Exports/public contract:** flex right shell and compact responsive header; fixed footer remains aligned after sidebar.
  - **Dependencies:** KAUI CSS custom properties.
  - **Dependents:** all 19 demo pages.

- **Node:** `demo/demo.js`
  - **Exports/public contract:** DOMContentLoaded runtime; active page/hash state; independent sidebar-body scrolling; mobile drawer; theme toggle; icon rendering.
  - **Dependencies:** `.demo-sidebar`, `.demo-sidebar__body`, `.demo-sidebar__link`, `.demo-sidebar__scroll-controls`, `#theme-toggle`.
  - **Dependents:** every demo page loading `demo.js`; runtime/adversarial tests.
  - Sidebar active-state behavior: page/hash synchronization changes only `.is-active`; it does not auto-scroll `.demo-sidebar__body`. Manual wheel/touch/keyboard and overlay scroll buttons remain enabled.
  - Sidebar scroll persistence: `sessionStorage['kaui-demo-sidebar-scroll-top']` preserves the manually selected body position across demo-page navigation; restore never targets the active item.



## Build and verification

- `src/scss/kaui.scss` -> `dist/kaui.css`, `dist/kaui.min.css` via Sass.
- `src/scss/**` -> compiled CSS consumed by demo HTML and package artifacts.
- `test/*.test.mjs` -> Node native test runner (`npm test`).
- `package.json` scripts define build, icon generation, token verification and release verification.
