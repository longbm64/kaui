/**
 * Adversarial Empirical Stress Test Suite for Milestone 5
 * (Living Styleguide Showcase, Interactive Scripts, and Documentation)
 *
 * Verifies:
 * 1. HTML Semantic & Structural Integrity (demo/index.html)
 * 2. Exhaustive Class Parity & BEM Compliance against dist/kaui.css
 * 3. Responsive Navigation Drawer Mechanics & Breakpoints
 * 4. Dynamic Dark Theme Switching & Variable Inheritance
 * 5. Alert Dismissal Event Delegation & Lifecycle
 * 6. Build Artifacts & Performance Budget Compliance
 */

import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { execSync } from 'node:child_process';

const DEMO_HTML_PATH = path.resolve('demo/index.html');
const DEMO_JS_PATH = path.resolve('demo/demo.js');
const DEMO_CSS_PATH = path.resolve('demo/demo.css');
const DIST_CSS_PATH = path.resolve('dist/kaui.css');
const DIST_MIN_CSS_PATH = path.resolve('dist/kaui.min.css');
const README_PATH = path.resolve('README.md');

assert.ok(fs.existsSync(DEMO_HTML_PATH), `demo/index.html must exist at ${DEMO_HTML_PATH}`);
assert.ok(fs.existsSync(DEMO_JS_PATH), `demo/demo.js must exist at ${DEMO_JS_PATH}`);
assert.ok(fs.existsSync(DEMO_CSS_PATH), `demo/demo.css must exist at ${DEMO_CSS_PATH}`);
assert.ok(fs.existsSync(DIST_CSS_PATH), `dist/kaui.css must exist at ${DIST_CSS_PATH}`);
assert.ok(fs.existsSync(DIST_MIN_CSS_PATH), `dist/kaui.min.css must exist at ${DIST_MIN_CSS_PATH}`);
assert.ok(fs.existsSync(README_PATH), `README.md must exist at ${README_PATH}`);

const demoHtml = fs.readFileSync(DEMO_HTML_PATH, 'utf8');
const demoJs = fs.readFileSync(DEMO_JS_PATH, 'utf8');
const demoCss = fs.readFileSync(DEMO_CSS_PATH, 'utf8');
const kauiCss = fs.readFileSync(DIST_CSS_PATH, 'utf8');
const kauiMinCss = fs.readFileSync(DIST_MIN_CSS_PATH, 'utf8');
const readme = fs.readFileSync(README_PATH, 'utf8');

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

// Lightweight browser environment harness
function createMockDOM() {
  const listeners = { click: [], DOMContentLoaded: [] };
  const storage = {};
  const classListStore = new Set();
  const attributes = {};

  const navToggle = {
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
    }
  };

  const navMenuClasses = new Set();
  const navLinks = [
    {
      clickListeners: [],
      addEventListener: function (type, fn) { if (type === 'click') this.clickListeners.push(fn); },
      click: function () { for (const fn of this.clickListeners) fn({ target: this }); }
    },
    {
      clickListeners: [],
      addEventListener: function (type, fn) { if (type === 'click') this.clickListeners.push(fn); },
      click: function () { for (const fn of this.clickListeners) fn({ target: this }); }
    }
  ];

  const navMenu = {
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
    querySelectorAll: (sel) => sel === '.k-navbar__link' ? navLinks : []
  };

  const themeToggleBtn = {
    innerHTML: '🌙 Dark Mode',
    attributes: {},
    setAttribute: function (k, v) { this.attributes[k] = String(v); },
    getAttribute: function (k) { return this.attributes[k] || null; },
    clickListeners: [],
    addEventListener: function (type, fn) { if (type === 'click') this.clickListeners.push(fn); },
    click: function () { for (const fn of this.clickListeners) fn({ target: this }); }
  };

  const htmlElement = {
    attributes: {},
    setAttribute: function (k, v) { this.attributes[k] = String(v); },
    getAttribute: function (k) { return this.attributes[k] || null; },
    removeAttribute: function (k) { delete this.attributes[k]; }
  };

  const doc = {
    documentElement: htmlElement,
    addEventListener: (type, fn) => {
      if (!listeners[type]) listeners[type] = [];
      listeners[type].push(fn);
    },
    getElementById: (id) => id === 'theme-toggle' ? themeToggleBtn : null,
    querySelector: (sel) => {
      if (sel === '.k-navbar__toggle') return navToggle;
      if (sel === '.k-navbar__menu') return navMenu;
      return null;
    },
    triggerEvent: (type, eventObj) => {
      if (listeners[type]) {
        for (const fn of listeners[type]) fn(eventObj);
      }
    }
  };

  const win = {
    matchMedia: (query) => ({
      matches: query.includes('dark') ? false : true
    })
  };

  const localStorageMock = {
    getItem: (k) => storage[k] || null,
    setItem: (k, v) => { storage[k] = String(v); },
    removeItem: (k) => { delete storage[k]; }
  };

  return {
    document: doc,
    window: win,
    localStorage: localStorageMock,
    navToggle,
    navMenu,
    navLinks,
    themeToggleBtn,
    htmlElement,
    triggerDOMContentLoaded: () => doc.triggerEvent('DOMContentLoaded')
  };
}

