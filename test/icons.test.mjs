import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { execFileSync } from 'node:child_process';

const ROOT = process.cwd();
const SOURCE_DIR = path.join(ROOT, 'icons/source/kaui');
const DIST_ICONS = path.join(ROOT, 'dist/icons');
const NPM_ICONS = path.join(ROOT, 'packages/npm/dist/icons');

const NEW_OFFICE_ICONS = [
  'file-word', 'file-excel', 'file-powerpoint', 'file-pdf', 'file-csv',
  'file-zip', 'file-archive', 'file-image', 'file-video', 'file-audio',
  'file-json', 'file-markdown', 'file-chart', 'file-signature', 'file-lock',
  'file-search', 'file-download', 'file-upload', 'file-copy', 'file-badge',
  'office-word', 'office-excel', 'office-powerpoint', 'office-pdf', 'office-outlook',
  'office-onenote', 'office-teams', 'office-onedrive', 'office-access', 'office-forms',
  'office-docs', 'office-sheets', 'office-slides', 'office-printer', 'office-scanner',
  'office-stamp', 'office-folder-zip', 'office-presentation', 'office-spreadsheet', 'office-signature'
];

const OLD_PLACEHOLDERS = new Set([
  '<circle cx="12" cy="12" r="8"/><path d="M12 8v8M8 12h8"/>',
  '<rect x="4" y="4" width="16" height="16" rx="2"/><path d="M4 10h16M10 4v16"/>',
  '<path d="M3 12h18M12 3v18M5 5l14 14M19 5 5 19"/>',
  '<path d="M4 18 10 6l4 8 3-5 3 9z"/>',
  '<path d="M5 5h14v14H5zM8 9h8M8 13h5"/>'
]);

