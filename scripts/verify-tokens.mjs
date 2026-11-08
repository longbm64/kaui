import fs from 'node:fs';
import path from 'node:path';

const root = process.cwd();
const sourcePath = path.join(root, 'tokens/kaui.tokens.json');
const cssPath = path.join(root, 'dist/kaui.css');
const outputDir = path.join(root, 'dist/tokens');
const outputPath = path.join(outputDir, 'kaui.tokens.json');

const tokens = JSON.parse(fs.readFileSync(sourcePath, 'utf8'));
const css = fs.readFileSync(cssPath, 'utf8');
const requiredCssTokens = [
  '--k-color-primary-600', '--k-color-secondary-600', '--k-color-surface', '--k-color-text-main', '--k-color-border',
  '--k-spacing-4', '--k-spacing-16', '--k-size-base', '--k-radius-md', '--k-shadow-md', '--k-z-modal'
];
const missing = requiredCssTokens.filter((token) => !css.includes(`${token}:`));
if (missing.length) {
  throw new Error(`Token registry is not represented in dist/kaui.css: ${missing.join(', ')}`);
}
fs.mkdirSync(outputDir, { recursive: true });
fs.writeFileSync(outputPath, JSON.stringify({ ...tokens, generatedAt: new Date().toISOString(), source: 'tokens/kaui.tokens.json' }, null, 2) + '\n');
console.log(`[tokens] Verified ${requiredCssTokens.length} CSS tokens and wrote ${path.relative(root, outputPath)}`);
