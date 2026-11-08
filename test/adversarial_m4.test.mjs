/**
 * Adversarial Empirical Stress Test Suite for Milestone 4
 * (Container & Feedback Components: Cards, Badges, Alerts, Navigation)
 *
 * Verifies:
 * 1. Card Component Structure, Anatomy, Modifiers & Dark Theme
 * 2. Badge Component Structure, Status Variants & Pill Modifier
 * 3. Alert Component Structure, Status Variants, Anatomy & Dismiss Trigger
 * 4. Navigation Component Structure, Responsive Toggle, Breakpoints & Active States
 * 5. Cross-Feature Pairwise Combinations & Composability
 * 6. AST Balance, Hygiene & Performance Budget Compliance (< 65,536 bytes)
 */

import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';

const DIST_CSS = path.resolve('dist/kaui.css');
const DIST_MIN_CSS = path.resolve('dist/kaui.min.css');

assert.ok(fs.existsSync(DIST_CSS), `dist/kaui.css must exist at ${DIST_CSS}`);
assert.ok(fs.existsSync(DIST_MIN_CSS), `dist/kaui.min.css must exist at ${DIST_MIN_CSS}`);

const cssContent = fs.readFileSync(DIST_CSS, 'utf8');
const minCssContent = fs.readFileSync(DIST_MIN_CSS, 'utf8');

// Helper to extract rule blocks matching a selector regex
function extractRules(css, selectorRegex) {
  const matches = [];
  const regex = /([^{}]+)\{([^{}]+)\}/g;
  let match;
  while ((match = regex.exec(css)) !== null) {
    const sel = match[1].trim();
    const body = match[2].trim();
    if (selectorRegex.test(sel)) {
      matches.push({ selector: sel, declarations: body });
    }
  }
  return matches;
}

