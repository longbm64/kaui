/**
 * M6 Adversarial Stress Suite: Final Hardening, Polish & Verification
 *
 * Validates:
 * 1. .k-navbar__toggle span explicit hamburger bar dimensions & styling
 * 2. .k-card explicit multi-property transition interpolation (transform & box-shadow)
 * 3. Root LICENSE file validity, MIT license text, and consistency with package.json
 * 4. demo/demo.js click-outside drawer closing mechanics
 * 5. Production bundle size and clean compilation verification
 */

import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');

const kauiCssPath = path.join(rootDir, 'dist', 'kaui.css');
const kauiMinCssPath = path.join(rootDir, 'dist', 'kaui.min.css');
const licensePath = path.join(rootDir, 'LICENSE');
const packageJsonPath = path.join(rootDir, 'package.json');
const demoJsPath = path.join(rootDir, 'demo', 'demo.js');

const kauiCss = fs.readFileSync(kauiCssPath, 'utf8');
const kauiMinCss = fs.readFileSync(kauiMinCssPath, 'utf8');
const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));
const demoJs = fs.readFileSync(demoJsPath, 'utf8');

function extractRules(css, selectorRegex) {
  const rules = [];
  const rulePattern = /([^{}]+)\{([^}]+)\}/g;
  let match;
  while ((match = rulePattern.exec(css)) !== null) {
    const selector = match[1].trim();
    const declarations = match[2].trim();
    if (selectorRegex.test(selector)) {
      rules.push({ selector, declarations });
    }
  }
  return rules;
}