function createAlertDOM() {
  const listeners = { click: [], DOMContentLoaded: [] };

  const alerts = [];
  const parent = {
    removeChild: (child) => {
      const idx = alerts.indexOf(child);
      if (idx !== -1) alerts.splice(idx, 1);
      child.parentNode = null;
    }
  };

  function createAlertNode(type) {
    const node = {
      type,
      parentNode: parent,
      style: {},
      closest: function (sel) {
        if (sel === '.k-alert') return this;
        return null;
      }
    };

    const closeBtn = {
      parentNode: node,
      closest: function (sel) {
        if (sel === '.k-alert__close') return this;
        if (sel === '.k-alert') return node;
        return null;
      }
    };

    const closeSpan = {
      parentNode: closeBtn,
      closest: function (sel) {
        if (sel === '.k-alert__close') return closeBtn;
        if (sel === '.k-alert') return node;
        return null;
      }
    };

    node.closeBtn = closeBtn;
    node.closeSpan = closeSpan;
    alerts.push(node);
    return node;
  }

  const doc = {
    documentElement: { attributes: {}, setAttribute: () => {}, removeAttribute: () => {}, getAttribute: () => null },
    getElementById: () => null,
    querySelector: () => null,
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
    createAlertNode,
    alerts,
    parent,
    triggerDOMContentLoaded: () => doc.triggerEvent('DOMContentLoaded')
  };
}

