# KAUI — Modern SCSS/CSS Kit & Component Framework

[![Version](https://img.shields.io/badge/version-1.1.3-blue.svg)](package.json)
[![License: MIT](https://img.shields.io/badge/License-MIT-green.svg)](LICENSE)
[![Tests: 176 passed](https://img.shields.io/badge/tests-176%20passed-brightgreen.svg)](test/kit.test.mjs)
[![Bundle Size](https://img.shields.io/badge/bundle-<60KB%20all--in--one-informational.svg)](dist/kaui.min.css)

**KAUI** is a standalone, production-ready SCSS/CSS framework built for modern web applications. Engineered with a robust two-tier design token architecture, a responsive 12-column grid engine, modular BEM UI components, and native runtime dark theme support — all with zero external dependencies and a strict performance budget.

## Official Links

- **Official website:** https://kaui.filekat.com
- **Open-source source code:** https://github.com/longbm64/kaui
- **GitHub Pages demo:** https://longbm64.github.io/kaui/demo

The official website is the primary production entry point. The GitHub repository is public for source code, issues, contributions, and releases. The GitHub Pages demo remains available as a development/showcase page.


---

## Table of Contents

- [Key Features](#key-features)
- [Quick Start & Installation](#quick-start--installation)
- [Architecture & Design Tokens](#architecture--design-tokens)
  - [Two-Tier Token System](#two-tier-token-system)
  - [Token Reference Table](#token-reference-table)
  - [Dynamic Dark Mode](#dynamic-dark-mode)
- [Layout System](#layout-system)
  - [Container](#container)
  - [12-Column Responsive Grid](#12-column-responsive-grid)
  - [Flexbox Utilities](#flexbox-utilities)
- [UI Components Catalog](#ui-components-catalog)
  - [Buttons](#buttons)
  - [Form Controls & Validation](#form-controls--validation)
  - [Cards](#cards)
  - [Badges](#badges)
  - [Alerts](#alerts)
  - [Navigation Bar](#navigation-bar)
- [Living Styleguide Demo](#living-styleguide-demo)
- [Build Pipeline & Tooling](#build-pipeline--tooling)
- [Testing & Quality Verification](#testing--quality-verification)
- [Project Directory Layout](#project-directory-layout)
- [License](#license)

---

## Tài liệu dự án

- [Living Styleguide Demo](demo/index.html)


## Key Features

- **Two-Tier Design Tokens**: Compile-time type-safety in Sass maps + runtime CSS Custom Properties (`--k-*`) emitted at `:root`.
- **Modern Sass Architecture**: Clean `@use` and `@forward` module structure with zero deprecated `@import` statements.
- **Responsive 12-Column Grid & Flexbox**: Fully responsive column spans (`.k-col-1` to `.k-col-12`, `.k-col-{bp}-{1..12}`) and harmonic gap controls.
- **Component-Scoped CSS Custom Properties**: Modifiers alter local variables instead of repeating property declarations, eliminating specificity bloat.
- **Native Dark Theme**: One-attribute toggle via `[data-theme="dark"]` with instantaneous theme re-mapping.
- **Single CSS Bundle**: `dist/kaui.css` và `dist/kaui.min.css` đã bao gồm cả core components và advanced components; chỉ cần import một file.

- **Ultra-Lightweight & Fast**: Production bundle `< 60 KB` minified, zero runtime framework dependencies.
- **Automated Opaque-Box Test Suite**: 176 automated tests validating CSS syntax, AST balance, selector contracts, and HTML demo parity.

---

### Install in a Web, React, or Next.js application

```bash
npm install filekat
```

Import the production stylesheet from the package root (no `dist` path is required):

```tsx
// Next.js app/layout.tsx, React, or Vite entrypoint
import 'filekat/kaui';
```

For the expanded development stylesheet or optional charts:

```tsx
import 'filekat/css';
import 'filekat/charts';
```


## Quick Start & Installation
### Deploy the demo on Railway

The repository is prepared for Railway as a static Node.js service. Railway runs `npm run build`, then `npm start`; the server listens on `0.0.0.0:$PORT`, exposes `/health` for the healthcheck, and serves the showcase at the `/` root route (the root path redirects there).

#### Deploy from GitHub

1. Push this repository to GitHub.
2. In Railway, choose **New Project → Deploy from GitHub Repo** and select the repository.
3. Railway reads `railway.json`. If configuring manually, use **Build Command** `npm run build` and **Start Command** `npm start`.
4. Generate a public domain in **Settings → Networking → Generate Domain**.
5. Open the generated domain; it should redirect from `/` to the `/` root route.

#### Deploy from the Railway CLI

```bash
railway login
railway init
railway up
railway domain
```


#### Production release branch

Production Railway deployments follow the GitHub `release` branch. Push approved changes to `release`; Railway automatically runs the configured build, start command, and `/health` check. The `main` branch is for development and does not directly deploy production.

```bash
git checkout release
git pull origin release
npm test
npm run build
git push origin release
```

#### One-command release: `#release`

You can work on `main` or any feature branch without deploying. After committing your changes, run the project release command (the agent maps `#release` to this command):

```bash
npm run release
```

The command uses the currently checked-out branch as the source, refuses uncommitted changes or a release from the `release` branch, creates an isolated temporary worktree, merges the current commit into `release`, runs `npm ci`, `npm test`, and `npm run build`, then pushes `release`. Railway detects that push and deploys automatically. Your current branch and working tree are not switched or modified.

If the merge, test, build, or push fails, the command stops and leaves the production `release` branch unchanged (unless the remote push itself already completed). Resolve the issue and run `npm run release` again.



No database or environment variable is required. Do not use `serve:tailscale` in Railway; that command is for local tailnet development and binds a fixed port.



### 1. Clone & Install Build Tools

```bash
# Use the project files from your private source repository
cd kaui

# Install native Dart Sass compiler dependency
npm install
### Direct HTML usage

Bundler users should prefer `import 'filekat/kaui';`. If a static HTML deployment needs a stylesheet URL, copy the published `dist/kaui.min.css` artifact to your public assets directory and reference that copied asset.

### 2. Compile CSS Bundles

```bash
npm run build


### Automated release and deploy

Run `#release` (equivalent to `npm run release`) from a clean `main` or feature branch. The flow automatically:

1. bumps the patch version (`patch` by default; pass `minor` or `major` to the npm command),
2. builds immutable versioned artifacts and runs tests, release verification, token verification, and license audit,
3. commits and pushes the source branch,
4. merges and pushes the protected `release` branch,
5. deploys with `railway up`.

The flow never permits direct work on `release`. Set `KAUI_DEPLOY_COMMAND` when a different deploy command is required.

> **Protected branch policy:** Never edit or commit directly on `release`. Develop on `main` or a feature branch. To publish, use `#release` (equivalent to `npm run release`); it validates and merges into `release` in an isolated worktree. If the current branch is `release`, the release workflow warns and stops.

npm run build:css:dev   # dist/kaui.css (expanded, with source maps)
npm run build:css:prod  # dist/kaui.min.css (compressed, with source maps)
npm run watch           # Watch mode
```

### 3. Include the single bundle in HTML

KAUI ships one stylesheet containing both core and advanced components:

```html
<link rel="stylesheet" href="path/to/dist/kaui.min.css">
```

Không cần import thêm `kaui-extended.css`.

### 4. Run the demo over Tailscale

The project includes a static server bound to all local interfaces so devices in the same Tailscale tailnet can open the demo without exposing it publicly:

```bash

npm run serve:tailscale
```

On this machine, the demo is available at:

```text
http://100.121.62.115:4173/
```



```text
http://100.121.62.115:8080/
```

Use `tailscale ip -4` to verify the current Tailscale IPv4 address. Keep the terminal running while serving. Stop with `Ctrl+C`.


### 3. Include in HTML

Link the compiled stylesheet directly in your HTML `<head>`:

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>My Web Application</title>

  <!-- KAUI CSS Kit (Production Compressed) -->
  <link rel="stylesheet" href="path/to/dist/kaui.min.css">
</head>
<body>
  <div class="k-container">
    <button class="k-btn k-btn--primary">Get Started</button>
  </div>
</body>
</html>
```

---

## Architecture & Design Tokens

### Two-Tier Token System

1. **Compile-time Tier (Sass Maps)**: Defined in `src/scss/abstracts/_tokens.scss`. Powers SCSS calculations, responsive mixins, and automated utility generators.
2. **Runtime Tier (CSS Custom Properties)**: Emitted at `:root` in `src/scss/base/_root.scss`. Allows browser inspection, dynamic JavaScript modification, and client-side theme switching.

### Token Reference Table

| Category | CSS Variable Format | Example Token Values |
|---|---|---|
| **Primary Palette** | `--k-color-primary-{step}` | `50`: `#eff6ff`, `500`: `#3b82f6`, `600`: `#2563eb`, `700`: `#1d4ed8` |
| **Secondary Palette** | `--k-color-secondary-{step}` | `50`: `#f8fafc`, `200`: `#e2e8f0`, `500`: `#64748b`, `600`: `#475569` |
| **Warm Amber Palette** | `--k-color-amber-{50..700}` | `50`: `#fffbeb`, `500`: `#f59e0b`, `700`: `#b45309` |
| **Warm Brown Palette** | `--k-color-brown-{50..900}` | `50`: `#fafaf9`, `500`: `#78716c`, `900`: `#1c1917` |

| **Feedback Colors** | `--k-color-{status}-{step}` | `success`: `#10b981`, `warning`: `#f59e0b`, `error`: `#ef4444`, `info`: `#0ea5e9` |
| **Neutral Grayscale** | `--k-color-neutral-{50..900}` | `50`: `#f8fafc`, `100`: `#f1f5f9`, `500`: `#64748b`, `900`: `#0f172a` |
| **Semantic Aliases** | `--k-{semantic}` | `--k-primary`, `--k-secondary`, `--k-success`, `--k-bg`, `--k-text`, `--k-border` |
| **Spacing Scale** | `--k-spacing-{0..16}` | `0`: `0`, `1`: `0.25rem` (4px), `4`: `1rem` (16px), `8`: `2rem`, `16`: `4rem` (64px) |
| **Typography Scale** | `--k-size-{xs..4xl}` | `xs`: `0.75rem`, `sm`: `0.875rem`, `base`: `1rem`, `xl`: `1.25rem`, `4xl`: `2.25rem` |
| **Font Families** | `--k-font-{sans\|mono}` | `sans`: System UI stack, `mono`: SFMono/Consolas monospace stack |
| **Font Weights** | `--k-weight-{normal..bold}` | `normal`: `400`, `medium`: `500`, `semibold`: `600`, `bold`: `700` |
| **Border Radii** | `--k-radius-{none..full}` | `none`: `0`, `sm`: `0.25rem`, `md`: `0.375rem`, `lg`: `0.5rem`, `xl`: `0.75rem`, `full`: `9999px` |
| **Elevation Shadows** | `--k-shadow-{sm..xl}` | Multi-stop realistic depth shadows (`sm`, `md`, `lg`, `xl`) |
| **Z-Index Scale** | `--k-z-{layer}` | `dropdown`: `1000`, `sticky`: `1020`, `fixed`: `1030`, `modal`: `1050`, `tooltip`: `1080` |

### Dynamic Dark Mode

KAUI includes built-in dark theme support mapped through the `[data-theme="dark"]` attribute selector.

To enable dark mode, set the attribute on `document.documentElement` or any container:

```html
<html data-theme="dark">
  ...
</html>
```

Under dark mode, surface colors (`--k-color-surface`), text colors (`--k-color-text-main`), borders (`--k-color-border`), and elevation shadows automatically remap without requiring component-level overrides.

```javascript
// Toggle Dark Mode via Vanilla JavaScript
const isDark = document.documentElement.getAttribute('data-theme') === 'dark';
document.documentElement.setAttribute('data-theme', isDark ? 'light' : 'dark');
```

---

## Layout System

### Container

- `.k-container`: Centered layout container with responsive max-widths (`640px`, `768px`, `1024px`, `1280px`) and 1rem gutter padding.
- `.k-container--fluid`: Full-width container (100% width) with standard gutters.

```html
<div class="k-container">
  <!-- Centered responsive content -->
</div>
```

### 12-Column Responsive Grid

The grid engine is built on CSS Grid with standard 12-column tracks and responsive breakpoint modifiers (`sm`, `md`, `lg`, `xl`):

```html
<div class="k-grid k-gap-4">
  <!-- Full width on mobile, 6 cols on tablet, 4 cols on desktop -->
  <div class="k-col-12 k-col-md-6 k-col-lg-4">Column A</div>
  <div class="k-col-12 k-col-md-6 k-col-lg-4">Column B</div>
  <div class="k-col-12 k-col-md-12 k-col-lg-4">Column C</div>
</div>
```

Gap utilities: `.k-gap-0` through `.k-gap-16` (maps to `--k-spacing-*`).

### Flexbox Utilities

Quickly align and justify items using intuitive flex utilities:

- **Display**: `.k-flex`, `.k-inline-flex`
- **Direction**: `.k-flex-row`, `.k-flex-col`, `.k-flex-wrap`
- **Justify**: `.k-justify-start`, `.k-justify-center`, `.k-justify-between`, `.k-justify-end`
- **Align Items**: `.k-items-start`, `.k-items-center`, `.k-items-end`, `.k-items-stretch`
- **Gaps**: `.k-gap-1` to `.k-gap-16`

```html
<div class="k-flex k-items-center k-justify-between k-gap-3">
  <span>Left Content</span>
  <span>Right Content</span>
</div>
```

---

## UI Components Catalog

All KAUI components adhere to strict BEM naming (`.k-block__element--modifier`).

### Buttons

Buttons support multiple styling variants, sizes, and interactive states:

```html
<!-- Style Variants -->
<button class="k-btn k-btn--primary">Primary</button>
<button class="k-btn k-btn--secondary">Secondary</button>
<button class="k-btn k-btn--outline">Outline Default</button>
<button class="k-btn k-btn--outline-primary">Outline Primary</button>
<button class="k-btn k-btn--success">Success</button>
<button class="k-btn k-btn--warning">Warning</button>
<button class="k-btn k-btn--danger">Danger</button>

<!-- Sizes -->
<button class="k-btn k-btn--primary k-btn--sm">Small</button>
<button class="k-btn k-btn--primary">Medium (Default)</button>
<button class="k-btn k-btn--primary k-btn--lg">Large</button>
<button class="k-btn k-btn--primary k-btn--block">Full Width Block</button>

<!-- States -->
<button class="k-btn k-btn--primary" disabled>Disabled (Attribute)</button>
<button class="k-btn k-btn--primary is-disabled">Disabled (Class)</button>
```

### Form Controls & Validation

Comprehensive form controls with custom styling and accessible validation states:

```html
<!-- Form Group with Validation Success -->
<div class="k-form-group">
  <label for="email" class="k-form-label">Email Address</label>
  <input type="email" id="email" class="k-input is-valid" value="user@domain.com">
  <div class="k-form-feedback k-form-feedback--valid">Email address verified.</div>
</div>

<!-- Form Group with Validation Error -->
<div class="k-form-group">
  <label for="pwd" class="k-form-label">Password</label>
  <input type="password" id="pwd" class="k-input is-invalid" value="123">
  <div class="k-form-feedback k-form-feedback--invalid">Password must contain at least 8 characters.</div>
</div>

<!-- Select Dropdown -->
<div class="k-form-group">
  <label for="role" class="k-form-label">Role</label>
  <select id="role" class="k-select">
    <option value="user">User</option>
    <option value="admin">Administrator</option>
  </select>
</div>

<!-- Textarea -->
<div class="k-form-group">
  <label for="desc" class="k-form-label">Description</label>
  <textarea id="desc" class="k-textarea" rows="3"></textarea>
  <span class="k-form-hint">Brief summary of your project.</span>
</div>

<!-- Checkbox & Radio -->
<label class="k-flex k-items-center k-gap-2">
  <input type="checkbox" class="k-checkbox" checked>
  <span>I accept the Terms of Service</span>
</label>

<label class="k-flex k-items-center k-gap-2">
  <input type="radio" name="plan" class="k-radio" checked>
  <span>Pro Tier</span>
</label>
```

### Cards

Modular card container with header, title, body, and footer sub-elements:

```html
<!-- Structured Card -->
<div class="k-card">
  <div class="k-card__header k-flex k-justify-between k-items-center">
    <span class="k-fw-semibold">Card Header</span>
    <span class="k-badge k-badge--primary">New</span>
  </div>
  <div class="k-card__body">
    <h3 class="k-card__title">Card Title</h3>
    <p class="k-text-muted">Flexible content area styled with token typography and colors.</p>
  </div>
  <div class="k-card__footer k-flex k-justify-end">
    <button class="k-btn k-btn--sm k-btn--primary">Action</button>
  </div>
</div>

<!-- Card Modifiers -->
<div class="k-card k-card--bordered">Bordered Card</div>
<div class="k-card k-card--interactive">Interactive Hover Elevation Card</div>
```

### Badges

Compact status labels with semantic color themes and pill rounding:

```html
<!-- Semantic Badges -->
<span class="k-badge k-badge--primary">Primary</span>
<span class="k-badge k-badge--secondary">Secondary</span>
<span class="k-badge k-badge--success">Success</span>
<span class="k-badge k-badge--warning">Warning</span>
<span class="k-badge k-badge--error">Error</span>
<span class="k-badge k-badge--info">Info</span>

<!-- Pill Badge -->
<span class="k-badge k-badge--primary k-badge--pill">99+</span>
```

### Alerts

Dismissible feedback banners for notifications:

```html
<div class="k-alert k-alert--success">
  <div>
    <h4 class="k-alert__title">Operation Completed</h4>
    <div class="k-alert__body">Your changes have been saved successfully.</div>
  </div>
  <button type="button" class="k-alert__close" aria-label="Dismiss alert">&times;</button>
</div>

<div class="k-alert k-alert--error">
  <div>
    <h4 class="k-alert__title">Error Occurred</h4>
    <div class="k-alert__body">Unable to process transaction.</div>
  </div>
  <button type="button" class="k-alert__close" aria-label="Dismiss alert">&times;</button>
</div>
```

### Navigation Bar

Responsive navigation header with multi-level nested submenus and smart auto-flip orientation:

```html
<header class="k-navbar k-navbar--expand-lg k-navbar--sticky k-navbar--shadow">
  <div class="k-navbar__container">
    <a href="#" class="k-navbar__brand">
      <span class="k-fw-bold k-text-primary">KAUI</span> Kit
    </a>

    <!-- Mobile Drawer Hamburger Toggle -->
    <button type="button" class="k-navbar__toggle" aria-label="Toggle navigation" aria-controls="primary-nav" aria-expanded="false">
      <span></span><span></span><span></span>
    </button>

    <!-- Navigation Menu (adds .is-open on mobile) -->
    <nav class="k-navbar__menu" id="primary-nav">
      <ul class="k-navbar__nav">
        <li><a href="#" class="k-navbar__link is-active">Home</a></li>

        <!-- Multi-level Nested Submenu -->
        <li class="k-navbar__item--has-children">
          <button type="button" class="k-navbar__link" aria-haspopup="true" aria-expanded="false">
            Products <i data-kaui-icon="chevron-down"></i>
          </button>

          <ul class="k-navbar__submenu">
            <li><a href="#overview" class="k-navbar__link">Overview</a></li>

            <!-- Level 2 Submenu (opens horizontally, top-aligned) -->
            <li class="k-navbar__item--has-children">
              <button type="button" class="k-navbar__link" aria-haspopup="true" aria-expanded="false">
                Analytics <i data-kaui-icon="chevron-right"></i>
              </button>

              <ul class="k-navbar__submenu">
                <li><a href="#reports" class="k-navbar__link">Realtime Reports</a></li>
                <li><a href="#metrics" class="k-navbar__link">User Metrics</a></li>
              </ul>
            </li>
          </ul>
        </li>

        <li><a href="#pricing" class="k-navbar__link">Pricing</a></li>
      </ul>
      <div class="k-navbar__actions">
        <button class="k-btn k-btn--sm k-btn--primary">Sign In</button>
      </div>
    </nav>
  </div>
</header>
```


---

## License

KAUI `1.0.x` is released under the MIT License. Starting with `1.1.0`, KAUI uses the KAUI Personal / Non-Commercial License.

- `1.0.x`: MIT; commercial use is permitted under MIT.
- `1.1.0+`: personal, educational, research, prototype, and non-commercial use only.
- Commercial use of `1.1.0+` requires prior written permission. See `COMMERCIAL_LICENSE.md`.

---

## Design Tokens

The canonical cross-platform token registry is `tokens/kaui.tokens.json`. Verify it against the compiled web bundle and generate a distributable snapshot with:

```bash
npm run tokens:verify
```

The registry is designed to produce future Web CSS, Flutter Dart, Android Compose Kotlin, and iOS SwiftUI outputs without changing the existing `.k-*` web API.


```text
Read `https://kaui.filekat.com/dist/versions/index.json`, take its `latest` version, then access `kaui-agent-manifest.json` inside that latest version directory.
```

The versioned manifest is the canonical machine-readable contract for AI agents. Update only the version segment when releasing a new version.


`package.json` is the canonical version source. Use the release commands to bump the semantic version and archive immutable build artifacts:

```bash
npm run release:patch   # 1.0.0 -> 1.0.1
npm run release:minor   # 1.0.0 -> 1.1.0
npm run release:major   # 1.0.0 -> 2.0.0
npm run build:versioned # build current version without bumping
```

Each release keeps the compatibility aliases in `dist/` and stores a versioned snapshot under `dist/versions/<version>/`. The registry is `dist/versions/index.json`, while each version includes `metadata.json` with build time, file sizes, and SHA-256 checksums.

KAUI provides a living styleguide showcase located at `demo/index.html`.

To view the interactive demo:
1. Compile the CSS bundles: `npm run build`
2. Open `demo/index.html` in your browser:
   ```bash
   # On macOS
   open demo/index.html
   ```

The living styleguide includes:
- Live visualizer for all design tokens (Colors, Typography, Spacing, Radii, Shadows).
- Interactive 12-column grid and flexbox playgrounds.
- Complete UI component matrices (Buttons, Forms, Validation, Cards, Badges, Alerts).
- Interactive dark mode toggle (`#theme-toggle`) persisted in `localStorage`.
- Mobile responsive navbar drawer testing.
- Interactive alert dismissal demo.

---

## Build Pipeline & Tooling

KAUI relies entirely on native Node.js tooling and the official Dart Sass CLI:

| Command | Purpose |
|---|---|
| `npm run build` | Compiles both expanded dev (`dist/kaui.css`) and compressed prod (`dist/kaui.min.css`) bundles. |
| `npm run build:css:dev` | Compiles `dist/kaui.css` with `--style=expanded` and source maps. |
| `npm run build:css:prod` | Compiles `dist/kaui.min.css` with `--style=compressed` (<60KB) and source maps. |
| `npm run watch` | Watches `src/scss/` for changes and automatically recompiles `dist/kaui.css`. |
| `npm test` | Runs the 5-layer opaque-box automated test suite with Node's native `node:test` runner. |

---

## Testing & Quality Verification

KAUI includes an exhaustive test suite (`test/kit.test.mjs`) featuring **176 automated tests** structured across 4 quality tiers:

1. **Tier 1: Feature Coverage (Isolated Happy Path)**: Validates each design token, reset rule, grid track, and component selector.
2. **Tier 2: Boundary, Corner & Residual Cases**: Validates AST balance (`{}` parity), zero uncompiled Sass artifacts (`#{}`, `$k-*`, `@mixin`, `@use`), and bundle size budgets (< 60 KB minified).
3. **Tier 3: Cross-Feature Combinations**: Verifies selector coexistence (e.g. `.k-btn.k-btn--outline.is-disabled`, `[data-theme="dark"] .k-card`, nested grid spans).
4. **Tier 4: Real-World Scenarios & Demo Audit**: Audits real-world UI scenarios and guarantees that every kit class (`k-*` and `is-*`) referenced in `demo/index.html` exists in `dist/kaui.css` with 0 missing classes.

To run the verification suite:

```bash
npm test
```

Expected output:
```text
ℹ tests 176
ℹ suites 32
ℹ pass 176
ℹ fail 0
ℹ cancelled 0
ℹ skipped 0
```

---

## Project Directory Layout

```
kaui/
├── package.json                         # Project scripts and Sass dependency
├── README.md                            # Comprehensive documentation (this file)
├── .gitignore                           # Git ignore rules for build & temp files
├── src/
│   └── scss/
│       ├── kaui.scss                    # Main Sass manifest importing all layers
│       ├── abstracts/                   # Tokens, variables, functions, mixins
│       │   ├── _index.scss
│       │   ├── _tokens.scss             # Design token maps (colors, spacing, etc.)
│       │   ├── _variables.scss
│       │   ├── _functions.scss
│       │   └── _mixins.scss             # Responsive breakpoints & focus ring mixins
│       ├── base/                        # Reset, normalize, root custom properties
│       │   ├── _index.scss
│       │   ├── _reset.scss              # Modern CSS reset & box-sizing
│       │   ├── _root.scss               # :root CSS custom properties & dark theme
│       │   └── _typography.scss         # Base element typographic styles
│       ├── layout/                      # Container, grid, and flex utilities
│       │   ├── _index.scss
│       │   ├── _container.scss          # .k-container and .k-container--fluid
│       │   ├── _grid.scss               # 12-column responsive CSS grid
│       │   └── _flex.scss               # Flexbox alignment & direction utilities
│       ├── components/                  # Core UI component partials
│       │   ├── _index.scss
│       │   ├── _button.scss             # .k-btn variants, sizes, and states
│       │   ├── _form.scss               # .k-input, .k-select, validation states
│       │   ├── _card.scss               # .k-card surface, header, body, footer
│       │   ├── _badge.scss              # .k-badge variants and pill shape
│       │   ├── _alert.scss              # .k-alert notification banners
│       │   └── _navbar.scss             # .k-navbar and responsive mobile drawer
│       └── utilities/                   # Generated utility classes
│           ├── _index.scss
│           ├── _generator.scss          # Map loop generator for spacing utilities
│           ├── _spacing.scss            # Margin & padding helpers (.k-m-*, .k-p-*)
│           ├── _display.scss            # Display helpers (.k-d-none, .k-d-flex)
│           └── _text.scss               # Text alignment and color helpers
├── dist/
│   ├── kaui.css                         # Development expanded CSS bundle
│   ├── kaui.css.map
│   ├── kaui.min.css                     # Production compressed CSS bundle (<60KB)
│   └── kaui.min.css.map
├── demo/
│   ├── index.html                       # Living styleguide showcase
│   ├── demo.css                         # Auxiliary demo chrome styles
│   └── demo.js                          # Zero-dependency theme & drawer interactivity
└── test/
    └── kit.test.mjs                     # 176 automated opaque-box tests
```

---

## License

This project is open source and available under the [MIT License](LICENSE).
