
## Railway deployment changes

- **Node:** `server.mjs`
  - **Exports/public contract:** production static HTTP server; `GET /health` returns 200; `/` redirects to `/demo/`; static paths map to repository files; binds `0.0.0.0:$PORT`.
  - **Dependencies:** Node built-ins only (`fs`, `http`, `path`, `url`); repository static assets.
  - **Dependents:** `package.json` `start` script and `railway.json` deploy start command.
- **Node:** `railway.json`
  - **Exports/public contract:** Railway build command `npm run build`, start command `npm start`, healthcheck `/health`.
  - **Dependencies:** `package.json`, `server.mjs`.
  - **Dependents:** Railway service deployment configuration.
- **Node:** `package.json`
  - **New contract:** `scripts.start` launches `server.mjs`; existing build/test scripts remain unchanged.
  - **Dependents:** Railway Railpack/Nixpacks deployment and local production smoke tests.

- **Node:** `demo/templates.html` canonical page shell
  - **Exports/public contract:** Same sidebar, theme dropdown, mobile toggle, right shell, and footer structure as `demo/card.html`; only the main catalog body is template-specific.
  - **Dependencies:** `demo/demo.css`, `demo/demo.js`, `dist/kaui.css`, `dist/icons/kaui-icons.css`.
  - **Dependents:** template catalog navigation and static demo shell checks.
- **Node:** `scripts/check-protected-branch.mjs` + `.githooks/pre-commit` + `.githooks/pre-push`
  - **Exports/public contract:** rejects commit/push operations when current branch is `release`; development must happen on `main`/feature branches and publish through `npm run release` (`#release`).
  - **Dependencies:** Git branch state, Node.js.
  - **Dependents:** local Git commit/push workflow and agent change protocol.



- **Node:** shared demo sidebar Resources group
  - **Exports/public contract:** Every `demo/*.html` page exposes one `Templates` link under the `Resources` group; `demo/templates.html` applies `.is-active`.
  - **Dependencies:** static sidebar markup in each demo page and `demo/demo.js` active-state runtime.
  - **Dependents:** browser navigation and static demo contract tests.


- **Node:** `demo/demo.css` country table sizing
  - **Exports/public contract:** `.demo-country-table-wrap` contains no horizontal scroll; `.demo-country-table-wrap .k-table` fits 100% width with four responsive fixed columns and wrapped timezone text.
  - **Dependencies:** `demo/modal.html` country table markup and modal body.
  - **Dependents:** `demo/modal.html` browser demo.


- **Node:** `demo/demo.js` modal trigger focus
  - **Exports/public contract:** `blurTrigger()` removes focus from Modal/Confirm launch buttons before opening; closing does not restore focus to the trigger.
  - **Dependencies:** modal trigger IDs and existing modal controller.
  - **Dependents:** `demo/modal.html` Modal/Confirm controls.


- **Node:** `src/scss/extended/_overlay.scss` Modal scroll contract
  - **Exports/public contract:** `.k-modal`, `.k-modal__dialog`, `.k-modal__header`, `.k-modal__body`, `.k-modal__footer`; dialog is flex column and only body scrolls.
  - **Dependencies:** KAUI tokens and modal markup.
  - **Dependents:** `dist/kaui.css`, `dist/kaui.min.css`, `demo/modal.html`, all modal consumers.


- **Node:** `demo/templates.html`
  - **Exports/public contract:** Card-based template catalog page; anchors open templates in new tabs with `target="_blank" rel="noopener noreferrer"`.
  - **Dependencies:** `dist/kaui.css`, `dist/icons/kaui-icons.css`, `demo/demo.css`, `demo/demo.js`.
  - **Dependents:** `demo/index.html` navigation link and browser template users.

- **Node:** `demo/templates/*.html` (`blog.html`, `dashboard.html`, `e-commerce.html`)
  - **Exports/public contract:** Responsive page templates built with KAUI core classes (`.k-card`, `.k-grid`, `.k-btn`, `.k-badge`, `--k-*`).
  - **Dependencies:** `dist/kaui.css`, `demo/demo.css`.
  - **Dependents:** `demo/templates.html`.


- **Node:** `demo/countries.js`
  - **Exports/public contract:** global `demoCountries` array of 195 sovereign-country rows `[ISO alpha-2, calling code, country name, representative IANA timezone]` used by the modal demo.
  - **Dependencies:** none (static data).
  - **Dependents:** `demo/modal.html` loads it; `demo/demo.js` renders it into `#demo-countries-body`.
