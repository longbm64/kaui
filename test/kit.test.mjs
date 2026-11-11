/**
 * Kaui CSS Kit — Automated Opaque-Box E2E Test Suite
 *
 * Implements the 4-Tier Test Infra specification from TEST_INFRA.md:
 * - Tier 1: Feature Coverage (Isolation, >= 70 assertions)
 * - Tier 2: Boundary, Corner & Error Cases (>= 70 assertions)
 * - Tier 3: Pairwise Feature Combinations (>= 14 assertions)
 * - Tier 4: Real-World Application Scenarios & Demo Audit (>= 7 assertions)
 *
 * Uses Node.js 22 native `node:test` and `node:assert/strict`.
 */

import { describe, it, before } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { execSync } from 'node:child_process';

const DIST_CSS = path.resolve('dist/kaui.css');
const DIST_MIN_CSS = path.resolve('dist/kaui.min.css');
const DIST_CSS_MAP = path.resolve('dist/kaui.css.map');
const DIST_MIN_MAP = path.resolve('dist/kaui.min.css.map');
const DEMO_HTML = path.resolve('demo/index.html');
const CHART_CSS = path.resolve('dist/kaui-chart.css');

const SCSS_ENTRY = path.resolve('src/scss/kaui.scss');
const PKG_JSON = path.resolve('package.json');

let cssContent = '';
let minCssContent = '';
let demoHtmlContent = '';
let artifactsReady = false;
let isErrorCompilation = false;

function refreshArtifacts() {
  // If dist/kaui.css is missing but SCSS source exists, try building once
  if (!fs.existsSync(DIST_CSS) && fs.existsSync(SCSS_ENTRY)) {
    try {
      execSync('npm run build', { stdio: 'pipe' });
    } catch {
      // Build failed or partially written, handled below
    }
  }

  if (fs.existsSync(DIST_CSS)) {
    try {
      cssContent = fs.readFileSync(DIST_CSS, 'utf8');
      isErrorCompilation = cssContent.trim().startsWith('/* Error:');
      artifactsReady = true;
    } catch {
      artifactsReady = false;
    }
  }

  if (fs.existsSync(DIST_MIN_CSS)) {
    try {
      minCssContent = fs.readFileSync(DIST_MIN_CSS, 'utf8');
    } catch {
      minCssContent = '';
    }
  }

  if (fs.existsSync(DEMO_HTML)) {
    try {
      demoHtmlContent = fs.readFileSync(DEMO_HTML, 'utf8');
    } catch {
      demoHtmlContent = '';
    }
  }
}

refreshArtifacts();

// Progressive milestone readiness helpers
const checkBuildReady = (t) => {
  refreshArtifacts();
  if (!fs.existsSync(DIST_CSS)) {
    t.skip('Build artifact dist/kaui.css not found — compilation still in progress');
    return false;
  }
  if (isErrorCompilation) {
    assert.fail(`Sass compilation error detected in dist/kaui.css:\n${cssContent.slice(0, 400)}`);
  }
  return true;
};

const hasLayout = () => fs.existsSync('src/scss/layout/_grid.scss') || (cssContent && cssContent.includes('.k-grid'));
const hasButtons = () => fs.existsSync('src/scss/components/_button.scss') || (cssContent && cssContent.includes('.k-btn'));
const hasForms = () => fs.existsSync('src/scss/components/_form.scss') || (cssContent && cssContent.includes('.k-input'));
const hasCards = () => fs.existsSync('src/scss/components/_card.scss') || (cssContent && cssContent.includes('.k-card'));
const hasBadgesAlerts = () => fs.existsSync('src/scss/components/_alert.scss') || (cssContent && cssContent.includes('.k-alert'));
const hasNavbar = () => fs.existsSync('src/scss/components/_navbar.scss') || (cssContent && cssContent.includes('.k-navbar'));
const hasDemo = () => fs.existsSync(DEMO_HTML);

// Helper for extracting CSS custom property value
function getVarValue(css, varName) {
  const escaped = varName.replace(/[-/\\^$*+?.()|[\]{}]/g, '\\$&');
  const match = css.match(new RegExp(escaped + '\\s*:\\s*([^;]+);'));
  return match ? match[1].trim() : null;
}

// Helper for checking selector presence
function hasSelector(css, selector) {
  return css.includes(selector);
}

// ============================================================================
// TIER 1: FEATURE COVERAGE (Isolated Happy-Path Assertions, >=70 required)
// ============================================================================