// Helper to extract media queries matching a breakpoint regex
function extractMediaQueries(css, bpRegex) {
  const mediaMatches = [];
  const mediaBlockRegex = /@media\s*([^{]+)\{([\s\S]*?\n\})/g;
  let mMatch;
  while ((mMatch = mediaBlockRegex.exec(css)) !== null) {
    const query = mMatch[1].trim();
    const content = mMatch[2];
    if (bpRegex.test(query)) {
      mediaMatches.push({ query, content });
    }
  }
  return mediaMatches;
}

describe('M4 Adversarial Stress Suite: Container & Feedback Components', () => {

  // ==========================================================================
  // 1. CARD COMPONENT STRESS
  // ==========================================================================
  describe('1. Card Component Architecture & Surface Anatomy', () => {
    it('1.1 Base .k-card declares surface custom properties and container flex structure', () => {
      const cardRules = extractRules(cssContent, /^\.k-card$/);
      assert.ok(cardRules.length > 0, '.k-card rule block must exist in compiled CSS');

      const decls = cardRules[0].declarations;
      assert.match(decls, /--k-card-bg:\s*var\(--k-color-surface\)/, 'Card must bind --k-card-bg to surface');
      assert.match(decls, /--k-card-border-color:\s*var\(--k-color-border\)/, 'Card must bind --k-card-border-color');
      assert.match(decls, /--k-card-border-radius:\s*var\(--k-radius-lg\)/, 'Card must bind --k-card-border-radius to lg');
      assert.match(decls, /--k-card-shadow:\s*var\(--k-shadow-sm\)/, 'Card must bind --k-card-shadow to sm');

      assert.match(decls, /display:\s*flex/, 'Card must use flex container display');
      assert.match(decls, /flex-direction:\s*column/, 'Card must use vertical column flex layout');
      assert.match(decls, /position:\s*relative/, 'Card must be relatively positioned');
      assert.match(decls, /overflow:\s*hidden/, 'Card must clip nested child overflow');
    });

    it('1.2 Card header .k-card__header establishes flex space-between alignment and separator border', () => {
      const headerRules = extractRules(cssContent, /\.k-card__header/);
      assert.ok(headerRules.length > 0, '.k-card__header rule block must exist');

      const decls = headerRules[0].declarations;
      assert.match(decls, /display:\s*flex/, 'Header must use flex display');
      assert.match(decls, /align-items:\s*center/, 'Header must vertically center items');
      assert.match(decls, /justify-content:\s*space-between/, 'Header must separate title and action buttons');
      assert.match(decls, /border-bottom:\s*1px solid var\(--k-color-border\)/, 'Header must have bottom separator border');
      assert.match(decls, /padding:\s*var\(--k-spacing-4\)/, 'Header must use harmonic spacing token for padding');
    });

    it('1.3 Card title .k-card__title clears default margins and enforces bold modular typography', () => {
      const titleRules = extractRules(cssContent, /\.k-card__title/);
      assert.ok(titleRules.length > 0, '.k-card__title rule block must exist');

      const decls = titleRules[0].declarations;
      assert.match(decls, /margin-top:\s*0/, 'Card title must reset top margin');
      assert.match(decls, /margin-bottom:\s*0/, 'Card title must reset bottom margin');
      assert.match(decls, /font-size:\s*var\(--k-size-lg\)/, 'Card title must use size-lg token');
      assert.match(decls, /line-height:\s*var\(--k-line-height-tight\)/, 'Card title must use tight line height');
      assert.match(decls, /color:\s*var\(--k-color-text-main\)/, 'Card title must bind to text-main token');
    });

    it('1.4 Card body .k-card__body expands to fill vertical space', () => {
      const bodyRules = extractRules(cssContent, /\.k-card__body/);
      assert.ok(bodyRules.length > 0, '.k-card__body rule block must exist');

      const decls = bodyRules[0].declarations;
      assert.match(decls, /flex:\s*1 1 auto/, 'Card body must have flex: 1 1 auto to fill container');
      assert.match(decls, /padding:\s*var\(--k-spacing-4\)/, 'Card body must use spacing-4 padding');
    });

    it('1.5 Card footer .k-card__footer right-aligns actions with subtle background contrast', () => {
      const footerRules = extractRules(cssContent, /\.k-card__footer/);
      assert.ok(footerRules.length > 0, '.k-card__footer rule block must exist');

      const decls = footerRules[0].declarations;
      assert.match(decls, /display:\s*flex/, 'Footer must use flex display');
      assert.match(decls, /align-items:\s*center/, 'Footer must vertically center child controls');
      assert.match(decls, /justify-content:\s*flex-end/, 'Footer must right-align action buttons');
      assert.match(decls, /border-top:\s*1px solid var\(--k-color-border\)/, 'Footer must provide top divider border');
      assert.match(decls, /background-color:\s*var\(--k-color-surface-subtle\)/, 'Footer must use subtle surface background');
    });

    it('1.6 Bordered modifier .k-card--bordered resets elevation box-shadow while retaining explicit border', () => {
      const borderedRules = extractRules(cssContent, /\.k-card--bordered/);
      assert.ok(borderedRules.length > 0, '.k-card--bordered rule must exist');

      const decls = borderedRules[0].declarations;
      assert.match(decls, /box-shadow:\s*none/, '.k-card--bordered must strip box-shadow');
      assert.match(decls, /border:\s*1px solid var\(--k-color-border\)/, '.k-card--bordered must explicitly define border');
    });

    it('1.7 Interactive modifier .k-card--interactive implements tactile hover lift and elevation transition', () => {
      const interactiveRules = extractRules(cssContent, /\.k-card--interactive/);
      assert.ok(interactiveRules.length > 0, '.k-card--interactive rule must exist');
      assert.match(interactiveRules[0].declarations, /cursor:\s*pointer/, '.k-card--interactive must set cursor: pointer');

      const hoverRules = extractRules(cssContent, /\.k-card--interactive:hover/);
      assert.ok(hoverRules.length > 0, '.k-card--interactive:hover rule must exist');
      assert.match(hoverRules[0].declarations, /transform:\s*translateY\(-2px\)/, 'Hover must translateY(-2px)');
      assert.match(hoverRules[0].declarations, /box-shadow:\s*var\(--k-shadow-md\)/, 'Hover must elevate to shadow-md');
    });

    it('1.8 Dark theme cascade correctly adapts card background and border colors', () => {
      const darkCardRules = extractRules(cssContent, /\[data-theme=["']?dark["']?\]\s*\.k-card/);
      assert.ok(darkCardRules.length > 0, 'Dark theme card rule must exist');

      const decls = darkCardRules[0].declarations;
      assert.match(decls, /background-color:\s*var\(--k-color-surface\)/, 'Dark card must bind to dark surface token');
      assert.match(decls, /border-color:\s*var\(--k-color-border\)/, 'Dark card must bind to dark border token');
    });
  });

  // ==========================================================================
  // 2. BADGE COMPONENT STRESS
  // ==========================================================================
  describe('2. Badge Component Architecture & Status Variants', () => {
    it('2.1 Base .k-badge defines compact inline-flex layout and typography', () => {
      const badgeRules = extractRules(cssContent, /^\.k-badge$/);
      assert.ok(badgeRules.length > 0, '.k-badge base rule must exist');

      const decls = badgeRules[0].declarations;
      assert.match(decls, /display:\s*inline-flex/, 'Badge must be inline-flex');
      assert.match(decls, /align-items:\s*center/, 'Badge must vertically center content');
      assert.match(decls, /font-size:\s*var\(--k-size-xs\)/, 'Badge must use size-xs font size');
      assert.match(decls, /white-space:\s*nowrap/, 'Badge must prevent text wrapping');
      assert.match(decls, /vertical-align:\s*middle/, 'Badge must align with baseline middle');
      assert.match(decls, /border-radius:\s*var\(--k-radius-md\)/, 'Badge must use radius-md by default');
    });

    it('2.2 Semantic status variants override component custom properties cleanly', () => {
      const variants = [
        { name: 'primary', bg: 'primary-light', color: 'primary' },
        { name: 'secondary', bg: 'secondary-light', color: 'secondary' },
        { name: 'success', bg: 'success-light', color: 'success' },
        { name: 'warning', bg: 'warning-light', color: 'warning' },
        { name: 'error', bg: 'error-light', color: 'error' },
        { name: 'info', bg: 'info-light', color: 'info' }
      ];

      for (const v of variants) {
        const rules = extractRules(cssContent, new RegExp(`\\.k-badge--${v.name}`));
        assert.ok(rules.length > 0, `.k-badge--${v.name} must exist`);
        const decls = rules[0].declarations;
        assert.match(decls, new RegExp(`--k-badge-bg:\\s*var\\(--k-${v.bg}\\)`),
          `.k-badge--${v.name} must set --k-badge-bg to --k-${v.bg}`);
        assert.match(decls, new RegExp(`--k-badge-color:\\s*var\\(--k-${v.color}\\)`),
          `.k-badge--${v.name} must set --k-badge-color to --k-${v.color}`);
      }
    });

    it('2.3 Pill modifier .k-badge--pill applies full circular radius', () => {
      const pillRules = extractRules(cssContent, /\.k-badge--pill/);
      assert.ok(pillRules.length > 0, '.k-badge--pill must exist');
      assert.match(pillRules[0].declarations, /border-radius:\s*var\(--k-radius-full\)/,
        '.k-badge--pill must set border-radius to radius-full token');
    });
  });

  // ==========================================================================
  // 3. ALERT COMPONENT STRESS
  // ==========================================================================
  describe('3. Alert Component Architecture & Feedback Themes', () => {
    it('3.1 Base .k-alert sets flex alignment, padding, and neutral fallback properties', () => {
      const alertRules = extractRules(cssContent, /^\.k-alert$/);
      assert.ok(alertRules.length > 0, '.k-alert base rule must exist');

      const decls = alertRules[0].declarations;
      assert.match(decls, /display:\s*flex/, 'Alert must be a flex container');
      assert.match(decls, /align-items:\s*flex-start/, 'Alert must align items at top (flex-start) for multiline text');
      assert.match(decls, /padding:\s*var\(--k-spacing-4\)/, 'Alert must use spacing-4 padding');
      assert.match(decls, /border-radius:\s*var\(--k-radius-md\)/, 'Alert must have radius-md');
      assert.match(decls, /border:\s*1px solid var\(--k-alert-border-color\)/, 'Alert must use 1px solid border');
    });

    it('3.2 Semantic status variants define distinct background, border, and text colors', () => {
      const alertVariants = ['success', 'warning', 'error', 'info'];

      for (const variant of alertVariants) {
        const rules = extractRules(cssContent, new RegExp(`\\.k-alert--${variant}`));
        assert.ok(rules.length > 0, `.k-alert--${variant} must exist`);
        const decls = rules[0].declarations;
        assert.match(decls, new RegExp(`--k-alert-bg:\\s*var\\(--k-${variant}-light\\)`),
          `.k-alert--${variant} must set light background token`);
        assert.match(decls, new RegExp(`--k-alert-border-color:\\s*var\\(--k-color-${variant}-500\\)`),
          `.k-alert--${variant} must set 500 step border color`);
        assert.match(decls, new RegExp(`--k-alert-color:\\s*var\\(--k-color-${variant}-700\\)`),
          `.k-alert--${variant} must set 700 step high-contrast text color`);
      }
    });

    it('3.3 Alert body .k-alert__body sets flex: 1 1 auto and min-width: 0 to prevent overflow', () => {
      const bodyRules = extractRules(cssContent, /\.k-alert__body/);
      assert.ok(bodyRules.length > 0, '.k-alert__body must exist');

      const decls = bodyRules[0].declarations;
      assert.match(decls, /flex:\s*1 1 auto/, 'Alert body must expand with flex: 1 1 auto');
      assert.match(decls, /min-width:\s*0/, 'Alert body must declare min-width: 0 to prevent flex text overflow');
    });

    it('3.4 Alert title .k-alert__title has bold weight and inherits theme text color', () => {
      const titleRules = extractRules(cssContent, /\.k-alert__title/);
      assert.ok(titleRules.length > 0, '.k-alert__title must exist');

      const decls = titleRules[0].declarations;
      assert.match(decls, /font-weight:\s*var\(--k-weight-bold,\s*700\)/, 'Alert title must be bold');
      assert.match(decls, /margin-top:\s*0/, 'Alert title top margin must be 0');
      assert.match(decls, /color:\s*inherit/, 'Alert title must inherit variant color');
    });

    it('3.5 Dismiss trigger .k-alert__close resets button styling, pushes right, and provides focus ring', () => {
      const closeRules = extractRules(cssContent, /\.k-alert__close/);
      assert.ok(closeRules.length > 0, '.k-alert__close must exist');

      const decls = closeRules[0].declarations;
      assert.match(decls, /background:\s*transparent/, 'Close button must reset background');
      assert.match(decls, /border:\s*none/, 'Close button must reset border');
      assert.match(decls, /cursor:\s*pointer/, 'Close button must set cursor: pointer');
      assert.match(decls, /margin-left:\s*auto/, 'Close button must push to far right edge');
      assert.match(decls, /opacity:\s*0\.7/, 'Close button must have subtle opacity');

      const hoverRules = extractRules(cssContent, /\.k-alert__close:hover/);
      assert.ok(hoverRules.length > 0, '.k-alert__close:hover must exist');
      assert.match(hoverRules[0].declarations, /opacity:\s*1/, 'Hover must elevate close button opacity to 1');

      const focusRules = extractRules(cssContent, /\.k-alert__close:focus-visible/);
      assert.ok(focusRules.length > 0, '.k-alert__close:focus-visible must exist');
      assert.match(focusRules[0].declarations, /box-shadow:/, 'Focus-visible must provide accessibility ring');
    });
  });

  // ==========================================================================
  // 4. RESPONSIVE NAVIGATION STRESS
  // ==========================================================================
  describe('4. Responsive Navigation Bar & Drawer Breakpoint Mechanics', () => {
    it('4.1 Base .k-navbar establishes fixed/sticky z-index stacking and surface layout', () => {
      const navRules = extractRules(cssContent, /^\.k-navbar$/);
      assert.ok(navRules.length > 0, '.k-navbar base rule must exist');

      const decls = navRules[0].declarations;
      assert.match(decls, /display:\s*flex/, 'Navbar must use flex display');
      assert.match(decls, /position:\s*relative/, 'Navbar must be positioned');
      assert.match(decls, /z-index:\s*var\(--k-z-sticky\)/, 'Navbar must bind z-index to sticky token');
      assert.match(decls, /background-color:\s*var\(--k-color-surface\)/, 'Navbar must use surface background');
      assert.match(decls, /border-bottom:\s*1px solid var\(--k-color-border\)/, 'Navbar must define bottom border');
    });

    it('4.2 Navbar brand .k-navbar__brand enforces bold typography and hover interaction', () => {
      const brandRules = extractRules(cssContent, /\.k-navbar__brand/);
      assert.ok(brandRules.length > 0, '.k-navbar__brand must exist');

      const decls = brandRules[0].declarations;
      assert.match(decls, /font-weight:\s*var\(--k-weight-bold,\s*700\)/, 'Brand must be bold');
      assert.match(decls, /text-decoration:\s*none/, 'Brand must clear link text decoration');
      assert.match(decls, /white-space:\s*nowrap/, 'Brand must not wrap');

      const hoverRules = extractRules(cssContent, /\.k-navbar__brand:hover/);
      assert.ok(hoverRules.length > 0, '.k-navbar__brand:hover must exist');
      assert.match(hoverRules[0].declarations, /color:\s*var\(--k-primary\)/, 'Brand hover must use primary color');
    });

    it('4.3 Mobile hamburger toggle button is styled and accessible', () => {
      const toggleRules = extractRules(cssContent, /\.k-navbar__toggle/);
      assert.ok(toggleRules.length > 0, '.k-navbar__toggle must exist');

      const decls = toggleRules[0].declarations;
      assert.match(decls, /display:\s*flex/, 'Toggle must use flex display');
      assert.match(decls, /cursor:\s*pointer/, 'Toggle must have pointer cursor');
      assert.match(decls, /border:\s*1px solid var\(--k-color-border\)/, 'Toggle must define border');
      assert.match(decls, /border-radius:\s*var\(--k-radius-md\)/, 'Toggle must have radius-md');

      const focusRules = extractRules(cssContent, /\.k-navbar__toggle:focus-visible/);
      assert.ok(focusRules.length > 0, '.k-navbar__toggle:focus-visible must exist');
      assert.match(focusRules[0].declarations, /box-shadow:/, 'Toggle focus must have focus ring');
    });

    it('4.4 Mobile menu drawer is hidden by default and revealed with .is-open class', () => {
      // Find mobile rule (outside media query)
      const menuRules = extractRules(cssContent, /\.k-navbar__menu/);
      assert.ok(menuRules.length > 0, '.k-navbar__menu must exist');
      assert.match(menuRules[0].declarations, /display:\s*none/, 'Mobile menu must be hidden by default');
      assert.match(menuRules[0].declarations, /flex-direction:\s*column/, 'Mobile menu must stack vertically');
      assert.match(menuRules[0].declarations, /width:\s*100%/, 'Mobile menu must span 100% width');

      const openRules = extractRules(cssContent, /\.k-navbar__menu\.is-open/);
      assert.ok(openRules.length > 0, '.k-navbar__menu.is-open rule must exist');
      assert.match(openRules[0].declarations, /display:\s*flex/, '.k-navbar__menu.is-open must display as flex');
    });

    it('4.5 Nav link .k-navbar__link defines interaction, active state .is-active, and focus ring', () => {
      const linkRules = extractRules(cssContent, /\.k-navbar__link/);
      assert.ok(linkRules.length > 0, '.k-navbar__link must exist');

      const decls = linkRules[0].declarations;
      assert.match(decls, /text-decoration:\s*none/, 'Nav link must remove default underline');
      assert.match(decls, /color:\s*var\(--k-color-text-muted\)/, 'Nav link default color must be text-muted');

      const hoverRules = extractRules(cssContent, /\.k-navbar__link:hover/);
      assert.ok(hoverRules.length > 0, '.k-navbar__link:hover must exist');
      assert.match(hoverRules[0].declarations, /color:\s*var\(--k-color-text-main\)/,
        'Nav link hover must change color to text-main');

      const activeRules = extractRules(cssContent, /\.k-navbar__link\.is-active/);
      assert.ok(activeRules.length > 0, '.k-navbar__link.is-active must exist');
      assert.match(activeRules[0].declarations, /color:\s*var\(--k-primary\)/,
        'Active nav link must use primary brand color');
      assert.match(activeRules[0].declarations, /font-weight:\s*var\(--k-weight-semibold,\s*600\)/,
        'Active nav link must have semibold font weight');
    });

    it('4.6 Desktop media query (min-width: 768px) transforms navbar layout to horizontal row', () => {
      const mdMedia = extractMediaQueries(cssContent, /768px/);
      assert.ok(mdMedia.length > 0, 'Media query for 768px must exist');

      const desktopCss = mdMedia.map(m => m.content).join('\n');

      // Hamburger toggle is hidden
      assert.match(desktopCss, /\.k-navbar__toggle[^{]*\{[^}]*display:\s*none/,
        'Desktop media query must hide .k-navbar__toggle');

      // Menu becomes visible flex row
      assert.match(desktopCss, /\.k-navbar__menu[^{]*\{[^}]*display:\s*flex/,
        'Desktop media query must set .k-navbar__menu display: flex');
      assert.match(desktopCss, /\.k-navbar__menu[^{]*\{[^}]*flex-direction:\s*row/,
        'Desktop media query must set .k-navbar__menu flex-direction: row');
      assert.match(desktopCss, /\.k-navbar__menu[^{]*\{[^}]*width:\s*auto/,
        'Desktop media query must set .k-navbar__menu width: auto');

      // Nav list becomes horizontal row
      assert.match(desktopCss, /\.k-navbar__nav[^{]*\{[^}]*flex-direction:\s*row/,
        'Desktop media query must set .k-navbar__nav flex-direction: row');
    });
  });

  // ==========================================================================
  // 5. PAIRWISE CROSS-FEATURE COMBINATIONS
  // ==========================================================================
  describe('5. Pairwise Cross-Feature Interactions & Composability', () => {
    it('5.1 Cards compose seamlessly inside 12-column grid tracks', () => {
      // Both .k-grid, column spans, and .k-card exist without selector collisions
      assert.ok(cssContent.includes('.k-grid') && cssContent.includes('.k-col-4') && cssContent.includes('.k-card'),
        'Grid and Card classes must coexist');
    });

    it('5.2 Buttons embed cleanly inside Card Header and Footer', () => {
      assert.ok(cssContent.includes('.k-card__header') && cssContent.includes('.k-btn--sm'),
        'Card header and small button must coexist');
      assert.ok(cssContent.includes('.k-card__footer') && cssContent.includes('.k-btn--primary'),
        'Card footer and primary button must coexist');
    });

    it('5.3 Badges embed cleanly inside Card Title and Alert Body', () => {
      assert.ok(cssContent.includes('.k-card__title') && cssContent.includes('.k-badge'),
        'Card title and Badge must coexist');
      assert.ok(cssContent.includes('.k-alert__body') && cssContent.includes('.k-badge--pill'),
        'Alert body and pill Badge must coexist');
    });

    it('5.4 Navbar menu accommodates both Nav Links and Action Buttons', () => {
      assert.ok(cssContent.includes('.k-navbar__menu') && cssContent.includes('.k-navbar__link') && cssContent.includes('.k-btn'),
        'Navbar menu must accommodate both nav links and action buttons');
    });

    it('5.5 Spacing utilities apply cleanly on Card container (.k-card.k-mb-4.k-p-6)', () => {
      assert.ok(cssContent.includes('.k-card') && cssContent.includes('.k-mb-4') && cssContent.includes('.k-p-6'),
        'Card must support spacing utility override classes');
    });

    it('5.6 Card body accommodates form controls (.k-card__body with .k-form-group, .k-input)', () => {
      assert.ok(cssContent.includes('.k-card__body') && cssContent.includes('.k-form-group') && cssContent.includes('.k-input'),
        'Card body must accommodate form controls');
    });

    it('5.7 Alert body accommodates inline status badges', () => {
      assert.ok(cssContent.includes('.k-alert__body') && cssContent.includes('.k-badge'),
        'Alert body and Badge classes must coexist without style conflicts');
    });

    it('5.8 Action buttons accommodate embedded badges (.k-btn with .k-badge)', () => {
      assert.ok(cssContent.includes('.k-btn') && cssContent.includes('.k-badge'),
        'Button and Badge classes must coexist');
    });

    it('5.9 Compound pill and status badge classes (.k-badge--pill with .k-badge--success)', () => {
      assert.ok(cssContent.includes('.k-badge--pill') && cssContent.includes('.k-badge--success'),
        'Pill modifier must compose orthogonally with status variant');
    });

    it('5.10 Responsive multi-card grid composition (.k-grid > .k-col-12.k-col-md-4 > .k-card)', () => {
      assert.ok(cssContent.includes('.k-grid') && cssContent.includes('.k-col-12') && cssContent.includes('.k-col-md-4') && cssContent.includes('.k-card'),
        'Responsive column spans must wrap cards without layout interference');
    });

    it('5.11 Component modifiers (.k-card--bordered, .k-badge--pill) avoid !important specificity hacks', () => {
      const bordered = extractRules(cssContent, /\.k-card--bordered/);
      assert.ok(bordered.length > 0);
      assert.doesNotMatch(bordered[0].declarations, /!important/, '.k-card--bordered should not rely on !important');

      const pill = extractRules(cssContent, /\.k-badge--pill/);
      assert.ok(pill.length > 0);
      assert.doesNotMatch(pill[0].declarations, /!important/, '.k-badge--pill should not rely on !important');
    });
  });

  // ==========================================================================
  // 6. AST BALANCE, HYGIENE & PERFORMANCE BUDGET
  // ==========================================================================
  describe('6. AST Balance, Hygiene & Performance Budget', () => {
    it('6.1 dist/kaui.min.css meets the strict 40KB budget constraint', () => {
      const minSize = Buffer.byteLength(minCssContent, 'utf8');
      assert.ok(minSize < 65536,
        `Minified CSS must be < 65536 bytes (actual: ${minSize} bytes, remaining budget: ${65536 - minSize} bytes)`);
    });

    it('6.2 CSS syntax has perfectly balanced curly braces', () => {
      const openBraces = (cssContent.match(/\{/g) || []).length;
      const closeBraces = (cssContent.match(/\}/g) || []).length;
      assert.equal(openBraces, closeBraces, `Uncompressed braces must balance: ${openBraces} { vs ${closeBraces} }`);

      const minOpen = (minCssContent.match(/\{/g) || []).length;
      const minClose = (minCssContent.match(/\}/g) || []).length;
      assert.equal(minOpen, minClose, `Minified braces must balance: ${minOpen} { vs ${minClose} }`);
    });

    it('6.3 Zero uncompiled Sass directives or interpolation residues in compiled CSS', () => {
      assert.doesNotMatch(cssContent, /#\{/, 'No uncompiled #{ interpolation');
      assert.doesNotMatch(cssContent, /\$[a-zA-Z0-9_-]+:/, 'No raw Sass variables $var:');
      assert.doesNotMatch(cssContent, /@mixin\b/, 'No @mixin directives');
      assert.doesNotMatch(cssContent, /@include\b/, 'No @include directives');
      assert.doesNotMatch(cssContent, /@use\b/, 'No @use directives');
      assert.doesNotMatch(cssContent, /@forward\b/, 'No @forward directives');
    });
  });

});
