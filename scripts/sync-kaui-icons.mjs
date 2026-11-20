import fs from 'node:fs';
import path from 'node:path';
import { officeFilesIcons } from './icons/office-files.mjs';
import { coreActionsIcons } from './icons/core-actions.mjs';
import { businessFinanceIcons } from './icons/business-finance.mjs';
import { devTechIcons } from './icons/dev-tech.mjs';
import { commSocialSecurityIcons } from './icons/comm-social-security.mjs';
import { travelMediaEduHealthTextIcons } from './icons/travel-media-edu-health-text.mjs';

const root = process.cwd();
const sourceDir = path.join(root, 'icons/source/kaui');
fs.mkdirSync(sourceDir, { recursive: true });

const modules = [
  ['office-files', officeFilesIcons],
  ['core-actions', coreActionsIcons],
  ['business-finance', businessFinanceIcons],
  ['dev-tech', devTechIcons],
  ['comm-social-security', commSocialSecurityIcons],
  ['travel-media-edu-health-text', travelMediaEduHealthTextIcons]
];

const allIcons = {};
for (const [modName, group] of modules) {
  for (const [name, inner] of Object.entries(group)) {
    if (Object.prototype.hasOwnProperty.call(allIcons, name)) {
      throw new Error(`Duplicate icon name "${name}" found in module "${modName}"`);
    }
    allIcons[name] = inner;
  }
}

// Verify all existing non-flag icons in icons/source/kaui are accounted for
const existingUiIcons = fs.readdirSync(sourceDir)
  .filter(f => f.endsWith('.svg') && !f.startsWith('flag-'))
  .map(f => f.slice(0, -4))
  .sort();

const missingExisting = existingUiIcons.filter(name => !Object.prototype.hasOwnProperty.call(allIcons, name));
if (missingExisting.length) {
  throw new Error(`Missing ${missingExisting.length} existing icons: ${missingExisting.join(', ')}`);
}

// Verify zero <text tags and zero duplicate normalized inner SVG artwork
const byInner = new Map();
const textViolations = [];
for (const [name, inner] of Object.entries(allIcons)) {
  const normalized = inner.trim().replace(/\s+/g, ' ');
  if (/<text\b/i.test(normalized)) textViolations.push(name);
  if (!byInner.has(normalized)) byInner.set(normalized, []);
  byInner.get(normalized).push(name);
}

if (textViolations.length) {
  throw new Error(`Icons containing forbidden <text> tags: ${textViolations.join(', ')}`);
}

const duplicates = [...byInner.entries()].filter(([, names]) => names.length > 1);
if (duplicates.length) {
  const details = duplicates.map(([art, names]) => `${names.join(' == ')} -> ${art.slice(0, 60)}`).join('\n');
  throw new Error(`Duplicate SVG artwork detected:\n${details}`);
}

const filledOnly = new Set(['social-x']);
let written = 0;
for (const [name, inner] of Object.entries(allIcons)) {
  const rootAttrs = filledOnly.has(name)
    ? 'xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" stroke="none"'
    : 'xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"';
  const svg = `<svg ${rootAttrs}>${inner.trim()}</svg>\n`;
  fs.writeFileSync(path.join(sourceDir, `${name}.svg`), svg);
  written++;
}

console.log(`[icons:sync] Wrote ${written} unique vector UI & Office SVG icons (0 duplicates, 0 <text> tags).`);