describe('M6 Adversarial Stress Suite: Hardening & Polish', () => {

  // ==========================================================================
  // Suite 1: Navbar Hamburger Bar Geometry & Toggle Polish
  // ==========================================================================
  describe('1. Navbar Hamburger Bar Geometry & Toggle Polish', () => {
    it('1.1 .k-navbar__toggle span has explicit block display and bar dimensions', () => {
      const spanRules = extractRules(kauiCss, /\.k-navbar__toggle\s+span/);
      assert.ok(spanRules.length > 0, '.k-navbar__toggle span rule must exist in dist/kaui.css');

      const decls = spanRules[0].declarations;
      assert.match(decls, /display:\s*block/, 'Hamburger bar span must have display: block');
      assert.match(decls, /width:\s*1\.25rem/, 'Hamburger bar span must have explicit width of 1.25rem');
      assert.match(decls, /height:\s*2px/, 'Hamburger bar span must have explicit height of 2px');
      assert.match(decls, /background-color:\s*currentColor/, 'Hamburger bar span must inherit currentColor');
      assert.match(decls, /border-radius:\s*var\(--k-radius-full\)/, 'Hamburger bar span must use border-radius full');
      assert.match(decls, /transition:\s*var\(--k-transition-base\)/, 'Hamburger bar span must declare transition');
    });

    it('1.2 .k-navbar__toggle establishes vertical column stacking with gap for hamburger bars', () => {
      const toggleRules = extractRules(kauiCss, /^\.k-navbar__toggle$/);
      assert.ok(toggleRules.length > 0, '.k-navbar__toggle rule must exist');

      const decls = toggleRules[0].declarations;
      assert.match(decls, /flex-direction:\s*column/, 'Toggle must use column direction to stack bars');
      assert.match(decls, /gap:\s*4px/, 'Toggle must have vertical gap between bars');
    });

    it('1.3 .k-navbar__toggle span rules exist in minified CSS', () => {
      assert.match(kauiMinCss, /\.k-navbar__toggle\s*span\{[^}]*width:1\.25rem/,
        'Minified CSS must contain .k-navbar__toggle span with width:1.25rem');
      assert.match(kauiMinCss, /\.k-navbar__toggle\s*span\{[^}]*height:2px/,
        'Minified CSS must contain .k-navbar__toggle span with height:2px');
    });
  });

  // ==========================================================================
  // Suite 2: Card Multi-Property Transition Interpolation
  // ==========================================================================
  describe('2. Card Multi-Property Transition Interpolation', () => {
    it('2.1 Base .k-card explicitly interpolates transform and box-shadow in transition shorthand', () => {
      const cardRules = extractRules(kauiCss, /^\.k-card$/);
      assert.ok(cardRules.length > 0, '.k-card rule must exist');

      const decls = cardRules[0].declarations;
      assert.match(
        decls,
        /transition:\s*transform\s+var\(--k-transition-base\)\s+ease-in-out,\s*box-shadow\s+var\(--k-transition-base\)\s+ease-in-out/,
        'Card transition must explicitly define duration and timing function for both transform and box-shadow'
      );
    });

    it('2.2 Minified CSS preserves both transform and box-shadow transitions on .k-card', () => {
      assert.match(kauiMinCss, /\.k-card\{[^}]*transition:[^}]*transform[^}]*box-shadow/,
        'Minified CSS must preserve transform and box-shadow transition properties');
    });
  });

  // ==========================================================================
  // Suite 3: Root LICENSE File Verification
  // ==========================================================================
  describe('3. Root LICENSE File Verification', () => {
    it('3.1 Root LICENSE file exists and is non-empty', () => {
      assert.ok(fs.existsSync(licensePath), 'Root LICENSE file must exist');
      const stat = fs.statSync(licensePath);
      assert.ok(stat.size > 200, 'LICENSE file must contain substantial content (> 200 bytes)');
    });

    it('3.2 LICENSE content specifies MIT License matching package.json', () => {
      const licenseContent = fs.readFileSync(licensePath, 'utf8');
      assert.match(licenseContent, /^MIT License/m, 'LICENSE must begin with MIT License');
      assert.match(licenseContent, /Copyright \(c\) 2026 KAUI Contributors/, 'LICENSE copyright must match package.json author');
      assert.equal(packageJson.license, 'MIT', 'package.json license must be MIT');
    });
  });

  // ==========================================================================
  // Suite 4: Demo Script Click-Outside Drawer Mechanics
  // ==========================================================================
  describe('4. Demo Script Click-Outside Drawer Mechanics', () => {
    function createMockDOMWithOutside() {
      const listeners = { click: [], DOMContentLoaded: [] };
      const classListStore = new Set();
      const navMenuClasses = new Set();

      const outsideTarget = {
        name: 'outside',
        contains: () => false,
        closest: () => null
      };

      const navToggle = {
        name: 'toggle',
        classList: {
          contains: (cls) => classListStore.has(cls),
          add: (cls) => classListStore.add(cls),
          remove: (cls) => classListStore.delete(cls)
        },
        attributes: { 'aria-expanded': 'false' },
        setAttribute: function (k, v) { this.attributes[k] = String(v); },
        getAttribute: function (k) { return this.attributes[k] || null; },
        clickListeners: [],
        addEventListener: function (type, fn) {
          if (type === 'click') this.clickListeners.push(fn);
        },
        click: function () {
          for (const fn of this.clickListeners) fn({ target: this });
        },
        contains: function (node) { return node === this; }
      };

      const navMenu = {
        name: 'menu',
        classList: {
          contains: (cls) => navMenuClasses.has(cls),
          add: (cls) => navMenuClasses.add(cls),
          remove: (cls) => navMenuClasses.delete(cls),
          toggle: (cls) => {
            if (navMenuClasses.has(cls)) {
              navMenuClasses.delete(cls);
              return false;
            } else {
              navMenuClasses.add(cls);
              return true;
            }
          }
        },
        querySelectorAll: () => [],
        contains: function (node) { return node === this; }
      };

      const doc = {
        documentElement: {
          attributes: {},
          setAttribute: () => {},
          getAttribute: () => null,
          removeAttribute: () => {}
        },
        getElementById: () => null,
        querySelector: (sel) => {
          if (sel === '.k-navbar__toggle') return navToggle;
          if (sel === '.k-navbar__menu') return navMenu;
          return null;
        },
        addEventListener: (type, fn) => {
          if (!listeners[type]) listeners[type] = [];
          listeners[type].push(fn);
        },
        triggerEvent: (type, eventObj) => {
          if (listeners[type]) {
            for (const fn of listeners[type]) fn(eventObj);
          }
        },
        triggerClick: (target) => {
          if (listeners['click']) {
            for (const fn of listeners['click']) {
              fn({ target });
            }
          }
        }
      };

      return {
        document: doc,
        window: { matchMedia: () => ({ matches: false }) },
        localStorage: { getItem: () => null, setItem: () => {} },
        navToggle,
        navMenu,
        outsideTarget,
        triggerDOMContentLoaded: () => doc.triggerEvent('DOMContentLoaded')
      };
    }

    it('4.1 Clicking outside closes open drawer and syncs aria-expanded to false', () => {
      const mock = createMockDOMWithOutside();
      const fn = new Function('document', 'window', 'localStorage', demoJs);
      fn(mock.document, mock.window, mock.localStorage);
      mock.triggerDOMContentLoaded();

      // Open drawer
      mock.navToggle.click();
      assert.equal(mock.navMenu.classList.contains('is-open'), true, 'Menu must be open');
      assert.equal(mock.navToggle.getAttribute('aria-expanded'), 'true');

      // Click outside
      mock.document.triggerClick(mock.outsideTarget);
      assert.equal(mock.navMenu.classList.contains('is-open'), false, 'Menu must be closed after outside click');
      assert.equal(mock.navToggle.getAttribute('aria-expanded'), 'false', 'aria-expanded must be false');
    });

    it('4.2 Clicking inside navMenu when open does not close the drawer', () => {
      const mock = createMockDOMWithOutside();
      const fn = new Function('document', 'window', 'localStorage', demoJs);
      fn(mock.document, mock.window, mock.localStorage);
      mock.triggerDOMContentLoaded();

      // Open drawer
      mock.navToggle.click();
      assert.equal(mock.navMenu.classList.contains('is-open'), true);

      // Click inside navMenu
      mock.document.triggerClick(mock.navMenu);
      assert.equal(mock.navMenu.classList.contains('is-open'), true, 'Menu must remain open when clicking inside');
    });

    it('4.3 Outside click does nothing when drawer is already closed', () => {
      const mock = createMockDOMWithOutside();
      const fn = new Function('document', 'window', 'localStorage', demoJs);
      fn(mock.document, mock.window, mock.localStorage);
      mock.triggerDOMContentLoaded();

      assert.equal(mock.navMenu.classList.contains('is-open'), false);
      mock.document.triggerClick(mock.outsideTarget);
      assert.equal(mock.navMenu.classList.contains('is-open'), false);
    });
  });

  // ==========================================================================
  // Suite 5: Budget Constraint Hardening
  // ==========================================================================
  describe('5. Budget Constraint Hardening', () => {
    it('5.1 dist/kaui.min.css strictly remains under 65,536 bytes', () => {
      const minStat = fs.statSync(kauiMinCssPath);
      assert.ok(
        minStat.size < 65536,
        `Performance budget exceeded: ${minStat.size} bytes >= 65,536 bytes`
      );
    });
  });
});