describe('M5 Adversarial Stress Suite: Visual Demo & Interactive Living Documentation', () => {

  // ==========================================================================
  // Suite 1: HTML Semantic & Structural Integrity
  // ==========================================================================
  describe('1. HTML Semantic & Structural Integrity (demo/index.html)', () => {
    it('1.1 Contains substantial markup exceeding 20 KB', () => {
      const stats = fs.statSync(DEMO_HTML_PATH);
      assert.ok(stats.size >= 20480, `demo/index.html size (${stats.size} bytes) must be >= 20 KB`);
    });

    it('1.2 Has valid standard DOCTYPE and html lang attribute', () => {
      assert.match(demoHtml, /<!DOCTYPE\s+html>/i, 'Must specify <!DOCTYPE html>');
      assert.match(demoHtml, /<html\s+lang=["']en["']/i, 'Must specify <html lang="en">');
    });

    it('1.3 Contains essential meta tags (charset UTF-8 and responsive viewport)', () => {
      assert.match(demoHtml, /<meta\s+charset=["']UTF-8["']/i, 'Must define UTF-8 charset');
      assert.match(demoHtml, /<meta\s+name=["']viewport["']\s+content=["'][^"']*width=device-width[^"']*["']/i,
        'Must define responsive viewport meta tag');
    });

    it('1.4 Directly links to compiled Kaui CSS (../dist/kaui.css)', () => {
      assert.match(demoHtml, /<link\s+[^>]*rel=["']stylesheet["'][^>]*href=["'][^"']*dist\/kaui(?:\.min)?\.css["']/,
        'Must link to compiled kaui.css or kaui.min.css');
    });

    it('1.5 Links to demo auxiliary demo.css and deferred demo.js', () => {
      assert.match(demoHtml, /<link\s+[^>]*rel=["']stylesheet["'][^>]*href=["']demo\.css["']/,
        'Must link to demo.css');
      assert.match(demoHtml, /<script\s+[^>]*src=["']demo\.js["'][^>]*defer/,
        'Must link to demo.js with defer attribute');
    });

    it('1.6 All opened tags are correctly balanced with zero unclosed tags', () => {
      const voidElements = new Set([
        'area', 'base', 'br', 'col', 'embed', 'hr', 'img', 'input', 'link', 'meta', 'param', 'source', 'track', 'wbr'
      ]);
      const tagRegex = /<\/?([a-zA-Z0-9]+)(\s+[^>]*)?\/?>/g;
      let match;
      const stack = [];
      const errors = [];

      while ((match = tagRegex.exec(demoHtml)) !== null) {
        const full = match[0];
        const tagName = match[1].toLowerCase();
        const isClosing = full.startsWith('</');
        const isSelfClosing = full.endsWith('/>') || voidElements.has(tagName);

        if (isClosing) {
          if (voidElements.has(tagName)) {
            errors.push(`Void element </${tagName}> should not have closing tag at index ${match.index}`);
          } else {
            const top = stack.pop();
            if (top !== tagName) {
              errors.push(`Mismatched closing tag </${tagName}>, expected </${top}> near index ${match.index}`);
            }
          }
        } else if (!isSelfClosing) {
          stack.push(tagName);
        }
      }

      assert.deepEqual(errors, [], `HTML syntax has mismatched tags: ${errors.join('; ')}`);
      assert.deepEqual(stack, [], `HTML has unclosed tags: ${stack.join(', ')}`);
    });

    it('1.7 All internal navigation anchors (href="#id") match valid declared id elements', () => {
      const hrefRegex = /href=["']#([^"']+)["']/g;
      const idRegex = /id=["']([^"']+)["']/g;

      let m;
      const hrefs = new Set();
      while ((m = hrefRegex.exec(demoHtml)) !== null) {
        hrefs.add(m[1]);
      }

      const ids = new Set();
      while ((m = idRegex.exec(demoHtml)) !== null) {
        ids.add(m[1]);
      }

      const missingIds = [...hrefs].filter(id => !ids.has(id));
      assert.deepEqual(missingIds, [],
        `Found broken internal anchor references targeting non-existent IDs: ${missingIds.join(', ')}`);
    });

    it('1.8 All form controls with id have matching label elements with for attribute', () => {
      const inputIds = [];
      const inputIdRegex = /<(?:input|select|textarea)\s+[^>]*id=["']([^"']+)["'][^>]*>/g;
      let m;
      while ((m = inputIdRegex.exec(demoHtml)) !== null) {
        inputIds.push(m[1]);
      }

      assert.ok(inputIds.length >= 5, `Expected >= 5 form controls with IDs, found ${inputIds.length}`);

      for (const id of inputIds) {
        const labelRegex = new RegExp(`<label\\s+[^>]*for=["']${id}["']`, 'i');
        assert.ok(labelRegex.test(demoHtml), `Form control #${id} must have an associated <label for="${id}">`);
      }
    });
  });

  // ==========================================================================
  // Suite 2: Exhaustive Class Parity & BEM Compliance
  // ==========================================================================
  describe('2. Exhaustive Class Parity & BEM Compliance', () => {
    const classRegex = /class=["']([^"']+)["']/g;
    let m;
    const allClasses = new Set();
    while ((m = classRegex.exec(demoHtml)) !== null) {
      const tokens = m[1].split(/\s+/).filter(Boolean);
      for (const tok of tokens) {
        allClasses.add(tok);
      }
    }

    const kauiClasses = [];
    const demoClasses = [];
    const untrackedClasses = [];

    for (const cls of allClasses) {
      if (cls.startsWith('k-') || cls.startsWith('is-')) {
        kauiClasses.push(cls);
      } else if (cls.startsWith('demo-')) {
        demoClasses.push(cls);
      } else {
        untrackedClasses.push(cls);
      }
    }

    it('2.1 Zero untracked or third-party class names exist in demo/index.html', () => {
      assert.deepEqual(untrackedClasses, [],
        `demo/index.html contains classes outside 'k-*', 'is-*', and 'demo-*': ${untrackedClasses.join(', ')}`);
    });

    it('2.2 Exercises an extensive suite of Kaui classes (>= 100 unique classes)', () => {
      assert.ok(kauiClasses.length >= 100,
        `Expected >= 100 unique Kaui kit classes in demo/index.html, found ${kauiClasses.length}`);
    });

    it('2.3 100% of Kaui classes exist in dist/kaui.css with strict boundary matching', () => {
      const missing = [];
      for (const cls of kauiClasses) {
        const escaped = cls.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&');
        const regex = new RegExp(`\\.${escaped}(?=[\\s:{\\,.\\[>+~]|$)`);
        if (!regex.test(kauiCss)) {
          missing.push(cls);
        }
      }
      assert.deepEqual(missing, [],
        `Found Kaui classes missing from dist/kaui.css: ${missing.join(', ')}`);
    });

    it('2.4 100% of Kaui classes exist in dist/kaui.min.css with strict boundary matching', () => {
      const missing = [];
      for (const cls of kauiClasses) {
        const escaped = cls.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&');
        const regex = new RegExp(`\\.${escaped}(?=[\\s:{\\,.\\[>+~]|$)`);
        if (!regex.test(kauiMinCss)) {
          missing.push(cls);
        }
      }
      assert.deepEqual(missing, [],
        `Found Kaui classes missing from dist/kaui.min.css: ${missing.join(', ')}`);
    });

    it('2.5 100% of demo auxiliary classes exist in demo/demo.css', () => {
      const missing = [];
      for (const cls of demoClasses) {
        const escaped = cls.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&');
        const regex = new RegExp(`\\.${escaped}(?=[\\s:{\\,.\\[>+~]|$)`);
        if (!regex.test(demoCss)) {
          missing.push(cls);
        }
      }
      assert.deepEqual(missing, [],
        `Found demo classes missing from demo/demo.css: ${missing.join(', ')}`);
    });

    it('2.6 All foundational component blocks are represented in the showcase', () => {
      const requiredBlocks = [
        'k-navbar',
        'k-container',
        'k-grid',
        'k-flex',
        'k-btn',
        'k-input',
        'k-select',
        'k-textarea',
        'k-checkbox',
        'k-radio',
        'k-card',
        'k-badge',
        'k-alert'
      ];
      for (const block of requiredBlocks) {
        assert.ok(kauiClasses.includes(block), `Component block .${block} must be showcased`);
      }
    });
  });

  // ==========================================================================
  // Suite 3: Responsive Navigation Drawer Mechanics & Breakpoints
  // ==========================================================================
  describe('3. Responsive Navigation Drawer Mechanics & Breakpoints', () => {
    it('3.1 Mobile drawer toggle mechanics: click toggles .is-open and syncs aria-expanded', () => {
      const mock = createMockDOM();
      const fn = new Function('document', 'window', 'localStorage', demoJs);
      fn(mock.document, mock.window, mock.localStorage);
      mock.triggerDOMContentLoaded();

      // Initial state
      assert.equal(mock.navMenu.classList.contains('is-open'), false);
      assert.equal(mock.navToggle.getAttribute('aria-expanded'), 'false');

      // Click 1: opens drawer
      mock.navToggle.click();
      assert.equal(mock.navMenu.classList.contains('is-open'), true);
      assert.equal(mock.navToggle.getAttribute('aria-expanded'), 'true');

      // Click 2: closes drawer
      mock.navToggle.click();
      assert.equal(mock.navMenu.classList.contains('is-open'), false);
      assert.equal(mock.navToggle.getAttribute('aria-expanded'), 'false');
    });

    it('3.2 Mobile drawer auto-closes when any nav link inside menu is clicked', () => {
      const mock = createMockDOM();
      const fn = new Function('document', 'window', 'localStorage', demoJs);
      fn(mock.document, mock.window, mock.localStorage);
      mock.triggerDOMContentLoaded();

      // Open drawer
      mock.navToggle.click();
      assert.equal(mock.navMenu.classList.contains('is-open'), true);
      assert.equal(mock.navToggle.getAttribute('aria-expanded'), 'true');

      // Click link inside menu
      mock.navLinks[0].click();
      assert.equal(mock.navMenu.classList.contains('is-open'), false);
      assert.equal(mock.navToggle.getAttribute('aria-expanded'), 'false');
    });

    it('3.3 Rapid multi-click toggling maintains exact binary state consistency', () => {
      const mock = createMockDOM();
      const fn = new Function('document', 'window', 'localStorage', demoJs);
      fn(mock.document, mock.window, mock.localStorage);
      mock.triggerDOMContentLoaded();

      for (let i = 1; i <= 10; i++) {
        mock.navToggle.click();
        const shouldBeOpen = (i % 2 === 1);
        assert.equal(mock.navMenu.classList.contains('is-open'), shouldBeOpen);
        assert.equal(mock.navToggle.getAttribute('aria-expanded'), shouldBeOpen ? 'true' : 'false');
      }
    });

    it('3.4 Mobile drawer CSS rules: display: none by default, display: flex with .is-open', () => {
      assert.match(kauiCss, /\.k-navbar__menu\s*\{[^}]*display:\s*none;/,
        '.k-navbar__menu must be display: none by default on mobile');
      assert.match(kauiCss, /\.k-navbar__menu\.is-open\s*\{[^}]*display:\s*flex;/,
        '.k-navbar__menu.is-open must force display: flex');
    });

    it('3.5 Desktop breakpoint (min-width: 768px): hides toggle and forces menu display: flex', () => {
      const mdQueries = extractMediaQueries(kauiCss, /768px/);
      assert.ok(mdQueries.length > 0, 'Must have @media (min-width: 768px) query in compiled CSS');

      let foundToggleNone = false;
      let foundMenuFlex = false;

      for (const mq of mdQueries) {
        if (/\.k-navbar__toggle\s*\{[^}]*display:\s*none/s.test(mq.content)) {
          foundToggleNone = true;
        }
        if (/\.k-navbar__menu\s*\{[^}]*display:\s*flex/s.test(mq.content)) {
          foundMenuFlex = true;
        }
      }

      assert.ok(foundToggleNone, 'Desktop media query must hide .k-navbar__toggle');
      assert.ok(foundMenuFlex, 'Desktop media query must display .k-navbar__menu as flex');
    });
  });

  // ==========================================================================
  // Suite 4: Dynamic Dark Theme Switching & Variable Inheritance
  // ==========================================================================
  describe('4. Dynamic Dark Theme Switching & Variable Inheritance', () => {
    it('4.1 Toggling theme button switches data-theme between undefined and "dark"', () => {
      const mock = createMockDOM();
      const fn = new Function('document', 'window', 'localStorage', demoJs);
      fn(mock.document, mock.window, mock.localStorage);
      mock.triggerDOMContentLoaded();

      // Initial state: light
      assert.equal(mock.htmlElement.getAttribute('data-theme'), null);
      assert.match(mock.themeToggleBtn.innerHTML, /Dark/);

      // Click 1: dark mode
      mock.themeToggleBtn.click();
      assert.equal(mock.htmlElement.getAttribute('data-theme'), 'dark');
      assert.match(mock.themeToggleBtn.innerHTML, /Light/);
      assert.equal(mock.localStorage.getItem('kaui-theme'), 'dark');

      // Click 2: light mode
      mock.themeToggleBtn.click();
      assert.equal(mock.htmlElement.getAttribute('data-theme'), null);
      assert.match(mock.themeToggleBtn.innerHTML, /Dark/);
      assert.equal(mock.localStorage.getItem('kaui-theme'), 'light');
    });

    it('4.2 Restores dark mode from localStorage on initial page load', () => {
      const mock = createMockDOM();
      mock.localStorage.setItem('kaui-theme', 'dark');

      const fn = new Function('document', 'window', 'localStorage', demoJs);
      fn(mock.document, mock.window, mock.localStorage);
      mock.triggerDOMContentLoaded();

      assert.equal(mock.htmlElement.getAttribute('data-theme'), 'dark');
      assert.match(mock.themeToggleBtn.innerHTML, /Light/);
    });

    it('4.3 Falls back to system prefers-color-scheme: dark if no localStorage key is set', () => {
      const mock = createMockDOM();
      mock.window.matchMedia = (query) => ({
        matches: query.includes('(prefers-color-scheme: dark)')
      });

      const fn = new Function('document', 'window', 'localStorage', demoJs);
      fn(mock.document, mock.window, mock.localStorage);
      mock.triggerDOMContentLoaded();

      assert.equal(mock.htmlElement.getAttribute('data-theme'), 'dark');
      assert.match(mock.themeToggleBtn.innerHTML, /Light/);
    });

    it('4.4 Gracefully handles SecurityError when localStorage is blocked (private mode)', () => {
      const mock = createMockDOM();
      const throwingStorage = {
        getItem: () => { throw new Error('SecurityError: Access is denied for this document'); },
        setItem: () => { throw new Error('SecurityError: Access is denied for this document'); }
      };

      const fn = new Function('document', 'window', 'localStorage', demoJs);
      assert.doesNotThrow(() => {
        fn(mock.document, mock.window, throwingStorage);
        mock.triggerDOMContentLoaded();
        mock.themeToggleBtn.click();
      }, 'Script must not crash when localStorage access is restricted');

      assert.equal(mock.htmlElement.getAttribute('data-theme'), 'dark');
    });

    it('4.5 [data-theme="dark"] redefines all critical surface, text, and border tokens', () => {
      const darkMatch = kauiCss.match(/\[data-theme=["']?dark["']?\]\s*\{([^}]+)\}/);
      assert.ok(darkMatch, 'Compiled CSS must contain [data-theme="dark"] block');
      const declarations = darkMatch[1];

      assert.match(declarations, /--k-color-surface:\s*#[0-9a-fA-F]+/, 'Must redefine --k-color-surface');
      assert.match(declarations, /--k-color-surface-subtle:\s*#[0-9a-fA-F]+/, 'Must redefine --k-color-surface-subtle');
      assert.match(declarations, /--k-color-text-main:\s*#[0-9a-fA-F]+/, 'Must redefine --k-color-text-main');
      assert.match(declarations, /--k-color-text-muted:\s*#[0-9a-fA-F]+/, 'Must redefine --k-color-text-muted');
      assert.match(declarations, /--k-color-border:\s*#[0-9a-fA-F]+/, 'Must redefine --k-color-border');
      assert.match(declarations, /--k-bg:\s*var\(--k-color-surface\)/, 'Must map --k-bg to surface');
      assert.match(declarations, /--k-text:\s*var\(--k-color-text-main\)/, 'Must map --k-text to text-main');
    });

    it('4.6 Components correctly bind to theme tokens for automatic dark mode inheritance', () => {
      assert.match(kauiCss, /\.k-card\s*\{[^}]*background-color:\s*var\(--k-card-bg\)/,
        '.k-card must bind background-color to var(--k-card-bg)');
      assert.match(kauiCss, /\.k-navbar\s*\{[^}]*background-color:\s*var\(--k-color-surface\)/,
        '.k-navbar must bind background-color to var(--k-color-surface)');
      assert.match(kauiCss, /\.k-input,\s*\.k-select,\s*\.k-textarea\s*\{[^}]*--k-input-bg:\s*var\(--k-color-surface\)/,
        '.k-input must bind --k-input-bg to var(--k-color-surface)');
    });
  });

  // ==========================================================================
  // Suite 5: Alert Dismissal Event Delegation & Lifecycle
  // ==========================================================================
  describe('5. Alert Dismissal Event Delegation & Lifecycle', () => {
    it('5.1 Clicking .k-alert__close applies fade transition and removes element after 200ms', async () => {
      const mock = createAlertDOM();
      const alert1 = mock.createAlertNode('k-alert--success');
      assert.equal(mock.alerts.length, 1);

      const fn = new Function('document', 'window', 'localStorage', demoJs);
      fn(mock.document, mock.window, mock.localStorage);
      mock.triggerDOMContentLoaded();

      // Trigger click on close button
      mock.document.triggerClick(alert1.closeBtn);

      // Verify styling applied immediately
      assert.equal(alert1.style.opacity, '0');
      assert.equal(alert1.style.transform, 'scale(0.96)');
      assert.ok(alert1.style.transition.includes('opacity'));

      // Wait 250ms for setTimeout to fire
      await new Promise(resolve => setTimeout(resolve, 250));

      assert.equal(mock.alerts.length, 0, 'Alert must be removed from DOM after timeout');
      assert.equal(alert1.parentNode, null);
    });

    it('5.2 Event delegation correctly handles clicking inner span inside .k-alert__close', async () => {
      const mock = createAlertDOM();
      const alert2 = mock.createAlertNode('k-alert--error');
      assert.equal(mock.alerts.length, 1);

      const fn = new Function('document', 'window', 'localStorage', demoJs);
      fn(mock.document, mock.window, mock.localStorage);
      mock.triggerDOMContentLoaded();

      // Click nested span inside close button
      mock.document.triggerClick(alert2.closeSpan);

      assert.equal(alert2.style.opacity, '0');

      await new Promise(resolve => setTimeout(resolve, 250));
      assert.equal(mock.alerts.length, 0);
    });

    it('5.3 Clicking non-alert elements does not trigger any DOM removal or error', async () => {
      const mock = createAlertDOM();
      const alert3 = mock.createAlertNode('k-alert--info');
      assert.equal(mock.alerts.length, 1);

      const fn = new Function('document', 'window', 'localStorage', demoJs);
      fn(mock.document, mock.window, mock.localStorage);
      mock.triggerDOMContentLoaded();

      const unrelatedElement = {
        closest: () => null
      };

      mock.document.triggerClick(unrelatedElement);
      assert.equal(mock.alerts.length, 1);
      assert.equal(alert3.style.opacity, undefined);
    });
  });

  // ==========================================================================
  // Suite 6: Build Artifacts & Performance Budget
  // ==========================================================================
  describe('6. Build Artifacts & Performance Budget Compliance', () => {
    it('6.1 Recompilation via npm run build exits with code 0', () => {
      const output = execSync('npm run build', { encoding: 'utf8' });
      assert.ok(output.includes('build:css:dev'), 'Must run dev build');
      assert.ok(output.includes('build:css:prod'), 'Must run prod build');
    });

    it('6.2 Compressed dist/kaui.min.css strictly meets the < 64 KB performance budget', () => {
      const stats = fs.statSync(DIST_MIN_CSS_PATH);
      const budgetBytes = 64 * 1024; // 65,536 bytes
      assert.ok(stats.size <= budgetBytes,
        `dist/kaui.min.css size (${stats.size} bytes) must be <= 65,536 bytes budget`);
    });

    it('6.3 Uncompressed dist/kaui.css size is substantial (> 30 KB)', () => {
      const stats = fs.statSync(DIST_CSS_PATH);
      assert.ok(stats.size >= 30720,
        `dist/kaui.css size (${stats.size} bytes) must be >= 30 KB`);
    });

    it('6.4 Source maps exist and are valid JSON for both artifacts', () => {
      const devMapPath = path.resolve('dist/kaui.css.map');
      const prodMapPath = path.resolve('dist/kaui.min.css.map');

      assert.ok(fs.existsSync(devMapPath), 'dist/kaui.css.map must exist');
      assert.ok(fs.existsSync(prodMapPath), 'dist/kaui.min.css.map must exist');

      const devMapJson = JSON.parse(fs.readFileSync(devMapPath, 'utf8'));
      const prodMapJson = JSON.parse(fs.readFileSync(prodMapPath, 'utf8'));

      assert.equal(devMapJson.version, 3, 'Dev map must be source map v3');
      assert.equal(prodMapJson.version, 3, 'Prod map must be source map v3');
    });

    it('6.5 Zero residual uncompiled SCSS expressions (#{}, $k-*, @mixin, @use) in dist/kaui.css', () => {
      assert.doesNotMatch(kauiCss, /#\{[^}]+\}/, 'Zero residual interpolation #{}');
      assert.doesNotMatch(kauiCss, /\$k-[a-zA-Z0-9_-]+:/, 'Zero residual Sass variable declarations');
      assert.doesNotMatch(kauiCss, /@mixin\b/, 'Zero residual @mixin directives');
      assert.doesNotMatch(kauiCss, /@include\b/, 'Zero residual @include directives');
      assert.doesNotMatch(kauiCss, /@use\b/, 'Zero residual @use directives');
      assert.doesNotMatch(kauiCss, /@forward\b/, 'Zero residual @forward directives');
    });
  });
});