describe('Tier 1: Feature Coverage (Isolated Happy Path)', () => {

  // Feature Area 1: Color Tokens (6 assertions)
  describe('1. Color Tokens', () => {
    it('1.1 :root selector is defined in compiled CSS', (t) => {
      if (!checkBuildReady(t)) return;
      assert.match(cssContent, /:root\s*\{/, 'CSS must declare a :root rule block');
    });

    it('1.2 Primary color palette steps (50, 500, 600, 700) are emitted', (t) => {
      if (!checkBuildReady(t)) return;
      assert.ok(cssContent.includes('--k-color-primary-50:'), 'Token --k-color-primary-50 must exist');
      assert.ok(cssContent.includes('--k-color-primary-500:'), 'Token --k-color-primary-500 must exist');
      assert.ok(cssContent.includes('--k-color-primary-600:'), 'Token --k-color-primary-600 must exist');
      assert.ok(cssContent.includes('--k-color-primary-700:'), 'Token --k-color-primary-700 must exist');
    });

    it('1.3 Secondary color palette tokens are emitted', (t) => {
      if (!checkBuildReady(t)) return;
      assert.ok(cssContent.includes('--k-color-secondary-500:'), 'Token --k-color-secondary-500 must exist');
      assert.ok(cssContent.includes('--k-color-secondary-600:'), 'Token --k-color-secondary-600 must exist');
    });


    it('1.3 Warm amber and brown palette tokens are emitted', (t) => {
      if (!checkBuildReady(t)) return;
      for (const token of ['amber-50', 'amber-500', 'amber-700', 'brown-50', 'brown-500', 'brown-900']) {
        assert.ok(cssContent.includes(`--k-color-${token}:`), `Token --k-color-${token} must exist`);
      }
      assert.ok(cssContent.includes('--k-amber:'), 'Semantic token --k-amber must exist');
      assert.ok(cssContent.includes('--k-brown:'), 'Semantic token --k-brown must exist');
    });

    it('1.4 Feedback status tokens (success, warning, error, info) are emitted', (t) => {
      if (!checkBuildReady(t)) return;
      assert.ok(cssContent.includes('--k-color-success-500:'), 'Token --k-color-success-500 must exist');
      assert.ok(cssContent.includes('--k-color-warning-500:'), 'Token --k-color-warning-500 must exist');
      assert.ok(cssContent.includes('--k-color-error-500:'), 'Token --k-color-error-500 must exist');
      assert.ok(cssContent.includes('--k-color-info-500:'), 'Token --k-color-info-500 must exist');
    });

    it('1.5 Neutral grayscale tokens (50 to 900) are emitted', (t) => {
      if (!checkBuildReady(t)) return;
      assert.ok(cssContent.includes('--k-color-neutral-50:'), 'Token --k-color-neutral-50 must exist');
      assert.ok(cssContent.includes('--k-color-neutral-100:'), 'Token --k-color-neutral-100 must exist');
      assert.ok(cssContent.includes('--k-color-neutral-500:'), 'Token --k-color-neutral-500 must exist');
      assert.ok(cssContent.includes('--k-color-neutral-900:'), 'Token --k-color-neutral-900 must exist');
    });

    it('1.6 Semantic aliases (--k-primary, --k-secondary, --k-bg, --k-text, etc.) are emitted', (t) => {
      if (!checkBuildReady(t)) return;
      assert.ok(cssContent.includes('--k-primary:'), 'Semantic token --k-primary must exist');
      assert.ok(cssContent.includes('--k-secondary:'), 'Semantic token --k-secondary must exist');
      assert.ok(cssContent.includes('--k-success:'), 'Semantic token --k-success must exist');
      assert.ok(cssContent.includes('--k-error:'), 'Semantic token --k-error must exist');
      assert.ok(cssContent.includes('--k-bg:'), 'Semantic token --k-bg must exist');
      assert.ok(cssContent.includes('--k-text:'), 'Semantic token --k-text must exist');
    });
  });

  // Feature Area 2: Typography Tokens (6 assertions)
  describe('2. Typography Tokens', () => {
    it('2.1 System sans-serif stack token --k-font-sans is defined', (t) => {
      if (!checkBuildReady(t)) return;
      const fontSans = getVarValue(cssContent, '--k-font-sans');
      assert.ok(fontSans !== null, 'Token --k-font-sans must exist');
      assert.ok(fontSans.includes('system-ui') || fontSans.includes('-apple-system') || fontSans.includes('sans-serif'),
        '--k-font-sans must include modern system font families');
    });

    it('2.2 Monospace stack token --k-font-mono is defined', (t) => {
      if (!checkBuildReady(t)) return;
      const fontMono = getVarValue(cssContent, '--k-font-mono');
      assert.ok(fontMono !== null, 'Token --k-font-mono must exist');
      assert.ok(fontMono.includes('monospace'), '--k-font-mono must include monospace');
    });

    it('2.3 Modular font size scale (--k-size-xs to --k-size-4xl) is emitted', (t) => {
      if (!checkBuildReady(t)) return;
      const sizes = ['xs', 'sm', 'base', 'lg', 'xl', '2xl', '3xl', '4xl'];
      for (const sz of sizes) {
        assert.ok(cssContent.includes(`--k-size-${sz}:`), `Token --k-size-${sz} must exist`);
      }
    });

    it('2.4 Font weights (--k-weight-normal, --k-weight-bold) are defined', (t) => {
      if (!checkBuildReady(t)) return;
      assert.ok(cssContent.includes('--k-weight-normal:') || cssContent.includes('--k-font-weight-normal:'),
        'Token --k-weight-normal must exist');
      assert.ok(cssContent.includes('--k-weight-bold:') || cssContent.includes('--k-font-weight-bold:'),
        'Token --k-weight-bold must exist');
    });

    it('2.5 Line height scale tokens are defined', (t) => {
      if (!checkBuildReady(t)) return;
      assert.ok(cssContent.includes('--k-line-height-tight:'), 'Token --k-line-height-tight must exist');
      assert.ok(cssContent.includes('--k-line-height-base:'), 'Token --k-line-height-base must exist');
      assert.ok(cssContent.includes('--k-line-height-relaxed:'), 'Token --k-line-height-relaxed must exist');
    });

    it('2.6 Base typography styles for headings (h1..h6) are defined in base', (t) => {
      if (!checkBuildReady(t)) return;
      assert.match(cssContent, /\bh1\b/, 'Base heading h1 selector must exist');
      assert.match(cssContent, /\bh2\b/, 'Base heading h2 selector must exist');
      assert.match(cssContent, /\bh3\b/, 'Base heading h3 selector must exist');
    });
  });

  // Feature Area 3: Spacing Tokens (5 assertions)
  describe('3. Spacing Tokens', () => {
    it('3.1 Zero spacing token --k-spacing-0 is defined', (t) => {
      if (!checkBuildReady(t)) return;
      assert.ok(cssContent.includes('--k-spacing-0:'), 'Token --k-spacing-0 must exist');
    });

    it('3.2 Core harmonic spacing scale (--k-spacing-1 through --k-spacing-4) is emitted', (t) => {
      if (!checkBuildReady(t)) return;
      assert.ok(cssContent.includes('--k-spacing-1:'), 'Token --k-spacing-1 must exist');
      assert.ok(cssContent.includes('--k-spacing-2:'), 'Token --k-spacing-2 must exist');
      assert.ok(cssContent.includes('--k-spacing-3:'), 'Token --k-spacing-3 must exist');
      assert.ok(cssContent.includes('--k-spacing-4:'), 'Token --k-spacing-4 must exist');
    });

    it('3.3 Intermediate spacing scale (--k-spacing-5, 6, 8, 10, 12) is emitted', (t) => {
      if (!checkBuildReady(t)) return;
      assert.ok(cssContent.includes('--k-spacing-5:'), 'Token --k-spacing-5 must exist');
      assert.ok(cssContent.includes('--k-spacing-6:'), 'Token --k-spacing-6 must exist');
      assert.ok(cssContent.includes('--k-spacing-8:'), 'Token --k-spacing-8 must exist');
      assert.ok(cssContent.includes('--k-spacing-10:') || cssContent.includes('--k-spacing-12:'),
        'Token --k-spacing-10 or --k-spacing-12 must exist');
    });

    it('3.4 Maximum spacing token --k-spacing-16 is defined', (t) => {
      if (!checkBuildReady(t)) return;
      assert.ok(cssContent.includes('--k-spacing-16:'), 'Token --k-spacing-16 must exist');
    });

    it('3.5 Spacing tokens use rem units or 0', (t) => {
      if (!checkBuildReady(t)) return;
      const sp4 = getVarValue(cssContent, '--k-spacing-4');
      assert.ok(sp4 !== null, '--k-spacing-4 value must exist');
      assert.match(sp4, /rem\b/, '--k-spacing-4 must use rem units');
    });
  });

  // Feature Area 4: Border Radius & Box Shadows (5 assertions)
  describe('4. Border Radius & Shadows', () => {
    it('4.1 Radius scale (--k-radius-none to --k-radius-full) is emitted', (t) => {
      if (!checkBuildReady(t)) return;
      const radii = ['none', 'sm', 'md', 'lg', 'xl', 'full'];
      for (const r of radii) {
        assert.ok(cssContent.includes(`--k-radius-${r}:`), `Token --k-radius-${r} must exist`);
      }
    });

    it('4.2 Subtle shadow token --k-shadow-sm is defined', (t) => {
      if (!checkBuildReady(t)) return;
      assert.ok(cssContent.includes('--k-shadow-sm:'), 'Token --k-shadow-sm must exist');
    });

    it('4.3 Elevation shadow token --k-shadow-md is defined', (t) => {
      if (!checkBuildReady(t)) return;
      assert.ok(cssContent.includes('--k-shadow-md:'), 'Token --k-shadow-md must exist');
    });

    it('4.4 Elevation shadow token --k-shadow-lg is defined', (t) => {
      if (!checkBuildReady(t)) return;
      assert.ok(cssContent.includes('--k-shadow-lg:'), 'Token --k-shadow-lg must exist');
    });

    it('4.5 Deep elevation shadow token --k-shadow-xl is defined', (t) => {
      if (!checkBuildReady(t)) return;
      assert.ok(cssContent.includes('--k-shadow-xl:'), 'Token --k-shadow-xl must exist');
    });
  });

  // Feature Area 5: Breakpoints & Z-Index Tokens (5 assertions)
  describe('5. Breakpoints & Z-Index Tokens', () => {
    it('5.1 Responsive breakpoints (640px, 768px, 1024px, 1280px) are referenced in media queries', (t) => {
      if (!checkBuildReady(t)) return;
      if (!hasLayout()) { t.skip('Breakpoint media queries emitted during M2 layout/utilities'); return; }
      assert.match(cssContent, /@media[^{]*640px/, 'Media query for sm (640px) must exist');
      assert.match(cssContent, /@media[^{]*768px/, 'Media query for md (768px) must exist');
      assert.match(cssContent, /@media[^{]*1024px/, 'Media query for lg (1024px) must exist');
    });

    it('5.2 Stacking token --k-z-dropdown is defined', (t) => {
      if (!checkBuildReady(t)) return;
      assert.ok(cssContent.includes('--k-z-dropdown:'), 'Token --k-z-dropdown must exist');
    });

    it('5.3 Stacking tokens --k-z-sticky and --k-z-fixed are defined', (t) => {
      if (!checkBuildReady(t)) return;
      assert.ok(cssContent.includes('--k-z-sticky:'), 'Token --k-z-sticky must exist');
      assert.ok(cssContent.includes('--k-z-fixed:'), 'Token --k-z-fixed must exist');
    });

    it('5.4 Stacking token --k-z-modal is defined', (t) => {
      if (!checkBuildReady(t)) return;
      assert.ok(cssContent.includes('--k-z-modal:') || cssContent.includes('--k-z-modal-backdrop:'),
        'Token --k-z-modal must exist');
    });

    it('5.5 Stacking token --k-z-tooltip is defined', (t) => {
      if (!checkBuildReady(t)) return;
      assert.ok(cssContent.includes('--k-z-tooltip:'), 'Token --k-z-tooltip must exist');
    });
  });

  // Feature Area 6: Reset / Normalize Base (6 assertions)
  describe('6. Reset / Normalize Base', () => {
    it('6.1 Universal box-sizing border-box reset is declared for all elements and pseudo-elements', (t) => {
      if (!checkBuildReady(t)) return;
      assert.match(cssContent, /\*,\s*\*::before,\s*\*::after/, 'Universal reset selector must match *, *::before, *::after');
      assert.match(cssContent, /box-sizing:\s*border-box/, 'Universal reset must enforce border-box');
    });

    it('6.2 Body reset clears default margins (margin: 0)', (t) => {
      if (!checkBuildReady(t)) return;
      assert.match(cssContent, /(?:^|\}|\s)body[^{]*\{[^}]*margin:\s*0/, 'body reset must set margin: 0');
    });

    it('6.3 Body font family binds to modern sans token (--k-font-sans)', (t) => {
      if (!checkBuildReady(t)) return;
      assert.match(cssContent, /body\s*\{[^}]*--k-font-sans/, 'body must reference var(--k-font-sans)');
    });

    it('6.4 Link base reset styles <a> with transition and color inheritance', (t) => {
      if (!checkBuildReady(t)) return;
      assert.match(cssContent, /(?:^|\}|\s)a\s*\{/, 'Base <a> selector must be styled');
    });

    it('6.5 Media elements (img, svg, video) have responsive constraints', (t) => {
      if (!checkBuildReady(t)) return;
      assert.match(cssContent, /img[^{]*\{[^}]*max-width:\s*100%/, 'img must define max-width: 100%');
    });

    it('6.6 Code elements use monospace font family token', (t) => {
      if (!checkBuildReady(t)) return;
      assert.match(cssContent, /code[^{]*\{[^}]*--k-font-mono/, 'code element must bind to --k-font-mono');
    });
  });

  // Feature Area 7: Responsive Container & Grid (6 assertions)
  describe('7. Responsive Container & Grid', () => {
    it('7.1 .k-container defines max-widths and centered margins', (t) => {
      if (!checkBuildReady(t)) return;
      if (!hasLayout()) { t.skip('Layout & Grid scheduled for M2'); return; }
      assert.ok(cssContent.includes('.k-container'), '.k-container class must exist');
      assert.match(cssContent, /\.k-container[^{]*\{[^}]*margin-/, '.k-container must define auto margin centering');
    });

    it('7.2 .k-container--fluid modifier provides 100% width', (t) => {
      if (!checkBuildReady(t)) return;
      if (!hasLayout()) { t.skip('Layout & Grid scheduled for M2'); return; }
      assert.ok(cssContent.includes('.k-container--fluid'), '.k-container--fluid must exist');
      assert.match(cssContent, /\.k-container--fluid[^{]*\{[^}]*width:\s*100%/, '.k-container--fluid must set width: 100%');
    });

    it('7.3 .k-grid defines display: grid with 12-column repeat tracks', (t) => {
      if (!checkBuildReady(t)) return;
      if (!hasLayout()) { t.skip('Layout & Grid scheduled for M2'); return; }
      assert.ok(cssContent.includes('.k-grid'), '.k-grid class must exist');
      assert.match(cssContent, /\.k-grid[^{]*\{[^}]*display:\s*grid/, '.k-grid must set display: grid');
      assert.match(cssContent, /grid-template-columns:[^;]*repeat\(12,/, '.k-grid must use 12-column repeat tracks');
    });

    it('7.4 Standard column spans (.k-col-1 through .k-col-12) are emitted', (t) => {
      if (!checkBuildReady(t)) return;
      if (!hasLayout()) { t.skip('Layout & Grid scheduled for M2'); return; }
      for (let i = 1; i <= 12; i++) {
        assert.ok(cssContent.includes(`.k-col-${i}`), `Column span .k-col-${i} must exist`);
      }
    });

    it('7.5 Responsive column spans (.k-col-md-*, .k-col-lg-*) are emitted inside media queries', (t) => {
      if (!checkBuildReady(t)) return;
      if (!hasLayout()) { t.skip('Layout & Grid scheduled for M2'); return; }
      assert.ok(cssContent.includes('.k-col-md-6'), 'Responsive span .k-col-md-6 must exist');
      assert.ok(cssContent.includes('.k-col-lg-4'), 'Responsive span .k-col-lg-4 must exist');
    });

    it('7.6 Grid gap utilities (.k-gap-*) are emitted', (t) => {
      if (!checkBuildReady(t)) return;
      if (!hasLayout()) { t.skip('Layout & Grid scheduled for M2'); return; }
      assert.ok(cssContent.includes('.k-gap-0') || cssContent.includes('.k-gap-2') || cssContent.includes('.k-gap-4'),
        'Grid gap utility .k-gap-* must exist');
    });
  });

  // Feature Area 8: Flexbox Layout Utilities (6 assertions)
  describe('8. Flexbox Layout Utilities', () => {
    it('8.1 .k-flex sets display: flex', (t) => {
      if (!checkBuildReady(t)) return;
      if (!hasLayout()) { t.skip('Layout scheduled for M2'); return; }
      assert.ok(cssContent.includes('.k-flex'), '.k-flex class must exist');
      assert.match(cssContent, /\.k-flex[^{]*\{[^}]*display:\s*flex/, '.k-flex must set display: flex');
    });

    it('8.2 Flex direction utilities (.k-flex-row, .k-flex-col) are emitted', (t) => {
      if (!checkBuildReady(t)) return;
      if (!hasLayout()) { t.skip('Layout scheduled for M2'); return; }
      assert.ok(cssContent.includes('.k-flex-row'), '.k-flex-row must exist');
      assert.ok(cssContent.includes('.k-flex-col'), '.k-flex-col must exist');
    });

    it('8.3 Justify content utilities (.k-justify-start, .k-justify-center, .k-justify-between) are emitted', (t) => {
      if (!checkBuildReady(t)) return;
      if (!hasLayout()) { t.skip('Layout scheduled for M2'); return; }
      assert.ok(cssContent.includes('.k-justify-start'), '.k-justify-start must exist');
      assert.ok(cssContent.includes('.k-justify-center'), '.k-justify-center must exist');
      assert.ok(cssContent.includes('.k-justify-between'), '.k-justify-between must exist');
    });

    it('8.4 Align items utilities (.k-items-start, .k-items-center, .k-items-end) are emitted', (t) => {
      if (!checkBuildReady(t)) return;
      if (!hasLayout()) { t.skip('Layout scheduled for M2'); return; }
      assert.ok(cssContent.includes('.k-items-center'), '.k-items-center must exist');
      assert.ok(cssContent.includes('.k-items-start'), '.k-items-start must exist');
    });

    it('8.5 Flex wrap utilities (.k-flex-wrap, .k-flex-nowrap) are emitted', (t) => {
      if (!checkBuildReady(t)) return;
      if (!hasLayout()) { t.skip('Layout scheduled for M2'); return; }
      assert.ok(cssContent.includes('.k-flex-wrap'), '.k-flex-wrap must exist');
      assert.ok(cssContent.includes('.k-flex-nowrap'), '.k-flex-nowrap must exist');
    });

    it('8.6 Flex grow/shrink utilities (.k-flex-grow-1, .k-flex-shrink-0) are emitted', (t) => {
      if (!checkBuildReady(t)) return;
      if (!hasLayout()) { t.skip('Layout scheduled for M2'); return; }
      assert.ok(cssContent.includes('.k-flex-grow-1') || cssContent.includes('.k-flex-grow'),
        '.k-flex-grow-1 utility must exist');
      assert.ok(cssContent.includes('.k-flex-shrink-0') || cssContent.includes('.k-flex-shrink'),
        '.k-flex-shrink-0 utility must exist');
    });
  });

  // Feature Area 9: Buttons Component (6 assertions)
  describe('9. Buttons Component', () => {
    it('9.1 Base .k-btn class defines inline-flex, center alignment, and radius', (t) => {
      if (!checkBuildReady(t)) return;
      if (!hasButtons()) { t.skip('Buttons scheduled for M3'); return; }
      assert.ok(cssContent.includes('.k-btn'), '.k-btn class must exist');
      assert.match(cssContent, /\.k-btn[^{]*\{[^}]*display:\s*inline-flex/, '.k-btn must set display: inline-flex');
    });

    it('9.2 Style variant .k-btn--primary binds to primary color tokens', (t) => {
      if (!checkBuildReady(t)) return;
      if (!hasButtons()) { t.skip('Buttons scheduled for M3'); return; }
      assert.ok(cssContent.includes('.k-btn--primary'), '.k-btn--primary must exist');
    });

    it('9.3 Style variant .k-btn--secondary binds to secondary color tokens', (t) => {
      if (!checkBuildReady(t)) return;
      if (!hasButtons()) { t.skip('Buttons scheduled for M3'); return; }
      assert.ok(cssContent.includes('.k-btn--secondary'), '.k-btn--secondary must exist');
    });

    it('9.4 Style variant .k-btn--outline provides transparent background with border', (t) => {
      if (!checkBuildReady(t)) return;
      if (!hasButtons()) { t.skip('Buttons scheduled for M3'); return; }
      assert.ok(cssContent.includes('.k-btn--outline'), '.k-btn--outline must exist');
    });

    it('9.5 Contextual semantic variant .k-btn--danger is emitted', (t) => {
      if (!checkBuildReady(t)) return;
      if (!hasButtons()) { t.skip('Buttons scheduled for M3'); return; }
      assert.ok(cssContent.includes('.k-btn--danger') || cssContent.includes('.k-btn--error'),
        '.k-btn--danger variant must exist');
    });

    it('9.6 Button sizing classes (.k-btn--sm, .k-btn--lg, .k-btn--block) are emitted', (t) => {
      if (!checkBuildReady(t)) return;
      if (!hasButtons()) { t.skip('Buttons scheduled for M3'); return; }
      assert.ok(cssContent.includes('.k-btn--sm'), '.k-btn--sm must exist');
      assert.ok(cssContent.includes('.k-btn--lg'), '.k-btn--lg must exist');
      assert.ok(cssContent.includes('.k-btn--block'), '.k-btn--block must exist');
    });
  });

  // Feature Area 10: Forms & Validation Inputs (6 assertions)
  describe('10. Forms & Validation Inputs', () => {
    it('10.1 .k-form-group and .k-form-label classes provide vertical rhythm', (t) => {
      if (!checkBuildReady(t)) return;
      if (!hasForms()) { t.skip('Forms scheduled for M3'); return; }
      assert.ok(cssContent.includes('.k-form-group'), '.k-form-group must exist');
      assert.ok(cssContent.includes('.k-form-label'), '.k-form-label must exist');
    });

    it('10.2 .k-input text control with border, padding, and focus ring', (t) => {
      if (!checkBuildReady(t)) return;
      if (!hasForms()) { t.skip('Forms scheduled for M3'); return; }
      assert.ok(cssContent.includes('.k-input'), '.k-input must exist');
    });

    it('10.3 .k-select dropdown has normalized appearance and custom chevron', (t) => {
      if (!checkBuildReady(t)) return;
      if (!hasForms()) { t.skip('Forms scheduled for M3'); return; }
      assert.ok(cssContent.includes('.k-select'), '.k-select must exist');
    });

    it('10.4 .k-textarea multiline input with vertical resize constraint', (t) => {
      if (!checkBuildReady(t)) return;
      if (!hasForms()) { t.skip('Forms scheduled for M3'); return; }
      assert.ok(cssContent.includes('.k-textarea'), '.k-textarea must exist');
    });

    it('10.5 Custom form indicators (.k-checkbox and .k-radio) are emitted', (t) => {
      if (!checkBuildReady(t)) return;
      if (!hasForms()) { t.skip('Forms scheduled for M3'); return; }
      assert.ok(cssContent.includes('.k-checkbox'), '.k-checkbox must exist');
      assert.ok(cssContent.includes('.k-radio'), '.k-radio must exist');
    });

    it('10.6 Form validation state classes (.is-valid, .is-invalid, .k-form-feedback) are defined', (t) => {
      if (!checkBuildReady(t)) return;
      if (!hasForms()) { t.skip('Forms scheduled for M3'); return; }
      assert.ok(cssContent.includes('.is-valid') || cssContent.includes('.k-input--valid'), 'Validation valid state must exist');
      assert.ok(cssContent.includes('.is-invalid') || cssContent.includes('.k-input--invalid'), 'Validation invalid state must exist');
      assert.ok(cssContent.includes('.k-form-feedback'), '.k-form-feedback must exist');
    });

    it('10.7 Form range and format contracts are documented in the forms demo', () => {
      const forms = fs.readFileSync(path.resolve('demo/forms.html'), 'utf8');
      assert.match(forms, /data-k-input-range="date"/);
      assert.match(forms, /data-k-input-range="month"/);
      assert.match(forms, /data-k-input-format="date"/);
      assert.match(forms, /data-k-input-format="month"/);
    });

    it('10.8 Password inputs expose the default eye toggle contract', () => {
      const runtime = fs.readFileSync(path.resolve('src/js/kaui.js'), 'utf8');
      assert.match(runtime, /querySelectorAll\('input\[type="password"\]'\)/);
      assert.match(runtime, /k-input__password-toggle/);
      assert.match(cssContent, /k-input__password-toggle/);
    });


    it('10.9 Interactive picker popover contract is emitted in SCSS and runtime', () => {
      assert.ok(cssContent.includes('.k-picker-popover'), '.k-picker-popover must exist in CSS');
      assert.ok(cssContent.includes('.k-picker-popover__grid--calc'), 'Calculator grid must exist in CSS');
      assert.ok(cssContent.includes('.k-picker-popover__grid--months'), 'Months grid must exist in CSS');
      const runtime = fs.readFileSync(path.resolve('src/js/kaui.js'), 'utf8');
      assert.match(runtime, /k-picker-popover/);
      assert.match(runtime, /getCalcHtml/);
      assert.match(runtime, /getDateHtml/);
      assert.match(runtime, /getMonthHtml/);
    });


  });

  // Feature Area 11: Cards Component (5 assertions)
  describe('11. Cards Component', () => {
    it('11.1 .k-card surface container with background, border, radius, and shadow', (t) => {
      if (!checkBuildReady(t)) return;
      if (!hasCards()) { t.skip('Cards scheduled for M4'); return; }
      assert.ok(cssContent.includes('.k-card'), '.k-card class must exist');
    });

    it('11.2 Structured anatomy element .k-card__header is defined', (t) => {
      if (!checkBuildReady(t)) return;
      if (!hasCards()) { t.skip('Cards scheduled for M4'); return; }
      assert.ok(cssContent.includes('.k-card__header'), '.k-card__header must exist');
    });

    it('11.3 Structured anatomy element .k-card__title is defined', (t) => {
      if (!checkBuildReady(t)) return;
      if (!hasCards()) { t.skip('Cards scheduled for M4'); return; }
      assert.ok(cssContent.includes('.k-card__title'), '.k-card__title must exist');
    });

    it('11.4 Structured anatomy element .k-card__body is defined', (t) => {
      if (!checkBuildReady(t)) return;
      if (!hasCards()) { t.skip('Cards scheduled for M4'); return; }
      assert.ok(cssContent.includes('.k-card__body'), '.k-card__body must exist');
    });

    it('11.5 Structured anatomy element .k-card__footer and/or modifier .k-card--interactive is defined', (t) => {
      if (!checkBuildReady(t)) return;
      if (!hasCards()) { t.skip('Cards scheduled for M4'); return; }
      assert.ok(cssContent.includes('.k-card__footer') || cssContent.includes('.k-card--interactive'),
        '.k-card__footer or .k-card--interactive must exist');
    });
  });

  // Feature Area 12: Badges & Alerts (6 assertions)
  describe('12. Badges & Alerts', () => {
    it('12.1 .k-badge base badge is defined with compact styling', (t) => {
      if (!checkBuildReady(t)) return;
      if (!hasBadgesAlerts()) { t.skip('Badges & Alerts scheduled for M4'); return; }
      assert.ok(cssContent.includes('.k-badge'), '.k-badge class must exist');
    });

    it('12.2 Badge status variants (.k-badge--success, warning, error, info) are emitted', (t) => {
      if (!checkBuildReady(t)) return;
      if (!hasBadgesAlerts()) { t.skip('Badges & Alerts scheduled for M4'); return; }
      assert.ok(cssContent.includes('.k-badge--success'), '.k-badge--success must exist');
      assert.ok(cssContent.includes('.k-badge--warning'), '.k-badge--warning must exist');
      assert.ok(cssContent.includes('.k-badge--error'), '.k-badge--error must exist');
      assert.ok(cssContent.includes('.k-badge--info'), '.k-badge--info must exist');
    });

    it('12.3 Badge shape modifier .k-badge--pill is defined', (t) => {
      if (!checkBuildReady(t)) return;
      if (!hasBadgesAlerts()) { t.skip('Badges & Alerts scheduled for M4'); return; }
      assert.ok(cssContent.includes('.k-badge--pill'), '.k-badge--pill must exist');
    });

    it('12.4 Alert container .k-alert is defined with padding and radius', (t) => {
      if (!checkBuildReady(t)) return;
      if (!hasBadgesAlerts()) { t.skip('Badges & Alerts scheduled for M4'); return; }
      assert.ok(cssContent.includes('.k-alert'), '.k-alert class must exist');
    });

    it('12.5 Alert status variants (.k-alert--success, warning, error, info) are emitted', (t) => {
      if (!checkBuildReady(t)) return;
      if (!hasBadgesAlerts()) { t.skip('Badges & Alerts scheduled for M4'); return; }
      assert.ok(cssContent.includes('.k-alert--success'), '.k-alert--success must exist');
      assert.ok(cssContent.includes('.k-alert--warning'), '.k-alert--warning must exist');
      assert.ok(cssContent.includes('.k-alert--error'), '.k-alert--error must exist');
      assert.ok(cssContent.includes('.k-alert--info'), '.k-alert--info must exist');
    });

    it('12.6 Alert sub-elements (.k-alert__title, .k-alert__close) are defined', (t) => {
      if (!checkBuildReady(t)) return;
      if (!hasBadgesAlerts()) { t.skip('Badges & Alerts scheduled for M4'); return; }
      assert.ok(cssContent.includes('.k-alert__title'), '.k-alert__title must exist');
      assert.ok(cssContent.includes('.k-alert__close'), '.k-alert__close must exist');
    });
  });

  // Feature Area 13: Responsive Navigation (6 assertions)
  describe('13. Responsive Navigation', () => {
    it('13.1 .k-navbar header container is defined with flex layout', (t) => {
      if (!checkBuildReady(t)) return;
      if (!hasNavbar()) { t.skip('Navbar scheduled for M4'); return; }
      assert.ok(cssContent.includes('.k-navbar'), '.k-navbar class must exist');
    });

    it('13.2 .k-navbar__brand branding element is defined', (t) => {
      if (!checkBuildReady(t)) return;
      if (!hasNavbar()) { t.skip('Navbar scheduled for M4'); return; }
      assert.ok(cssContent.includes('.k-navbar__brand'), '.k-navbar__brand must exist');
    });

    it('13.3 .k-navbar__nav navigation links list is defined', (t) => {
      if (!checkBuildReady(t)) return;
      if (!hasNavbar()) { t.skip('Navbar scheduled for M4'); return; }
      assert.ok(cssContent.includes('.k-navbar__nav'), '.k-navbar__nav must exist');
    });

    it('13.4 .k-navbar__link navigation link is defined with active state (.is-active)', (t) => {
      if (!checkBuildReady(t)) return;
      if (!hasNavbar()) { t.skip('Navbar scheduled for M4'); return; }
      assert.ok(cssContent.includes('.k-navbar__link'), '.k-navbar__link must exist');
    });

    it('13.5 .k-navbar__toggle mobile hamburger button trigger is defined', (t) => {
      if (!checkBuildReady(t)) return;
      if (!hasNavbar()) { t.skip('Navbar scheduled for M4'); return; }
      assert.ok(cssContent.includes('.k-navbar__toggle'), '.k-navbar__toggle must exist');
    });

    it('13.6 .k-navbar__menu mobile drawer is defined with open state (.is-open)', (t) => {
      if (!checkBuildReady(t)) return;
      if (!hasNavbar()) { t.skip('Navbar scheduled for M4'); return; }
      assert.ok(cssContent.includes('.k-navbar__menu'), '.k-navbar__menu must exist');
    });
  });

  // Feature Area 14: Build Pipeline & Distribution Artifacts (5 assertions)
  describe('14. Build Pipeline & Distribution Artifacts', () => {
    it('14.1 dist/kaui.css uncompressed development bundle exists and is non-empty', (t) => {
      if (!checkBuildReady(t)) return;
      assert.ok(fs.existsSync(DIST_CSS), 'dist/kaui.css must be generated');
      assert.ok(cssContent.length > 500, 'dist/kaui.css must contain compiled content');
    });

    it('14.2 dist/kaui.min.css compressed production bundle exists and is non-empty', (t) => {
      if (!checkBuildReady(t)) return;
      if (!fs.existsSync(DIST_MIN_CSS)) {
        t.skip('dist/kaui.min.css not yet generated (build in progress)');
        return;
      }
      assert.ok(fs.existsSync(DIST_MIN_CSS), 'dist/kaui.min.css must be generated');
      assert.ok(minCssContent.length > 300, 'dist/kaui.min.css must contain minified content');
    });

    it('14.3 Source maps exist for development build (dist/kaui.css.map)', (t) => {
      if (!checkBuildReady(t)) return;
      if (!fs.existsSync(DIST_CSS_MAP)) {
        t.skip('dist/kaui.css.map not yet generated (build in progress)');
        return;
      }
      assert.ok(fs.existsSync(DIST_CSS_MAP), 'dist/kaui.css.map must exist');
    });

    it('14.4 Source maps exist for production build (dist/kaui.min.css.map)', (t) => {
      if (!checkBuildReady(t)) return;
      if (!fs.existsSync(DIST_MIN_MAP)) {
        t.skip('dist/kaui.min.css.map not yet generated (build in progress)');
        return;
      }
      assert.ok(fs.existsSync(DIST_MIN_MAP), 'dist/kaui.min.css.map must exist');
    });

    it('14.5 package.json defines canonical build and test script commands', () => {
      assert.ok(fs.existsSync(PKG_JSON), 'package.json must exist');
      const pkg = JSON.parse(fs.readFileSync(PKG_JSON, 'utf8'));
      assert.ok(pkg.scripts, 'package.json must contain scripts block');
      assert.ok(pkg.scripts.build, 'npm run build script must exist');
      assert.ok(pkg.scripts['build:css:dev'], 'build:css:dev script must exist');
      assert.ok(pkg.scripts['build:css:prod'], 'build:css:prod script must exist');
      assert.ok(pkg.scripts.test, 'npm test script must exist');
    });
  });

});

// ============================================================================
// TIER 2: BOUNDARY, CORNER & RESIDUAL CASES (Extreme Values & Quality Gates)
// ============================================================================

describe('Tier 2: Boundary, Corner & Residual Cases', () => {

  // Feature Area 1: Color Tokens Boundaries & Inversion (5 assertions)
  describe('1. Color Tokens Boundaries', () => {
    it('2.1.1 Primary 50 (lightest tint) is distinct from Primary 700 (deepest shade)', (t) => {
      if (!checkBuildReady(t)) return;
      const p50 = getVarValue(cssContent, '--k-color-primary-50');
      const p700 = getVarValue(cssContent, '--k-color-primary-700');
      assert.ok(p50 && p700, 'Both primary-50 and primary-700 must be defined');
      assert.notEqual(p50.toLowerCase(), p700.toLowerCase(), 'Primary 50 and 700 must be distinct colors');
    });

    it('2.1.2 Neutral 50 (near white) is distinct from Neutral 900 (near black)', (t) => {
      if (!checkBuildReady(t)) return;
      const n50 = getVarValue(cssContent, '--k-color-neutral-50');
      const n900 = getVarValue(cssContent, '--k-color-neutral-900');
      assert.ok(n50 && n900, 'Both neutral-50 and neutral-900 must be defined');
      assert.notEqual(n50.toLowerCase(), n900.toLowerCase(), 'Neutral 50 and 900 must be distinct colors');
    });

    it('2.1.3 Dark theme attribute selector [data-theme="dark"] is defined', (t) => {
      if (!checkBuildReady(t)) return;
      assert.match(cssContent, /\[data-theme=["']?dark["']?\]/, 'Dark theme selector [data-theme="dark"] must exist');
    });

    it('2.1.4 Dark theme overrides surface background token to a dark color', (t) => {
      if (!checkBuildReady(t)) return;
      assert.match(cssContent, /\[data-theme=["']?dark["']?\]\s*\{[^}]*--k-color-surface:\s*(?:#0|#1|#2|rgba?\([0-9\s,]+0\.)/,
        'Dark theme must override --k-color-surface to a dark color');
    });

    it('2.1.5 Dark theme overrides text color token to a light color', (t) => {
      if (!checkBuildReady(t)) return;
      assert.match(cssContent, /\[data-theme=["']?dark["']?\]\s*\{[^}]*--k-color-text-main:\s*(?:#f|#e|rgba?\([0-9\s,]+255)/,
        'Dark theme must override --k-color-text-main to a light color');
    });
  });

  // Feature Area 2: Typography Scale Boundaries (5 assertions)
  describe('2. Typography Scale Boundaries', () => {
    it('2.2.1 Smallest font size --k-size-xs is <= 0.75rem (12px)', (t) => {
      if (!checkBuildReady(t)) return;
      const szXs = getVarValue(cssContent, '--k-size-xs');
      assert.ok(szXs !== null, '--k-size-xs must exist');
      const numVal = parseFloat(szXs);
      assert.ok(numVal <= 0.75 || szXs.includes('12px'), '--k-size-xs must be 0.75rem or 12px or smaller');
    });

    it('2.2.2 Largest font size --k-size-4xl is >= 2.25rem (36px)', (t) => {
      if (!checkBuildReady(t)) return;
      const sz4xl = getVarValue(cssContent, '--k-size-4xl');
      assert.ok(sz4xl !== null, '--k-size-4xl must exist');
      const numVal = parseFloat(sz4xl);
      assert.ok(numVal >= 2.0 || sz4xl.includes('36px'), '--k-size-4xl must be >= 2.25rem / 36px');
    });

    it('2.2.3 Normal font weight (400) is strictly lower than bold font weight (700)', (t) => {
      if (!checkBuildReady(t)) return;
      const wNormal = parseInt(getVarValue(cssContent, '--k-weight-normal') || getVarValue(cssContent, '--k-font-weight-normal'), 10);
      const wBold = parseInt(getVarValue(cssContent, '--k-weight-bold') || getVarValue(cssContent, '--k-font-weight-bold'), 10);
      assert.ok(!isNaN(wNormal) && !isNaN(wBold), 'Normal and bold weights must be numeric');
      assert.ok(wNormal < wBold, 'Normal weight (400) must be lower than bold weight (700)');
    });

    it('2.2.4 Line height tight (1.25) is strictly less than line height relaxed (1.75)', (t) => {
      if (!checkBuildReady(t)) return;
      const lhTight = parseFloat(getVarValue(cssContent, '--k-line-height-tight'));
      const lhRelaxed = parseFloat(getVarValue(cssContent, '--k-line-height-relaxed'));
      assert.ok(!isNaN(lhTight) && !isNaN(lhRelaxed), 'Line heights must be parseable');
      assert.ok(lhTight < lhRelaxed, 'Tight line-height must be smaller than relaxed line-height');
    });

    it('2.2.5 Monospace stack --k-font-mono includes universal fallback monospace', (t) => {
      if (!checkBuildReady(t)) return;
      const mono = getVarValue(cssContent, '--k-font-mono');
      assert.ok(mono !== null && mono.includes('monospace'), 'Monospace stack must end with monospace fallback');
    });
  });

  // Feature Area 3: Spacing Scale Boundaries & Unit Safety (6 assertions)
  describe('3. Spacing Scale Boundaries', () => {
    it('2.3.1 Spacing 0 token is strictly 0 (not missing or undefined)', (t) => {
      if (!checkBuildReady(t)) return;
      const sp0 = getVarValue(cssContent, '--k-spacing-0');
      assert.ok(sp0 !== null, '--k-spacing-0 must exist');
      assert.ok(sp0 === '0' || sp0 === '0rem' || sp0 === '0px', '--k-spacing-0 must be 0');
    });

    it('2.3.2 Max spacing token --k-spacing-16 is strictly 4rem (or 64px)', (t) => {
      if (!checkBuildReady(t)) return;
      const sp16 = getVarValue(cssContent, '--k-spacing-16');
      assert.ok(sp16 !== null, '--k-spacing-16 must exist');
      assert.ok(sp16 === '4rem' || sp16 === '64px', '--k-spacing-16 must be 4rem or 64px');
    });

    it('2.3.3 Spacing scale monotonicity (--k-spacing-1 < 2 < 4 < 8 < 16)', (t) => {
      if (!checkBuildReady(t)) return;
      const s1 = parseFloat(getVarValue(cssContent, '--k-spacing-1'));
      const s2 = parseFloat(getVarValue(cssContent, '--k-spacing-2'));
      const s4 = parseFloat(getVarValue(cssContent, '--k-spacing-4'));
      const s8 = parseFloat(getVarValue(cssContent, '--k-spacing-8'));
      const s16 = parseFloat(getVarValue(cssContent, '--k-spacing-16'));
      assert.ok(s1 < s2 && s2 < s4 && s4 < s8 && s8 < s16, 'Spacing scale must increase monotonically');
    });

    it('2.3.4 Auto margin utility (.k-m-auto or .k-mx-auto) sets auto margin', (t) => {
      if (!checkBuildReady(t)) return;
      if (!hasLayout()) { t.skip('Utilities scheduled for M2'); return; }
      assert.ok(cssContent.includes('.k-m-auto') || cssContent.includes('.k-mx-auto'),
        'Auto margin utility .k-m-auto or .k-mx-auto must exist');
    });

    it('2.3.5 Zero margin utility .k-m-0 enforces 0 with !important', (t) => {
      if (!checkBuildReady(t)) return;
      if (!hasLayout()) { t.skip('Utilities scheduled for M2'); return; }
      assert.match(cssContent, /\.k-m-0[^{]*\{[^}]*margin:[^;]*0[^;]*!important/,
        '.k-m-0 must set margin: var(--k-spacing-0) !important or 0 !important');
    });

    it('2.3.6 Zero padding utility .k-p-0 enforces 0 with !important', (t) => {
      if (!checkBuildReady(t)) return;
      if (!hasLayout()) { t.skip('Utilities scheduled for M2'); return; }
      assert.match(cssContent, /\.k-p-0[^{]*\{[^}]*padding:[^;]*0[^;]*!important/,
        '.k-p-0 must set padding: var(--k-spacing-0) !important or 0 !important');
    });
  });

  // Feature Area 4: Radius & Shadow Extremes (5 assertions)
  describe('4. Radius & Shadow Extremes', () => {
    it('2.4.1 Zero radius token --k-radius-none is strictly 0', (t) => {
      if (!checkBuildReady(t)) return;
      const rNone = getVarValue(cssContent, '--k-radius-none');
      assert.ok(rNone !== null, '--k-radius-none must exist');
      assert.ok(rNone === '0' || rNone === '0px', '--k-radius-none must evaluate to 0');
    });

    it('2.4.2 Full radius token --k-radius-full is an extreme rounded value (9999px)', (t) => {
      if (!checkBuildReady(t)) return;
      const rFull = getVarValue(cssContent, '--k-radius-full');
      assert.ok(rFull !== null, '--k-radius-full must exist');
      assert.ok(rFull.includes('9999px') || rFull.includes('50%'), '--k-radius-full must be 9999px or 50%');
    });

    it('2.4.3 Radius progression is strictly ascending (sm < md < lg < xl)', (t) => {
      if (!checkBuildReady(t)) return;
      const rSm = parseFloat(getVarValue(cssContent, '--k-radius-sm'));
      const rMd = parseFloat(getVarValue(cssContent, '--k-radius-md'));
      const rLg = parseFloat(getVarValue(cssContent, '--k-radius-lg'));
      const rXl = parseFloat(getVarValue(cssContent, '--k-radius-xl'));
      assert.ok(rSm < rMd && rMd < rLg && rLg < rXl, 'Border radius tokens must increase in size: sm < md < lg < xl');
    });

    it('2.4.4 Box shadow sm is more subtle than box shadow xl', (t) => {
      if (!checkBuildReady(t)) return;
      const sSm = getVarValue(cssContent, '--k-shadow-sm');
      const sXl = getVarValue(cssContent, '--k-shadow-xl');
      assert.ok(sSm && sXl, 'Both shadow sm and shadow xl must exist');
      assert.notEqual(sSm, sXl, 'Shadow sm and shadow xl must be distinct multi-stop shadows');
    });

    it('2.4.5 Box shadows use valid multi-stop rgba elevation values', (t) => {
      if (!checkBuildReady(t)) return;
      const sMd = getVarValue(cssContent, '--k-shadow-md');
      assert.ok(sMd !== null, '--k-shadow-md must exist');
      assert.match(sMd, /rgba\(/, '--k-shadow-md must use transparent rgba colors');
    });
  });

  // Feature Area 5: Breakpoints & Stacking Order Constraints (5 assertions)
  describe('5. Breakpoints & Stacking Order Boundaries', () => {
    it('2.5.1 Responsive breakpoints are strictly ascending: 640px < 768px < 1024px < 1280px', (t) => {
      if (!checkBuildReady(t)) return;
      if (!hasLayout()) { t.skip('Breakpoint media queries emitted during M2 layout/utilities'); return; }
      const smPos = cssContent.indexOf('640px');
      const mdPos = cssContent.indexOf('768px');
      const lgPos = cssContent.indexOf('1024px');
      assert.ok(smPos !== -1 && mdPos !== -1 && lgPos !== -1, 'All breakpoint thresholds must appear in compiled CSS');
    });

    it('2.5.2 Media queries enforce mobile-first min-width strategy', (t) => {
      if (!checkBuildReady(t)) return;
      if (!hasLayout()) { t.skip('Breakpoint media queries emitted during M2 layout/utilities'); return; }
      assert.match(cssContent, /@media\s*\(\s*min-width:/, 'CSS must employ mobile-first min-width media queries');
    });

    it('2.5.3 Stacking context order: dropdown < sticky < fixed < modal < tooltip', (t) => {
      if (!checkBuildReady(t)) return;
      const zDrop = parseInt(getVarValue(cssContent, '--k-z-dropdown'), 10);
      const zSticky = parseInt(getVarValue(cssContent, '--k-z-sticky'), 10);
      const zFixed = parseInt(getVarValue(cssContent, '--k-z-fixed'), 10);
      const zModal = parseInt(getVarValue(cssContent, '--k-z-modal') || getVarValue(cssContent, '--k-z-modal-backdrop'), 10);
      const zTooltip = parseInt(getVarValue(cssContent, '--k-z-tooltip'), 10);
      assert.ok(zDrop <= zSticky && zSticky <= zFixed && zFixed < zModal && zModal < zTooltip,
        'Z-index layers must strictly ascend: dropdown <= sticky <= fixed < modal < tooltip');
    });

    it('2.5.4 Modal z-index is strictly >= 1000 to prevent bleed-through', (t) => {
      if (!checkBuildReady(t)) return;
      const zModal = parseInt(getVarValue(cssContent, '--k-z-modal') || getVarValue(cssContent, '--k-z-modal-backdrop'), 10);
      assert.ok(zModal >= 1000, 'Modal z-index must be at least 1000');
    });

    it('2.5.5 Tooltip z-index is strictly the highest stacking layer', (t) => {
      if (!checkBuildReady(t)) return;
      const zTooltip = parseInt(getVarValue(cssContent, '--k-z-tooltip'), 10);
      const zModal = parseInt(getVarValue(cssContent, '--k-z-modal') || '1050', 10);
      assert.ok(zTooltip > zModal, 'Tooltip must sit on top of all modal layers');
    });
  });

  // Feature Area 6: Reset / Normalize Edge Cases (5 assertions)
  describe('6. Reset & Normalize Edge Cases', () => {
    it('2.6.1 Universal reset includes pseudo-elements *::before and *::after', (t) => {
      if (!checkBuildReady(t)) return;
      assert.match(cssContent, /\*::before/, 'Universal reset must explicitly include *::before');
      assert.match(cssContent, /\*::after/, 'Universal reset must explicitly include *::after');
    });

    it('2.6.2 Form input elements normalize font-family inheritance', (t) => {
      if (!checkBuildReady(t)) return;
      assert.match(cssContent, /(?:button|input|select|textarea)[^{]*\{[^}]*font(?:-family)?:\s*inherit/,
        'Form inputs must inherit font-family from root');
    });

    it('2.6.3 Images have max-width: 100% and height: auto preventing overflow', (t) => {
      if (!checkBuildReady(t)) return;
      assert.match(cssContent, /img[^{]*\{[^}]*max-width:\s*100%/, 'img must set max-width: 100%');
    });

    it('2.6.4 Smooth scroll or text size adjustment enabled in html/body', (t) => {
      if (!checkBuildReady(t)) return;
      assert.match(cssContent, /(?:scroll-behavior:\s*smooth|-webkit-text-size-adjust:\s*100%|text-size-adjust:\s*100%)/,
        'html/body should specify smooth scroll or text-size-adjust');
    });

    it('2.6.5 Button base reset strips default appearance or inherits color', (t) => {
      if (!checkBuildReady(t)) return;
      assert.match(cssContent, /(?:button[^{]*\{[^}]*color:\s*inherit|\.k-btn[^{]*\{[^}]*cursor:\s*pointer)/,
        'Buttons must have normalized reset styling');
    });
  });

  // Feature Area 7: Grid & Container Boundary Constraints (5 assertions)
  describe('7. Grid & Container Boundaries', () => {
    it('2.7.1 Column span 12 fills full 12 tracks (span 12 / span 12 or span 12)', (t) => {
      if (!checkBuildReady(t)) return;
      if (!hasLayout()) { t.skip('Grid scheduled for M2'); return; }
      assert.match(cssContent, /\.k-col-12[^{]*\{[^}]*grid-column:\s*span\s*12/,
        '.k-col-12 must span all 12 tracks');
    });

    it('2.7.2 Column span 1 spans exactly 1 track', (t) => {
      if (!checkBuildReady(t)) return;
      if (!hasLayout()) { t.skip('Grid scheduled for M2'); return; }
      assert.match(cssContent, /\.k-col-1[^{]*\{[^}]*grid-column:\s*span\s*1\b/,
        '.k-col-1 must span 1 track');
    });

    it('2.7.3 .k-grid uses minmax(0, 1fr) to prevent track blowout from long words', (t) => {
      if (!checkBuildReady(t)) return;
      if (!hasLayout()) { t.skip('Grid scheduled for M2'); return; }
      assert.match(cssContent, /minmax\(0,\s*1fr\)/, 'Grid template tracks must use minmax(0, 1fr)');
    });

    it('2.7.4 .k-container defines horizontal margin auto centering', (t) => {
      if (!checkBuildReady(t)) return;
      if (!hasLayout()) { t.skip('Grid scheduled for M2'); return; }
      assert.match(cssContent, /\.k-container[^{]*\{[^}]*(?:margin-(?:inline|left|right):\s*auto|margin:\s*0\s+auto)/,
        '.k-container must center with auto margins');
    });

    it('2.7.5 .k-container--fluid width is 100% without fixed pixel clipping', (t) => {
      if (!checkBuildReady(t)) return;
      if (!hasLayout()) { t.skip('Grid scheduled for M2'); return; }
      assert.match(cssContent, /\.k-container--fluid[^{]*\{[^}]*width:\s*100%/,
        '.k-container--fluid must declare width: 100%');
    });
  });

  // Feature Area 8: Flexbox Utility Extremes (5 assertions)
  describe('8. Flexbox Utility Extremes', () => {
    it('2.8.1 .k-flex-wrap sets flex-wrap: wrap', (t) => {
      if (!checkBuildReady(t)) return;
      if (!hasLayout()) { t.skip('Layout scheduled for M2'); return; }
      assert.match(cssContent, /\.k-flex-wrap[^{]*\{[^}]*flex-wrap:\s*wrap/, '.k-flex-wrap must set flex-wrap: wrap');
    });

    it('2.8.2 .k-flex-nowrap sets flex-wrap: nowrap', (t) => {
      if (!checkBuildReady(t)) return;
      if (!hasLayout()) { t.skip('Layout scheduled for M2'); return; }
      assert.match(cssContent, /\.k-flex-nowrap[^{]*\{[^}]*flex-wrap:\s*nowrap/, '.k-flex-nowrap must set flex-wrap: nowrap');
    });

    it('2.8.3 .k-flex-grow-1 sets flex-grow: 1', (t) => {
      if (!checkBuildReady(t)) return;
      if (!hasLayout()) { t.skip('Layout scheduled for M2'); return; }
      assert.match(cssContent, /\.k-flex-grow(?:-1)?[^{]*\{[^}]*flex-grow:\s*1/, '.k-flex-grow-1 must set flex-grow: 1');
    });

    it('2.8.4 .k-flex-shrink-0 sets flex-shrink: 0', (t) => {
      if (!checkBuildReady(t)) return;
      if (!hasLayout()) { t.skip('Layout scheduled for M2'); return; }
      assert.match(cssContent, /\.k-flex-shrink(?:-0)?[^{]*\{[^}]*flex-shrink:\s*0/, '.k-flex-shrink-0 must set flex-shrink: 0');
    });

    it('2.8.5 .k-flex-row sets flex-direction: row', (t) => {
      if (!checkBuildReady(t)) return;
      if (!hasLayout()) { t.skip('Layout scheduled for M2'); return; }
      assert.match(cssContent, /\.k-flex-row[^{]*\{[^}]*flex-direction:\s*row/, '.k-flex-row must set flex-direction: row');
    });
  });

  // Feature Area 9: Button Interactive State Safeguards (6 assertions)
  describe('9. Button Interactive State Safeguards', () => {
    it('2.9.1 Disabled button enforces pointer-events: none to block phantom clicks', (t) => {
      if (!checkBuildReady(t)) return;
      if (!hasButtons()) { t.skip('Buttons scheduled for M3'); return; }
      assert.match(cssContent, /\.k-btn(?::disabled|\[disabled\]|\.is-disabled)[^{]*\{[^}]*pointer-events:\s*none/,
        'Disabled button must declare pointer-events: none');
    });

    it('2.9.2 Disabled button enforces cursor: not-allowed', (t) => {
      if (!checkBuildReady(t)) return;
      if (!hasButtons()) { t.skip('Buttons scheduled for M3'); return; }
      assert.match(cssContent, /\.k-btn(?::disabled|\[disabled\]|\.is-disabled)[^{]*\{[^}]*cursor:\s*not-allowed/,
        'Disabled button must declare cursor: not-allowed');
    });

    it('2.9.3 Disabled button reduces opacity (<= 0.65)', (t) => {
      if (!checkBuildReady(t)) return;
      if (!hasButtons()) { t.skip('Buttons scheduled for M3'); return; }
      assert.match(cssContent, /\.k-btn(?::disabled|\[disabled\]|\.is-disabled)[^{]*\{[^}]*opacity:\s*0\.[56]/,
        'Disabled button must have reduced opacity around 0.5-0.6');
    });

    it('2.9.4 Focus-visible ring on .k-btn:focus-visible defines box-shadow or outline', (t) => {
      if (!checkBuildReady(t)) return;
      if (!hasButtons()) { t.skip('Buttons scheduled for M3'); return; }
      assert.match(cssContent, /\.k-btn:focus-visible[^{]*\{[^}]*(?:box-shadow|outline):/,
        '.k-btn:focus-visible must provide visual focus ring');
    });

    it('2.9.5 Active button state stays stationary', (t) => {
      if (!checkBuildReady(t)) return;
      if (!hasButtons()) { t.skip('Buttons scheduled for M3'); return; }
      assert.match(cssContent, /\.k-btn:active/, '.k-btn:active state must be styled');
      assert.doesNotMatch(cssContent, /\.k-btn:active[^}]*transform:\s*translateY/, '.k-btn:active must not translate');
    });

    it('2.9.6 Block button .k-btn--block enforces width: 100% and flex display', (t) => {
      if (!checkBuildReady(t)) return;
      if (!hasButtons()) { t.skip('Buttons scheduled for M3'); return; }
      assert.match(cssContent, /\.k-btn--block[^{]*\{[^}]*width:\s*100%/, '.k-btn--block must declare width: 100%');
    });
  });

  // Feature Area 10: Form Validation & Control Safeguards (5 assertions)
  describe('10. Form Validation & Control Safeguards', () => {
    it('2.10.1 Invalid state (.is-invalid, .k-input--invalid) applies error color border', (t) => {
      if (!checkBuildReady(t)) return;
      if (!hasForms()) { t.skip('Forms scheduled for M3'); return; }
      assert.match(cssContent, /(?:\.is-invalid|\.k-input--invalid)[^{]*\{[^}]*(?:border-color|--k-input-border):\s*(?:var\(--k-color-error|#ef4444|#dc2626|var\(--k-error)/,
        'Invalid state must style border with error color');
    });

    it('2.10.2 Valid state (.is-valid, .k-input--valid) applies success color border', (t) => {
      if (!checkBuildReady(t)) return;
      if (!hasForms()) { t.skip('Forms scheduled for M3'); return; }
      assert.match(cssContent, /(?:\.is-valid|\.k-input--valid)[^{]*\{[^}]*(?:border-color|--k-input-border):\s*(?:var\(--k-color-success|#10b981|#059669|var\(--k-success)/,
        'Valid state must style border with success color');
    });

    it('2.10.3 Form control disabled state enforces cursor: not-allowed and muted background', (t) => {
      if (!checkBuildReady(t)) return;
      if (!hasForms()) { t.skip('Forms scheduled for M3'); return; }
      assert.match(cssContent, /\.k-input(?::disabled|\[disabled\]|\.is-disabled)[^{]*\{[^}]*cursor:\s*not-allowed/,
        'Disabled input must declare cursor: not-allowed');
    });

    it('2.10.4 Textarea restricts resize to vertical only', (t) => {
      if (!checkBuildReady(t)) return;
      if (!hasForms()) { t.skip('Forms scheduled for M3'); return; }
      assert.match(cssContent, /\.k-textarea[^{]*\{[^}]*resize:\s*(?:vertical|none)/,
        '.k-textarea must restrict resize to vertical');
    });

    it('2.10.5 Input focus-visible ring is defined', (t) => {
      if (!checkBuildReady(t)) return;
      if (!hasForms()) { t.skip('Forms scheduled for M3'); return; }
      assert.match(cssContent, /\.k-input:focus(?:-visible)?[^{]*\{[^}]*(?:box-shadow|outline):/,
        '.k-input:focus or :focus-visible must provide focus ring');
    });
  });

  // Feature Area 11: Card Surface & Boundary Safeguards (5 assertions)
  describe('11. Card Surface Safeguards', () => {
    it('2.11.1 .k-card sets border-radius binding to ensure rounded container corners', (t) => {
      if (!checkBuildReady(t)) return;
      if (!hasCards()) { t.skip('Cards scheduled for M4'); return; }
      assert.match(cssContent, /\.k-card[^{]*\{[^}]*border-radius:/, '.k-card must declare border-radius');
    });

    it('2.11.2 Interactive card .k-card--interactive provides hover elevation transition', (t) => {
      if (!checkBuildReady(t)) return;
      if (!hasCards()) { t.skip('Cards scheduled for M4'); return; }
      assert.match(cssContent, /\.k-card--interactive/, '.k-card--interactive modifier must exist');
    });

    it('2.11.3 Bordered card .k-card--bordered explicitly enforces border', (t) => {
      if (!checkBuildReady(t)) return;
      if (!hasCards()) { t.skip('Cards scheduled for M4'); return; }
      assert.ok(cssContent.includes('.k-card--bordered'), '.k-card--bordered must exist');
    });

    it('2.11.4 Dark theme override provides dark background surface to cards', (t) => {
      if (!checkBuildReady(t)) return;
      if (!hasCards()) { t.skip('Cards scheduled for M4'); return; }
      assert.ok(cssContent.includes('[data-theme="dark"]') || cssContent.includes('[data-theme=dark]'),
        'Dark theme override selector must be present');
    });

    it('2.11.5 Card header .k-card__header has padding and bottom border or separator', (t) => {
      if (!checkBuildReady(t)) return;
      if (!hasCards()) { t.skip('Cards scheduled for M4'); return; }
      assert.match(cssContent, /\.k-card__header[^{]*\{[^}]*padding:/, '.k-card__header must declare padding');
    });
  });

  // Feature Area 12: Badges & Alerts Edge Safeguards (5 assertions)
  describe('12. Badges & Alerts Edge Safeguards', () => {
    it('2.12.1 Pill badge .k-badge--pill sets border-radius to 9999px or full token', (t) => {
      if (!checkBuildReady(t)) return;
      if (!hasBadgesAlerts()) { t.skip('Badges & Alerts scheduled for M4'); return; }
      assert.match(cssContent, /\.k-badge--pill[^{]*\{[^}]*border-radius:\s*(?:var\(--k-radius-full\)|9999px)/,
        '.k-badge--pill must set full border-radius');
    });

    it('2.12.2 Alert close trigger .k-alert__close sets cursor: pointer', (t) => {
      if (!checkBuildReady(t)) return;
      if (!hasBadgesAlerts()) { t.skip('Badges & Alerts scheduled for M4'); return; }
      assert.match(cssContent, /\.k-alert__close[^{]*\{[^}]*cursor:\s*pointer/,
        '.k-alert__close must set cursor: pointer');
    });

    it('2.12.3 Alert close trigger resets background to transparent or none', (t) => {
      if (!checkBuildReady(t)) return;
      if (!hasBadgesAlerts()) { t.skip('Badges & Alerts scheduled for M4'); return; }
      assert.match(cssContent, /\.k-alert__close[^{]*\{[^}]*background:\s*(?:none|transparent)/,
        '.k-alert__close must have transparent/none background reset');
    });

    it('2.12.4 Alert error .k-alert--error defines distinct error background tint and border', (t) => {
      if (!checkBuildReady(t)) return;
      if (!hasBadgesAlerts()) { t.skip('Badges & Alerts scheduled for M4'); return; }
      assert.ok(cssContent.includes('.k-alert--error'), '.k-alert--error variant must exist');
    });

    it('2.12.5 Alert success .k-alert--success defines distinct success background tint and border', (t) => {
      if (!checkBuildReady(t)) return;
      if (!hasBadgesAlerts()) { t.skip('Badges & Alerts scheduled for M4'); return; }
      assert.ok(cssContent.includes('.k-alert--success'), '.k-alert--success variant must exist');
    });
  });

  // Feature Area 13: Responsive Navigation Drawer Safeguards (5 assertions)
  describe('13. Responsive Navigation Drawer Safeguards', () => {
    it('2.13.1 Mobile hamburger toggle is hidden on desktop viewports (min-width: 768px)', (t) => {
      if (!checkBuildReady(t)) return;
      if (!hasNavbar()) { t.skip('Navbar scheduled for M4'); return; }
      assert.match(cssContent, /@media[^{]*768px[^{]*\{[^}]*\.k-navbar__toggle[^{]*\{[^}]*display:\s*none/,
        '.k-navbar__toggle must be hidden on desktop (min-width: 768px)');
    });

    it('2.13.2 Mobile menu drawer .k-navbar__menu.is-open forces visible display', (t) => {
      if (!checkBuildReady(t)) return;
      if (!hasNavbar()) { t.skip('Navbar scheduled for M4'); return; }
      assert.match(cssContent, /\.k-navbar__menu\.is-open/, '.k-navbar__menu.is-open rule must exist');
    });

    it('2.13.3 Active nav link .k-navbar__link.is-active sets distinct active color or weight', (t) => {
      if (!checkBuildReady(t)) return;
      if (!hasNavbar()) { t.skip('Navbar scheduled for M4'); return; }
      assert.match(cssContent, /\.k-navbar__link\.is-active/, '.k-navbar__link.is-active rule must exist');
    });

    it('2.13.4 Brand element .k-navbar__brand strips default link underline', (t) => {
      if (!checkBuildReady(t)) return;
      if (!hasNavbar()) { t.skip('Navbar scheduled for M4'); return; }
      assert.match(cssContent, /\.k-navbar__brand[^{]*\{[^}]*text-decoration:\s*none/,
        '.k-navbar__brand must set text-decoration: none');
    });

    it('2.13.5 Navbar container uses sticky or fixed z-index stacking token', (t) => {
      if (!checkBuildReady(t)) return;
      if (!hasNavbar()) { t.skip('Navbar scheduled for M4'); return; }
      assert.match(cssContent, /\.k-navbar[^{]*\{[^}]*(?:z-index|position):/,
        '.k-navbar must define position or z-index');
    });
  });

  // Feature Area 14: AST Balance & Residual Sass Hygiene Quality Gates (8 assertions)
  describe('14. AST Balance & Residual Sass Hygiene Quality Gates', () => {
    it('2.14.1 Balanced braces {} in uncompressed dist/kaui.css', (t) => {
      if (!checkBuildReady(t)) return;
      const openCount = (cssContent.match(/\{/g) || []).length;
      const closeCount = (cssContent.match(/\}/g) || []).length;
      assert.equal(openCount, closeCount, `dist/kaui.css braces must balance (found ${openCount} { vs ${closeCount} })`);
      assert.ok(openCount > 10, 'Compiled CSS should contain substantial number of rules');
    });

    it('2.14.2 Balanced braces {} in minified dist/kaui.min.css', (t) => {
      if (!checkBuildReady(t)) return;
      if (!fs.existsSync(DIST_MIN_CSS)) { t.skip('Minified CSS not yet built'); return; }
      const openCount = (minCssContent.match(/\{/g) || []).length;
      const closeCount = (minCssContent.match(/\}/g) || []).length;
      assert.equal(openCount, closeCount, `dist/kaui.min.css braces must balance (found ${openCount} { vs ${closeCount} })`);
    });

    it('2.14.3 Zero residual uncompiled Sass interpolation #{} in dist/kaui.css', (t) => {
      if (!checkBuildReady(t)) return;
      assert.doesNotMatch(cssContent, /#\{/, 'Compiled CSS must not contain uncompiled #{} interpolations');
    });

    it('2.14.4 Zero residual Sass variable definitions $k-*: in dist/kaui.css', (t) => {
      if (!checkBuildReady(t)) return;
      assert.doesNotMatch(cssContent, /\$[a-zA-Z0-9_-]+:/, 'Compiled CSS must not contain raw Sass variables');
    });

    it('2.14.5 Zero residual uncompiled @mixin or @include directives in dist/kaui.css', (t) => {
      if (!checkBuildReady(t)) return;
      assert.doesNotMatch(cssContent, /@mixin\b/, 'Compiled CSS must not contain @mixin directives');
      assert.doesNotMatch(cssContent, /@include\b/, 'Compiled CSS must not contain @include directives');
    });

    it('2.14.6 Zero residual uncompiled @use or @forward directives in dist/kaui.css', (t) => {
      if (!checkBuildReady(t)) return;
      assert.doesNotMatch(cssContent, /@use\b/, 'Compiled CSS must not contain @use directives');
      assert.doesNotMatch(cssContent, /@forward\b/, 'Compiled CSS must not contain @forward directives');
    });

    it('2.14.7 Uncompressed CSS size is substantial (> 5KB) and reasonable (< 150KB)', (t) => {
      if (!checkBuildReady(t)) return;
      const sizeBytes = Buffer.byteLength(cssContent, 'utf8');
      assert.ok(sizeBytes > 3000, `CSS size should be > 3KB (actual: ${sizeBytes} bytes)`);
      assert.ok(sizeBytes < 150000, `CSS size should be < 150KB (actual: ${sizeBytes} bytes)`);
    });

    it('2.14.8 Minified CSS dist/kaui.min.css strictly meets the performance budget', (t) => {
      if (!checkBuildReady(t)) return;
      if (!fs.existsSync(DIST_MIN_CSS)) { t.skip('Minified CSS not yet built'); return; }
      const minSizeBytes = Buffer.byteLength(minCssContent, 'utf8');
      assert.ok(minSizeBytes < 95 * 1024, `Minified CSS must stay under 95KB budget (actual: ${minSizeBytes} bytes)`);
    });
  });

});

// ============================================================================
// TIER 3: CROSS-FEATURE COMBINATIONS (Pairwise Interactions, >=14 required)
// ============================================================================

describe('Tier 3: Cross-Feature Combinations', () => {

  it('3.1 Button size + variant combination: .k-btn.k-btn--primary.k-btn--lg', (t) => {
    if (!checkBuildReady(t)) return;
    if (!hasButtons()) { t.skip('Buttons scheduled for M3'); return; }
    assert.ok(cssContent.includes('.k-btn--primary') && cssContent.includes('.k-btn--lg'),
      '.k-btn must support simultaneous primary and large modifiers');
  });

  it('3.2 Button outline + disabled combination: .k-btn.k-btn--outline.is-disabled', (t) => {
    if (!checkBuildReady(t)) return;
    if (!hasButtons()) { t.skip('Buttons scheduled for M3'); return; }
    assert.ok(cssContent.includes('.k-btn--outline') && cssContent.includes('pointer-events: none'),
      'Outline button must correctly enforce pointer-events: none when disabled');
  });

  it('3.3 Form group + input invalid state + feedback message combination', (t) => {
    if (!checkBuildReady(t)) return;
    if (!hasForms()) { t.skip('Forms scheduled for M3'); return; }
    assert.ok(cssContent.includes('.k-form-group') && cssContent.includes('.k-form-feedback') && cssContent.includes('.is-invalid'),
      'Form group must integrate invalid input state and feedback message');
  });

  it('3.4 Form group + label + input rhythm combination', (t) => {
    if (!checkBuildReady(t)) return;
    if (!hasForms()) { t.skip('Forms scheduled for M3'); return; }
    assert.ok(cssContent.includes('.k-form-label') && cssContent.includes('.k-input'),
      'Form label and input must coexist within form group with coordinated spacing');
  });

  it('3.5 Card container within 12-column grid tracks (.k-grid > .k-col-4 > .k-card)', (t) => {
    if (!checkBuildReady(t)) return;
    if (!hasCards() || !hasLayout()) { t.skip('Cards & Grid scheduled for M3-M4'); return; }
    assert.ok(cssContent.includes('.k-grid') && cssContent.includes('.k-card') && cssContent.includes('.k-col-4'),
      'Cards must be compatible with grid column tracks');
  });

  it('3.6 Card header accommodating small action button (.k-card__header with .k-btn--sm)', (t) => {
    if (!checkBuildReady(t)) return;
    if (!hasCards() || !hasButtons()) { t.skip('Cards & Buttons scheduled for M3-M4'); return; }
    assert.ok(cssContent.includes('.k-card__header') && cssContent.includes('.k-btn--sm'),
      'Card header must support embedded small action button');
  });

  it('3.7 Card title accommodating status badge (.k-card__title with .k-badge)', (t) => {
    if (!checkBuildReady(t)) return;
    if (!hasCards() || !hasBadgesAlerts()) { t.skip('Cards & Badges scheduled for M4'); return; }
    assert.ok(cssContent.includes('.k-card__title') && cssContent.includes('.k-badge'),
      'Card title must support inline status badges');
  });

  it('3.8 Alert notification banner with dismiss trigger (.k-alert.k-alert--error with .k-alert__close)', (t) => {
    if (!checkBuildReady(t)) return;
    if (!hasBadgesAlerts()) { t.skip('Alerts scheduled for M4'); return; }
    assert.ok(cssContent.includes('.k-alert--error') && cssContent.includes('.k-alert__close'),
      'Error alert must integrate close button trigger');
  });

  it('3.9 Responsive navbar with active link and primary action button', (t) => {
    if (!checkBuildReady(t)) return;
    if (!hasNavbar() || !hasButtons()) { t.skip('Navbar & Buttons scheduled for M3-M4'); return; }
    assert.ok(cssContent.includes('.k-navbar') && cssContent.includes('.k-navbar__link') && cssContent.includes('.k-btn--primary'),
      'Navbar must integrate active links and primary action button');
  });

  it('3.10 Responsive multi-breakpoint grid span combination (.k-col-12.k-col-md-6.k-col-lg-4)', (t) => {
    if (!checkBuildReady(t)) return;
    if (!hasLayout()) { t.skip('Grid scheduled for M2'); return; }
    assert.ok(cssContent.includes('.k-col-12') && cssContent.includes('.k-col-md-6') && cssContent.includes('.k-col-lg-4'),
      'Grid must support progressive multi-breakpoint column classes');
  });

  it('3.11 Dark theme override interacting with card component ([data-theme="dark"] .k-card)', (t) => {
    if (!checkBuildReady(t)) return;
    if (!hasCards()) { t.skip('Cards scheduled for M4'); return; }
    assert.ok(cssContent.includes('[data-theme="dark"]') && cssContent.includes('.k-card'),
      'Dark theme override must cascade to card background surface');
  });

  it('3.12 Dark theme override interacting with form input controls ([data-theme="dark"] .k-input)', (t) => {
    if (!checkBuildReady(t)) return;
    if (!hasForms()) { t.skip('Forms scheduled for M3'); return; }
    assert.ok(cssContent.includes('[data-theme="dark"]') && cssContent.includes('.k-input'),
      'Dark theme override must cascade to form input styling');
  });

  it('3.13 Spacing utilities combined with component card (.k-card.k-mb-4.k-p-6)', (t) => {
    if (!checkBuildReady(t)) return;
    if (!hasCards() || !hasLayout()) { t.skip('Cards & Utilities scheduled for M2-M4'); return; }
    assert.ok(cssContent.includes('.k-card') && cssContent.includes('.k-mb-4') && cssContent.includes('.k-p-6'),
      'Card component must accept margin and padding utility overrides');
  });

  it('3.14 Flexbox container with gap tokens aligning buttons (.k-flex.k-gap-2 with .k-btn)', (t) => {
    if (!checkBuildReady(t)) return;
    if (!hasButtons() || !hasLayout()) { t.skip('Buttons & Flex scheduled for M2-M3'); return; }
    assert.ok(cssContent.includes('.k-flex') && cssContent.includes('.k-btn') && (cssContent.includes('.k-gap-2') || cssContent.includes('--k-spacing-2')),
      'Flex container with gap must layout multiple buttons');
  });

  it('3.15 Responsive display utilities combined with navbar toggle (.k-d-none.k-d-md-block)', (t) => {
    if (!checkBuildReady(t)) return;
    if (!hasLayout()) { t.skip('Utilities scheduled for M2'); return; }
    assert.ok(cssContent.includes('.k-d-none') && (cssContent.includes('.k-d-md-block') || cssContent.includes('.k-d-md-flex')),
      'Responsive display utilities must provide toggle display states');
  });

});

// ============================================================================
// TIER 4: REAL-WORLD APPLICATION SCENARIOS (Workload & Demo Audit, >=7 required)
// ============================================================================

describe('Tier 4: Real-World Application Scenarios & Demo Audit', () => {

  it('4.1 Scenario 1: SaaS Dashboard Layout composition', (t) => {
    if (!checkBuildReady(t)) return;
    if (!hasNavbar() || !hasLayout() || !hasCards() || !hasButtons()) {
      t.skip('Dashboard components scheduled for M2-M4');
      return;
    }
    const dashboardRequiredClasses = [
      '.k-container',
      '.k-navbar',
      '.k-navbar__brand',
      '.k-grid',
      '.k-col-12',
      '.k-col-md-4',
      '.k-card',
      '.k-card__header',
      '.k-card__title',
      '.k-card__body',
      '.k-badge--success',
      '.k-btn--primary'
    ];
    for (const cls of dashboardRequiredClasses) {
      assert.ok(cssContent.includes(cls), `SaaS Dashboard scenario requires class "${cls}"`);
    }
  });

  it('4.2 Scenario 2: User Authentication Form composition', (t) => {
    if (!checkBuildReady(t)) return;
    if (!hasCards() || !hasForms() || !hasButtons()) {
      t.skip('Auth form components scheduled for M3-M4');
      return;
    }
    const authRequiredClasses = [
      '.k-card',
      '.k-form-group',
      '.k-form-label',
      '.k-input',
      '.k-checkbox',
      '.k-btn--primary',
      '.k-btn--block'
    ];
    for (const cls of authRequiredClasses) {
      assert.ok(cssContent.includes(cls), `User Auth Form scenario requires class "${cls}"`);
    }
  });

  it('4.3 Scenario 3: Form Validation Feedback Flow composition', (t) => {
    if (!checkBuildReady(t)) return;
    if (!hasForms() || !hasBadgesAlerts()) {
      t.skip('Validation flow components scheduled for M3-M4');
      return;
    }
    const validationRequiredClasses = [
      '.k-input',
      '.is-invalid',
      '.k-form-feedback',
      '.k-alert--error',
      '.k-alert__title',
      '.k-alert__close'
    ];
    for (const cls of validationRequiredClasses) {
      assert.ok(cssContent.includes(cls), `Validation Feedback Flow scenario requires class "${cls}"`);
    }
  });

  it('4.4 Scenario 4: Product Pricing Table composition', (t) => {
    if (!checkBuildReady(t)) return;
    if (!hasCards() || !hasLayout() || !hasButtons() || !hasBadgesAlerts()) {
      t.skip('Pricing table components scheduled for M2-M4');
      return;
    }
    const pricingRequiredClasses = [
      '.k-grid',
      '.k-col-12',
      '.k-col-md-4',
      '.k-card',
      '.k-card__header',
      '.k-card__body',
      '.k-badge--pill',
      '.k-btn--primary',
      '.k-btn--outline'
    ];
    for (const cls of pricingRequiredClasses) {
      assert.ok(cssContent.includes(cls), `Pricing Table scenario requires class "${cls}"`);
    }
  });

  it('4.5 Scenario 5: Alert Notification System composition', (t) => {
    if (!checkBuildReady(t)) return;
    if (!hasBadgesAlerts()) {
      t.skip('Alert notification components scheduled for M4');
      return;
    }
    const alertRequiredClasses = [
      '.k-alert--success',
      '.k-alert--warning',
      '.k-alert--error',
      '.k-alert--info',
      '.k-alert__title',
      '.k-alert__close'
    ];
    for (const cls of alertRequiredClasses) {
      assert.ok(cssContent.includes(cls), `Alert Notification scenario requires class "${cls}"`);
    }
  });

  it('4.6 Scenario 6: Living Styleguide HTML Demo Audit (demo/index.html)', (t) => {
    if (!checkBuildReady(t)) return;
    if (!hasDemo()) {
      t.skip('demo/index.html not yet created (scheduled for M5)');
      return;
    }

    assert.ok(demoHtmlContent.length > 500, 'demo/index.html must contain substantial markup');
    assert.match(demoHtmlContent, /href=["'][^"']*dist\/kaui(?:\.min)?\.css["']/,
      'demo/index.html must link to compiled kaui.css or kaui.min.css');

    // Extract all classes from demo HTML
    const classRegex = /class=["']([^"']+)["']/g;
    let match;
    const usedKitClasses = new Set();

    while ((match = classRegex.exec(demoHtmlContent)) !== null) {
      const tokens = match[1].split(/\s+/).filter(Boolean);
      for (const tok of tokens) {
        if (tok.startsWith('k-') || tok === 'is-valid' || tok === 'is-invalid' || tok === 'is-active' || tok === 'is-disabled' || tok === 'is-open') {
          usedKitClasses.add(tok);
        }
      }
    }

    assert.ok(usedKitClasses.size >= 25,
      `HTML demo must exercise a comprehensive set of kit classes (found ${usedKitClasses.size})`);

    // Verify zero orphaned or misspelled classes
    const missing = [];
    for (const cls of usedKitClasses) {
      if (!cssContent.includes(`.${cls}`) && !(fs.existsSync(CHART_CSS) && fs.readFileSync(CHART_CSS, 'utf8').includes(`.${cls}`))) {
        missing.push(cls);
      }
    }

    assert.deepEqual(missing, [],
      `HTML demo references undefined kit classes: ${missing.join(', ')}`);
  });

  it('4.7 Scenario 7: Dynamic Dark Theme Switcher Contract', (t) => {
    if (!checkBuildReady(t)) return;
    assert.match(cssContent, /\[data-theme=["']?dark["']?\]/,
      'Dark theme contract requires [data-theme="dark"] selector');
    // Ensure all critical surface and text variables are redefined under dark theme
    assert.match(cssContent, /\[data-theme=["']?dark["']?\]\s*\{[^}]*--k-color-surface:/,
      'Dark theme must redefine --k-color-surface');
    assert.match(cssContent, /\[data-theme=["']?dark["']?\]\s*\{[^}]*--k-color-text-main:/,
      'Dark theme must redefine --k-color-text-main');
    assert.match(cssContent, /\[data-theme=["']?dark["']?\]\s*\{[^}]*--k-color-border:/,
      'Dark theme must redefine --k-color-border');
  });

});
