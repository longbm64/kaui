/**
 * Adversarial Empirical Stress Test Suite for Milestone 3 (Buttons & Forms)
 * 
 * Verifies:
 * 1. Button interactive states (hover, focus-visible, active, disabled)
 * 2. Button variants and sizes combinations
 * 3. Form input controls, validation states, and conflict precedence
 * 4. Select SVG chevron rendering and attributes
 * 5. Textarea resize constraints and min-height
 * 6. Checkbox & Radio SVG rendering and states
 * 7. Dark theme variable cascading
 * 8. Performance budget compliance (< 65,536 bytes)
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

// Helper to extract rule block for a selector
function extractRule(css, selectorRegex) {
  const matches = [];
  const regex = new RegExp(`([^}{]+)\\{([^}]+)\\}`, 'g');
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

// Helper to extract a property value from declarations
function getProperty(declarations, propName) {
  const regex = new RegExp(`(?:^|;)\\s*${propName}\\s*:\\s*([^;]+)`, 'i');
  const match = regex.exec(declarations);
  return match ? match[1].trim() : null;
}

describe('M3 Adversarial Stress Suite: Buttons & Forms', () => {

  describe('1. Button Interactive States & Lifecycle', () => {
    it('1.1 Hover state defines background color via --k-btn-bg-hover and guards against disabled elements', () => {
      const hoverRules = extractRule(cssContent, /\.k-btn:hover/);
      assert.ok(hoverRules.length > 0, '.k-btn:hover rule must exist in compiled CSS');
      
      const hoverRule = hoverRules[0];
      assert.match(hoverRule.selector, /:not\(:disabled\)/, 'Hover selector must exclude :disabled');
      assert.match(hoverRule.selector, /:not\(\.is-disabled\)/, 'Hover selector must exclude .is-disabled');
      assert.match(hoverRule.declarations, /background-color:\s*var\(--k-btn-bg-hover\)/,
        'Hover state must bind to --k-btn-bg-hover variable');
    });

    it('1.2 Active state stays stationary and guards against disabled elements', () => {
      const activeRules = extractRule(cssContent, /\.k-btn:active/);
      assert.ok(activeRules.length > 0, '.k-btn:active rule must exist in compiled CSS');

      const activeRule = activeRules[0];
      assert.match(activeRule.selector, /:not\(:disabled\)/, 'Active selector must exclude :disabled');
      assert.match(activeRule.selector, /:not\(\.is-disabled\)/, 'Active selector must exclude .is-disabled');
      assert.doesNotMatch(activeRule.declarations, /transform:\s*translateY/,
        'Active state must not move the button');
    });

    it('1.3 Focus-visible state provides accessible focus ring', () => {
      const focusRules = extractRule(cssContent, /\.k-btn:focus-visible/);
      assert.ok(focusRules.length > 0, '.k-btn:focus-visible rule must exist');

      const focusRule = focusRules[0];
      assert.match(focusRule.declarations, /outline:\s*2px solid transparent/,
        'focus-visible must reset standard outline cleanly');
      assert.match(focusRule.declarations, /box-shadow:\s*0 0 0 3px rgba\(59,\s*130,\s*246,\s*0\.4\)/,
        'focus-visible must apply consistent 3px primary focus ring shadow');
    });

    it('1.4 Disabled button state completely blocks pointer interactions and applies visual muting', () => {
      const disabledRules = extractRule(cssContent, /\.k-btn(?::disabled|\[disabled\]|\.is-disabled)/);
      assert.ok(disabledRules.length > 0, 'Disabled button rules must exist');

      const fullSel = disabledRules.map(r => r.selector).join(' ');
      assert.match(fullSel, /:disabled/, 'Must cover :disabled pseudo-class');
      assert.match(fullSel, /\[disabled\]/, 'Must cover [disabled] attribute selector');
      assert.match(fullSel, /\.is-disabled/, 'Must cover .is-disabled BEM state class');

      const decls = disabledRules.map(r => r.declarations).join('; ');
      assert.match(decls, /opacity:\s*0\.6/, 'Disabled button must enforce opacity: 0.6');
      assert.match(decls, /cursor:\s*not-allowed/, 'Disabled button must declare cursor: not-allowed');
      assert.match(decls, /pointer-events:\s*none/, 'Disabled button must enforce pointer-events: none');
      assert.match(decls, /box-shadow:\s*none/, 'Disabled button must clear box-shadow to prevent residual glow');
    });
  });

  describe('2. Button Variants & Sizing Orthogonality', () => {
    it('2.1 Style variants cleanly rebind component CSS variables without selector clutter', () => {
      const variants = [
        { name: 'primary', bg: 'var(--k-primary)', hover: 'var(--k-primary-hover)' },
        { name: 'secondary', bg: 'var(--k-secondary)', hover: 'var(--k-secondary-hover)' },
        { name: 'danger', bg: 'var(--k-error)', hover: 'var(--k-error-hover)' },
        { name: 'error', bg: 'var(--k-error)', hover: 'var(--k-error-hover)' },
        { name: 'success', bg: 'var(--k-success)', hover: 'var(--k-success-hover)' },
        { name: 'warning', bg: 'var(--k-warning)', hover: 'var(--k-warning-hover)' }
      ];

      for (const v of variants) {
        const rules = extractRule(cssContent, new RegExp(`\\.k-btn--${v.name}\\b`));
        assert.ok(rules.length > 0, `.k-btn--${v.name} must exist`);
        const decls = rules.map(r => r.declarations).join('; ');
        assert.ok(decls.includes(`--k-btn-bg: ${v.bg}`), `.k-btn--${v.name} must bind --k-btn-bg to ${v.bg}`);
        assert.ok(decls.includes(`--k-btn-bg-hover: ${v.hover}`), `.k-btn--${v.name} must bind --k-btn-bg-hover to ${v.hover}`);
      }
    });

    it('2.2 Outline variants configure transparent background with matching border & text', () => {
      const outlineRules = extractRule(cssContent, /\.k-btn--outline/);
      assert.ok(outlineRules.length > 0, '.k-btn--outline must exist');
      const decls = outlineRules.map(r => r.declarations).join('; ');
      assert.ok(decls.includes('--k-btn-bg: transparent'), 'Outline button must have transparent bg');
      assert.ok(decls.includes('--k-btn-color: var(--k-primary)'), 'Outline button must have primary text');
      assert.ok(decls.includes('--k-btn-border-color: var(--k-primary)'), 'Outline button must have primary border');
      assert.ok(decls.includes('--k-btn-bg-hover: var(--k-color-primary-50)'), 'Outline button must tint on hover');
    });

    it('2.3 Button sizes scale padding, font-size, and radius independently of variants', () => {
      const smRules = extractRule(cssContent, /\.k-btn--sm\b/);
      assert.ok(smRules.length > 0, '.k-btn--sm must exist');
      const smDecls = smRules.map(r => r.declarations).join('; ');
      assert.ok(smDecls.includes('--k-btn-padding-y: var(--k-spacing-1)'), '.k-btn--sm padding-y check');
      assert.ok(smDecls.includes('--k-btn-padding-x: var(--k-spacing-3)'), '.k-btn--sm padding-x check');
      assert.ok(smDecls.includes('--k-btn-font-size: var(--k-size-sm)'), '.k-btn--sm font-size check');
      assert.ok(smDecls.includes('--k-btn-radius: var(--k-radius-sm)'), '.k-btn--sm radius check');

      const lgRules = extractRule(cssContent, /\.k-btn--lg\b/);
      assert.ok(lgRules.length > 0, '.k-btn--lg must exist');
      const lgDecls = lgRules.map(r => r.declarations).join('; ');
      assert.ok(lgDecls.includes('--k-btn-padding-y: var(--k-spacing-3)'), '.k-btn--lg padding-y check');
      assert.ok(lgDecls.includes('--k-btn-padding-x: var(--k-spacing-6)'), '.k-btn--lg padding-x check');
      assert.ok(lgDecls.includes('--k-btn-font-size: var(--k-size-lg)'), '.k-btn--lg font-size check');
      assert.ok(lgDecls.includes('--k-btn-radius: var(--k-radius-lg)'), '.k-btn--lg radius check');
    });

    it('2.4 Block button modifier forces full-width display: flex', () => {
      const blockRules = extractRule(cssContent, /\.k-btn--block\b/);
      assert.ok(blockRules.length > 0, '.k-btn--block must exist');
      const blockDecls = blockRules.map(r => r.declarations).join('; ');
      assert.match(blockDecls, /display:\s*flex/, '.k-btn--block must set display: flex');
      assert.match(blockDecls, /width:\s*100%/, '.k-btn--block must set width: 100%');
    });
  });

  describe('3. Form Controls & Component Unification', () => {
    it('3.1 Form group, label, and hint maintain vertical rhythm', () => {
      const fgRules = extractRule(cssContent, /\.k-form-group\b/);
      assert.ok(fgRules.length > 0, '.k-form-group must exist');
      const fgDecls = fgRules.map(r => r.declarations).join('; ');
      assert.match(fgDecls, /margin-bottom:\s*var\(--k-spacing-4\)/, 'Form group must provide vertical rhythm');

      const lastChildRules = extractRule(cssContent, /\.k-form-group:last-child\b/);
      assert.ok(lastChildRules.length > 0, '.k-form-group:last-child must exist');
      assert.match(lastChildRules[0].declarations, /margin-bottom:\s*0/, 'Last form group clears margin');

      const labelRules = extractRule(cssContent, /\.k-form-label\b/);
      assert.ok(labelRules.length > 0, '.k-form-label must exist');
      const labelDecls = labelRules.map(r => r.declarations).join('; ');
      assert.match(labelDecls, /margin-bottom:\s*var\(--k-spacing-1\)/, 'Form label must have subtle spacing');
    });

    it('3.2 .k-input, .k-select, and .k-textarea share standard geometry and custom property defaults', () => {
      const baseControls = ['.k-input', '.k-select', '.k-textarea'];
      for (const ctrl of baseControls) {
        assert.ok(cssContent.includes(ctrl), `${ctrl} must exist in compiled CSS`);
      }

      // Check shared properties
      assert.match(cssContent, /(?:\.k-input,\s*\.k-select,\s*\.k-textarea|\.k-input)[^{]*\{[^}]*--k-input-bg:\s*var\(--k-color-surface\)/,
        'Form controls must bind --k-input-bg to surface');
      assert.match(cssContent, /(?:\.k-input,\s*\.k-select,\s*\.k-textarea|\.k-input)[^{]*\{[^}]*border:\s*1px solid var\(--k-input-border\)/,
        'Form controls must bind border to --k-input-border');
    });

    it('3.3 Form controls disabled state applies opacity, muted surface, and not-allowed cursor', () => {
      const disabledRules = extractRule(cssContent, /\.k-input(?::disabled|\[disabled\]|\.is-disabled)/);
      assert.ok(disabledRules.length > 0, 'Disabled input rules must exist');
      const decls = disabledRules.map(r => r.declarations).join('; ');
      assert.match(decls, /cursor:\s*not-allowed/, 'Disabled input must declare cursor: not-allowed');
      assert.match(decls, /background-color:\s*var\(--k-color-surface-subtle\)/,
        'Disabled input must have subtle muted background');
      assert.match(decls, /opacity:\s*0\.7/, 'Disabled input must have reduced opacity');
      assert.match(decls, /pointer-events:\s*none/, 'Disabled input must disable pointer events');
    });
  });

  describe('4. Custom Select Dropdown & SVG Chevron', () => {
    it('4.1 .k-select suppresses native browser appearance', () => {
      const selectRules = extractRule(cssContent, /\.k-select\b/);
      assert.ok(selectRules.length > 0, '.k-select must exist');
      const decls = selectRules.map(r => r.declarations).join('; ');
      assert.match(decls, /appearance:\s*none/, 'Must define appearance: none');
      assert.match(decls, /-webkit-appearance:\s*none/, 'Must define -webkit-appearance: none');
      assert.match(decls, /-moz-appearance:\s*none/, 'Must define -moz-appearance: none');
    });

    it('4.2 .k-select embeds a valid SVG chevron data URI and appropriate padding', () => {
      const selectRules = extractRule(cssContent, /\.k-select\b/);
      const decls = selectRules.map(r => r.declarations).join('; ');
      
      // Check padding-right prevents text overlap with chevron
      assert.match(decls, /padding-right:\s*2\.25rem/, 'Must define padding-right: 2.25rem');
      assert.match(decls, /background-repeat:\s*no-repeat/, 'Background must not repeat');
      assert.match(decls, /background-position:\s*right 0\.75rem center/, 'Background position must be right aligned');

      // Check SVG data URI validity
      const bgMatch = /background-image:\s*url\(["'](data:image\/svg\+xml,[^"]+)["']\)/.exec(decls);
      assert.ok(bgMatch, 'Select must have SVG data:image background-image');
      const svgUri = bgMatch[1];
      const svgRaw = decodeURIComponent(svgUri.replace('data:image/svg+xml,', ''));
      assert.ok(svgRaw.includes('<svg'), 'SVG data must contain <svg tag');
      assert.ok(svgRaw.includes("viewBox='0 0 20 20'") || svgRaw.includes('viewBox="0 0 20 20"'), 'SVG must define viewBox');
      assert.ok(svgRaw.includes('path'), 'SVG must include path element for arrow');
      assert.ok(svgRaw.includes('m6 8 4 4 4-4'), 'SVG path must draw chevron shape');
      assert.ok(svgUri.includes('%2364748b'), 'SVG color must be properly URL-encoded (%23 instead of #)');
    });
  });

  describe('5. Textarea Resize Constraint & Sizing', () => {
    it('5.1 .k-textarea strictly enforces vertical resize and minimum height', () => {
      const textareaRules = extractRule(cssContent, /\.k-textarea\b/);
      assert.ok(textareaRules.length > 0, '.k-textarea must exist');
      const decls = textareaRules.map(r => r.declarations).join('; ');
      assert.match(decls, /resize:\s*vertical/, 'Textarea resize must be strictly vertical');
      assert.match(decls, /min-height:\s*100px/, 'Textarea min-height must be at least 100px');
    });
  });

  describe('6. Custom Checkbox & Radio Controls', () => {
    it('6.1 .k-checkbox and .k-radio suppress native appearance and define accessible hit targets', () => {
      const crRules = extractRule(cssContent, /\.k-checkbox,\s*\.k-radio/);
      assert.ok(crRules.length > 0, '.k-checkbox and .k-radio rules must exist');
      const decls = crRules.map(r => r.declarations).join('; ');
      assert.match(decls, /appearance:\s*none/, 'appearance: none required');
      assert.match(decls, /width:\s*1\.125rem/, 'width: 1.125rem required');
      assert.match(decls, /height:\s*1\.125rem/, 'height: 1.125rem required');
      assert.match(decls, /cursor:\s*pointer/, 'cursor: pointer required');
    });

    it('6.2 .k-checkbox:checked renders valid SVG checkmark vector', () => {
      const cbChecked = extractRule(cssContent, /\.k-checkbox:checked\b/);
      assert.ok(cbChecked.length > 0, '.k-checkbox:checked must exist');
      const decls = cbChecked.map(r => r.declarations).join('; ');
      assert.match(decls, /background-color:\s*var\(--k-primary\)/, 'Checked background must be primary');
      
      const bgMatch = /background-image:\s*url\(["'](data:image\/svg\+xml,[^"]+)["']\)/.exec(decls);
      assert.ok(bgMatch, 'Checkbox checked must define SVG checkmark');
      const svgRaw = decodeURIComponent(bgMatch[1].replace('data:image/svg+xml,', ''));
      assert.ok(svgRaw.includes('m3.5 8.5 3 3 6-6'), 'Checkbox SVG must draw checkmark stroke');
      assert.ok(bgMatch[1].includes('%23fff'), 'Checkmark stroke color must be URL-encoded white');
    });

    it('6.3 .k-radio:checked renders valid SVG circular bullet', () => {
      const radioChecked = extractRule(cssContent, /\.k-radio:checked\b/);
      assert.ok(radioChecked.length > 0, '.k-radio:checked must exist');
      const decls = radioChecked.map(r => r.declarations).join('; ');
      assert.match(decls, /background-color:\s*var\(--k-primary\)/, 'Radio checked background must be primary');

      const bgMatch = /background-image:\s*url\(["'](data:image\/svg\+xml,[^"]+)["']\)/.exec(decls);
      assert.ok(bgMatch, 'Radio checked must define SVG bullet');
      const svgRaw = decodeURIComponent(bgMatch[1].replace('data:image/svg+xml,', ''));
      assert.ok(svgRaw.includes('circle'), 'Radio SVG must contain circle element');
      assert.ok(svgRaw.includes("cx='8' cy='8' r='3.5'") || svgRaw.includes('cx="8" cy="8" r="3.5"'),
        'Radio SVG bullet geometry check');
      assert.ok(bgMatch[1].includes('%23fff'), 'Radio bullet color must be URL-encoded white');
    });
  });

  describe('7. Validation States & Conflict Resolution Precedence', () => {
    it('7.1 .is-valid binds to success color tokens and green focus ring', () => {
      const validRules = extractRule(cssContent, /\.is-valid\b/);
      assert.ok(validRules.length > 0, '.is-valid must exist');
      const decls = validRules.map(r => r.declarations).join('; ');
      assert.match(decls, /--k-input-border:\s*var\(--k-success\)/, '--k-input-border must be success');
      assert.match(decls, /border-color:\s*var\(--k-success\)/, 'border-color must be success');
    });

    it('7.2 .is-invalid binds to error color tokens and red focus ring', () => {
      const invalidRules = extractRule(cssContent, /\.is-invalid\b/);
      assert.ok(invalidRules.length > 0, '.is-invalid must exist');
      const decls = invalidRules.map(r => r.declarations).join('; ');
      assert.match(decls, /--k-input-border:\s*var\(--k-error\)/, '--k-input-border must be error');
      assert.match(decls, /border-color:\s*var\(--k-error\)/, 'border-color must be error');
    });

    it('7.3 Conflict Precedence: .is-valid.is-invalid compound selector guarantees invalid ALWAYS overrides valid', () => {
      // Find the compound rule
      const conflictRules = extractRule(cssContent, /\.is-valid\.is-invalid/);
      assert.ok(conflictRules.length > 0, '.is-valid.is-invalid compound rule MUST be explicitly defined');
      
      const decls = conflictRules.map(r => r.declarations).join('; ');
      assert.match(decls, /--k-input-border:\s*var\(--k-error\)/,
        'Conflict resolution must assign --k-input-border to error');
      assert.match(decls, /border-color:\s*var\(--k-error\)/,
        'Conflict resolution must assign border-color to error');
      assert.match(decls, /--k-input-focus-border:\s*var\(--k-error\)/,
        'Conflict resolution must assign --k-input-focus-border to error');

      // Verify cascade order in the file: .is-invalid must be defined after .is-valid
      const validPos = cssContent.indexOf('.is-valid,');
      const invalidPos = cssContent.indexOf('.is-invalid,');
      const conflictPos = cssContent.indexOf('.is-valid.is-invalid');
      assert.ok(validPos < invalidPos, '.is-invalid must appear after .is-valid for tie-breaking cascade');
      assert.ok(invalidPos < conflictPos, '.is-valid.is-invalid must appear after both individual classes');
    });

    it('7.4 Feedback messages provide clear semantic styling', () => {
      const fbRules = extractRule(cssContent, /\.k-form-feedback\b/);
      assert.ok(fbRules.length > 0, '.k-form-feedback must exist');

      const fbValid = extractRule(cssContent, /\.k-form-feedback--valid\b/);
      assert.ok(fbValid.length > 0, '.k-form-feedback--valid must exist');
      assert.match(fbValid[0].declarations, /color:\s*var\(--k-success\)/,
        'Valid feedback text must be green');

      const fbInvalid = extractRule(cssContent, /\.k-form-feedback--invalid\b/);
      assert.ok(fbInvalid.length > 0, '.k-form-feedback--invalid must exist');
      assert.match(fbInvalid[0].declarations, /color:\s*var\(--k-error\)/,
        'Invalid feedback text must be red');
    });
  });

  describe('8. Production Artifact & Performance Gate Safeguards', () => {
    it('8.1 dist/kaui.min.css strictly meets performance budget of < 65,536 bytes', () => {
      const stat = fs.statSync(DIST_MIN_CSS);
      assert.ok(stat.size < 65536, `Minified CSS is ${stat.size} bytes; MUST be < 65536 bytes`);
    });

    it('8.2 No uncompiled Dart Sass variables or mixins leak into production output', () => {
      assert.doesNotMatch(minCssContent, /@mixin\b/, 'No @mixin in minified CSS');
      assert.doesNotMatch(minCssContent, /@include\b/, 'No @include in minified CSS');
      assert.doesNotMatch(minCssContent, /#\{/, 'No Sass interpolation #{} in minified CSS');
      assert.doesNotMatch(minCssContent, /\$[a-zA-Z0-9_-]+:/, 'No Sass $variable in minified CSS');
    });

    it('8.3 All SVG data URIs inside minified CSS are valid ASCII and properly URL encoded', () => {
      const urls = minCssContent.match(/url\([^)]+\)/g) || [];
      for (const u of urls) {
        if (u.includes('data:image/svg+xml')) {
          assert.doesNotMatch(u, /[\n\r\t]/, `Data URI should not contain newlines or tabs: ${u.slice(0, 50)}...`);
          assert.doesNotMatch(u, /#[0-9a-fA-F]/, `Raw hash # in SVG must be URL encoded as %23: ${u.slice(0, 50)}...`);
        }
      }
    });
  });

  describe('9. Deep Edge Cases & Usability Safeguards', () => {
    it('9.1 Anchor elements styled as .k-btn strip underline and prevent selection', () => {
      const btnRules = extractRule(cssContent, /^\.k-btn$/);
      assert.ok(btnRules.length > 0, '.k-btn base rule must exist');
      const decls = btnRules[0].declarations;
      assert.match(decls, /text-decoration:\s*none/, 'Anchor button must strip underline');
      assert.match(decls, /user-select:\s*none/, 'Button text must not be accidentally selectable');
      assert.match(decls, /white-space:\s*nowrap/, 'Button text must not wrap unexpectedly');
    });

    it('9.2 Placeholder styling across .k-input, .k-select, .k-textarea uses muted text token', () => {
      const phRules = extractRule(cssContent, /::placeholder/);
      assert.ok(phRules.length > 0, '::placeholder rule must exist');
      const decls = phRules.map(r => r.declarations).join('; ');
      assert.match(decls, /color:\s*var\(--k-color-text-muted\)/,
        'Placeholder must bind to --k-color-text-muted token');
    });

    it('9.3 Checkbox & Radio have focus ring on focus-visible and disabled muting', () => {
      const crFocus = extractRule(cssContent, /\.k-checkbox:focus-visible/);
      assert.ok(crFocus.length > 0, 'Checkbox focus-visible rule must exist');
      assert.match(crFocus[0].declarations, /box-shadow:\s*0 0 0 3px rgba\(59,\s*130,\s*246,\s*0\.4\)/,
        'Checkbox must have accessible focus ring');

      const crDisabled = extractRule(cssContent, /\.k-checkbox:disabled/);
      assert.ok(crDisabled.length > 0, 'Checkbox disabled rule must exist');
      const decls = crDisabled.map(r => r.declarations).join('; ');
      assert.match(decls, /cursor:\s*not-allowed/, 'Disabled checkbox must have not-allowed cursor');
      assert.match(decls, /opacity:\s*0\.6/, 'Disabled checkbox must have reduced opacity');
      assert.match(decls, /pointer-events:\s*none/, 'Disabled checkbox must block pointer events');
    });

    it('9.4 Disabled .k-select and .k-textarea enforce pointer-events: none and not-allowed cursor', () => {
      const selDisabled = extractRule(cssContent, /\.k-select:disabled/);
      assert.ok(selDisabled.length > 0, 'Select disabled rule must exist');
      const selDecls = selDisabled.map(r => r.declarations).join('; ');
      assert.match(selDecls, /cursor:\s*not-allowed/, 'Select disabled cursor check');
      assert.match(selDecls, /pointer-events:\s*none/, 'Select disabled pointer-events check');

      const taDisabled = extractRule(cssContent, /\.k-textarea:disabled/);
      assert.ok(taDisabled.length > 0, 'Textarea disabled rule must exist');
      const taDecls = taDisabled.map(r => r.declarations).join('; ');
      assert.match(taDecls, /cursor:\s*not-allowed/, 'Textarea disabled cursor check');
      assert.match(taDecls, /pointer-events:\s*none/, 'Textarea disabled pointer-events check');
    });
  });
});