describe('KAUI Icons & Office Registry', () => {
  const sourceFiles = fs.readdirSync(SOURCE_DIR).filter(f => f.endsWith('.svg')).sort();
  const uiFiles = sourceFiles.filter(f => !f.startsWith('flag-'));
  const flagFiles = sourceFiles.filter(f => f.startsWith('flag-'));
  const manifest = JSON.parse(fs.readFileSync(path.join(DIST_ICONS, 'kaui-icons.json'), 'utf8'));
  const sprite = fs.readFileSync(path.join(DIST_ICONS, 'sprite.svg'), 'utf8');
  const spriteUi = fs.readFileSync(path.join(DIST_ICONS, 'sprite-ui.svg'), 'utf8');

  it('contains 440 UI/Office SVGs and 195 flag SVGs (635 total)', () => {
    assert.equal(uiFiles.length, 440, `Expected 440 UI & Office SVGs, got ${uiFiles.length}`);
    assert.equal(flagFiles.length, 195, `Expected 195 flag SVGs, got ${flagFiles.length}`);
    assert.equal(manifest.icons.length, 635, `Expected 635 total icons in manifest, got ${manifest.icons.length}`);
  });

  it('includes all 40 new Office & Document icons in source, manifest, sprite.svg, and sprite-ui.svg', () => {
    for (const name of NEW_OFFICE_ICONS) {
      assert.ok(fs.existsSync(path.join(SOURCE_DIR, `${name}.svg`)), `Missing source SVG for ${name}`);
      assert.ok(manifest.icons.includes(name), `Missing ${name} in kaui-icons.json`);
      assert.ok(sprite.includes(`id="${name}"`), `Missing symbol ${name} in sprite.svg`);
      assert.ok(spriteUi.includes(`id="${name}"`), `Missing symbol ${name} in sprite-ui.svg`);
    }
    assert.ok(Array.isArray(manifest.categories.office), 'Manifest must expose categories.office');
    assert.ok(manifest.categories.office.length >= 40, 'categories.office must list at least 40 Office/Document icons');
  });

  it('every UI/Office SVG is valid XML, pure vector (no <text>), zero duplicates, zero old placeholders, and fits 24x24 viewBox', () => {
    const seenArtwork = new Map();
    for (const file of uiFiles) {
      const name = file.slice(0, -4);
      const raw = fs.readFileSync(path.join(SOURCE_DIR, file), 'utf8');
      assert.match(raw, /viewBox="0 0 24 24"/, `${file} must declare viewBox="0 0 24 24"`);
      assert.doesNotMatch(raw, /<text\b/i, `${file} must be pure vector without <text>`);

      const inner = raw.replace(/<svg[^>]*>/, '').replace(/<\/svg>/, '').trim().replace(/\s+/g, ' ');
      assert.ok(inner.length > 0, `${file} must not be empty`);
      assert.ok(!OLD_PLACEHOLDERS.has(inner), `${file} still uses an old phase 6-15 placeholder glyph`);

      if (seenArtwork.has(inner)) {
        assert.fail(`Duplicate SVG artwork: ${name} matches ${seenArtwork.get(inner)}`);
      }
      seenArtwork.set(inner, name);

      // Verify explicit shape attribute coordinates stay within [0, 24]
      for (const m of inner.matchAll(/\b(cx|cy|x|y|x1|y1|x2|y2)="(-?\d+(?:\.\d+)?)"/g)) {
        const val = Number(m[2]);
        assert.ok(val >= 0 && val <= 24, `${file} has out-of-bounds ${m[1]}=${val}`);
      }
    }

    // Validate all UI/Office SVGs with xmllint
    for (const file of uiFiles) {
      execFileSync('xmllint', ['--noout', path.join(SOURCE_DIR, file)], { stdio: 'pipe' });
    }
  });

  it('dist/icons/sprite.svg and dist/icons/sprite-ui.svg pass xmllint XML validation and UI sprite stays under 150 KB', () => {
    execFileSync('xmllint', ['--noout', path.join(DIST_ICONS, 'sprite.svg')], { stdio: 'pipe' });
    execFileSync('xmllint', ['--noout', path.join(DIST_ICONS, 'sprite-ui.svg')], { stdio: 'pipe' });

    const uiSpriteBytes = fs.statSync(path.join(DIST_ICONS, 'sprite-ui.svg')).size;
    assert.ok(uiSpriteBytes < 150 * 1024, `sprite-ui.svg must stay under 150 KB (actual: ${uiSpriteBytes} bytes)`);
  });

  it('every icon in manifest maps to a named category in demo/demo.js (0 icons in Other)', () => {
    const demoJs = fs.readFileSync(path.join(ROOT, 'demo/demo.js'), 'utf8');
    const rulesMatch = demoJs.match(/var iconCategoryRules = (\[[\s\S]*?\]);/);
    assert.ok(rulesMatch, 'iconCategoryRules must exist in demo/demo.js');
    const rules = eval(rulesMatch[1]);
    const uncategorized = manifest.icons.filter(name => !rules.some(([, re]) => re.test(name)));
    assert.deepEqual(uncategorized, [], `Uncategorized icons found: ${uncategorized.join(', ')}`);
  });

  it('demo/icons.html has accurate copy and docs without flag-xx or built-in data-kaui-icon runtime claims', () => {
    const iconsHtml = fs.readFileSync(path.join(ROOT, 'demo/icons.html'), 'utf8');
    assert.doesNotMatch(iconsHtml, /flag-xx/, 'demo/icons.html must not reference flag-xx');
    assert.doesNotMatch(iconsHtml, /built-in helper runtime/, 'demo/icons.html must not claim data-kaui-icon is a built-in runtime');
    assert.match(iconsHtml, /id="icon-gallery-filters"/, 'demo/icons.html must include category filter toolbar');
    assert.match(iconsHtml, /sprite-ui\.svg/, 'demo/icons.html must reference sprite-ui.svg');
  });

  it('packages/npm/dist/icons is synchronized with dist/icons', () => {
    for (const file of ['sprite.svg', 'sprite-ui.svg', 'kaui-icons.css', 'kaui-icons.json']) {
      assert.equal(
        fs.readFileSync(path.join(NPM_ICONS, file), 'utf8'),
        fs.readFileSync(path.join(DIST_ICONS, file), 'utf8'),
        `packages/npm/dist/icons/${file} is out of sync with dist/icons/${file}`
      );
    }
  });
});