- **Node:** `demo/modal.html` country modal
  - **Exports/public contract:** `#demo-open-countries`, `#demo-countries-modal`, `.demo-country-modal__body`, `#demo-countries-body`, `#demo-close-countries`, `#demo-cancel-countries`.
  - **Dependencies:** `demo/countries.js`, `demo/demo.js`, `demo/demo.css`, KAUI modal/table CSS.
  - **Dependents:** `test/kit.test.mjs`/browser demo contract checks.
- **Node:** `demo/demo.js` country modal controller
  - **Exports/public contract:** renders `demoCountries`; opens/closes country modal and handles Escape.
  - **Dependencies:** country modal IDs and `demoCountries`.
  - **Dependents:** `demo/modal.html`.


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
- Shared page title spacing contract: `.demo-section` uses 1.5rem vertical padding, `.demo-section-header` uses 1rem bottom margin, and `.demo-section-title` uses 0.25rem bottom margin for compact page headers across all demo pages.



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



- **Node:** `src/scss/components/_table.scss`
  - **Exports/public contract:** `.k-table__avatar`, `.k-table__image`, `.k-table__chart`, `.k-table__chart-bar`, `.k-table__checkbox`, `.k-table__footer`, `.k-table__sum-label` rich-cell/summary styles.
  - **Dependencies:** KAUI tokens and form checkbox styles.
  - **Dependents:** `dist/kaui.css`, `demo/table.html`, table consumers.
- **Node:** `demo/demo.js` table runtime
  - **Exports/public contract:** `initDataTables()` supports search/sort/freeze, select-all checkbox, and `data-k-sum-columns` footer totals.
  - **Dependencies:** `[data-k-table]`, table DOM, `renderKauiIcons()`.
  - **Dependents:** `demo/table.html` and any consumer using the documented data attributes.

- `src/scss/kaui.scss` -> `dist/kaui.css`, `dist/kaui.min.css` via Sass.
- `src/scss/**` -> compiled CSS consumed by demo HTML and package artifacts.
- `test/*.test.mjs` -> Node native test runner (`npm test`).

- **Node:** `demo/card.html` Cards showcase
  - **Exports/public contract:** `#cards .demo-card-grid`, `.demo-card-equal`, `.demo-card-countries`, `.demo-country-list`, `.demo-country-row` markup; no `.k-card--interactive` instance remains on this page.
  - **Dependencies:** `demo/demo.css`, `dist/kaui.css`, `demo/demo.js` icon renderer.
  - **Dependents:** browser Cards demo and static markup checks.
- **Node:** `demo/demo.css` Cards showcase rules
  - **Exports/public contract:** equal-height card column layout; the Countries card body (`.demo-card-countries .k-card__body`) owns vertical scrolling while `.demo-country-list` remains an intrinsic four-column content block.

  - **Exports/public contract:** equal-height card column layout and scrollable four-column country list, scoped to `#cards`.
  - **Dependencies:** KAUI tokens and `.k-card` anatomy.
  - **Dependents:** `demo/card.html`.

- `package.json` scripts define build, icon generation, token verification and release verification.


- **Node:** `src/scss/components/_navbar.scss`
- Navbar demo contract: `demo/navbar.html` includes the `Edge test` menu with three nested levels and an overflow lab explaining desktop flip-up/flip-left behavior and mobile vertical expansion.

  - **Exports/public contract:** `.k-navbar`, `.k-navbar__nav`, `.k-navbar__link`, `.k-navbar__submenu`, `.k-navbar__item--has-children`, modifiers `.is-dropup`/`.is-dropstart`.
  - **Dependencies:** Sass abstracts/tokens; compiled by `src/scss/kaui.scss`.
  - **Dependents:** `demo/navbar.html`, `demo/demo.js`, `dist/kaui.css`, `dist/kaui.min.css`, navbar tests.
- **Node:** `demo/demo.js` navbar controller
  - **Exports/public contract:** click/keyboard/outside/Escape handling for `.k-navbar__toggle` and nested submenu buttons; computes viewport-aware submenu direction.
  - **Dependencies:** `.k-navbar` DOM, browser geometry APIs.
  - **Dependents:** `demo/*.html` pages loading the shared runtime; `demo/navbar.html` demonstrates nested menus.
- **Node:** `demo/navbar.html` Navbar guide
  - **Exports/public contract:** three copy buttons with `data-copy-component="guide-navbar-basic|nested|overflow"`, explanatory modifier/accessibility notes, and visible base markup sample.
  - **Dependencies:** `demo/demo.js` component snippet map and `demo/demo.css` guide card styles.
  - **Dependents:** Navbar demo users and static guide contract checks.