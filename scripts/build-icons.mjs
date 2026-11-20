import fs from 'node:fs';
import path from 'node:path';
const root = process.cwd();
const sourceRoot = path.join(root, 'icons/source/kaui');
const out = path.join(root, 'dist/icons');
fs.mkdirSync(sourceRoot, { recursive: true }); fs.mkdirSync(out, { recursive: true });
const names = fs.readdirSync(sourceRoot).filter(f => f.endsWith('.svg')).map(f => f.slice(0, -4)).sort();
if (!names.length) throw new Error('No KAUI icon sources found');

const flagNames = names.filter(name => name.startsWith('flag-'));
const isOfficeIcon = name => name.startsWith('office-') || /^file-(word|excel|powerpoint|pdf|csv|zip|archive|spreadsheet|signature|chart|markdown|json|image|video|audio|lock|search|download|upload|copy|badge)$/.test(name);
const officeNames = names.filter(isOfficeIcon);
const brandReferences = new Set(['social-zalo']);
const manifest = { name: 'KAUI Icons', version: '1.3.0', license: 'KAUI Proprietary', ownership: 'KAUI-authored artwork; brand references retain respective trademark ownership', canvas: '24x24', stroke: 2, linecap: 'round', linejoin: 'round', color: 'currentColor', icons: names, categories: { office: officeNames, flags: flagNames }, entries: [] };
const sprite = ['<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink"><defs>'];
const spriteUi = ['<svg xmlns="http://www.w3.org/2000/svg"><defs>'];
const css = ['/** KAUI Official Icons. 100% KAUI-owned artwork; country flags retain their respective national insignia status. */', '.k-icon{display:inline-block;width:1.25rem;height:1.25rem;fill:none;stroke:currentColor;stroke-width:2;stroke-linecap:round;stroke-linejoin:round;}'];
// Single compact class for all country flags to keep bundle size small and under performance budget
css.push('.k-icon[class*="k-icon--flag-"]{width:1.5rem;height:1.125rem;fill:initial;stroke:none;vertical-align:-.15em;}');
for (const name of names) {
  const content = fs.readFileSync(path.join(sourceRoot, `${name}.svg`), 'utf8');
  const inner = content.replace(/<svg[^>]*>/, '').replace(/<\/svg>/, '').trim();

  // If this is a flag, copy the individual SVG to dist/icons/flags/ so it can also be used as a standalone image/src
  if (name.startsWith('flag-')) {
    const flagsDist = path.join(out, 'flags');
    fs.mkdirSync(flagsDist, { recursive: true });
    const normalizedSvg = content.replace('<svg ', '<svg xmlns:xlink="http://www.w3.org/1999/xlink" ');
    fs.writeFileSync(path.join(flagsDist, `${name}.svg`), normalizedSvg);
  }

  // Strip any nested <defs>...</defs> tags but keep their inner definitions so that
  // the top-level <defs> wrapper is never prematurely closed by an inner SVG.
  const cleanedInner = inner.replace(/<\/?defs>/g, '').split('\n').map(line => line.trimEnd()).join('\n');
  const symbolMarkup = `<symbol id="${name}" viewBox="${name.startsWith('flag-') ? '0 0 640 480' : '0 0 24 24'}">${cleanedInner}</symbol>`;
  sprite.push(symbolMarkup);
  if (!name.startsWith('flag-')) {
    spriteUi.push(symbolMarkup);
  }
  if (name === 'social-x') css.push('.k-icon--social-x{fill:currentColor;stroke:none;}');
  const category = name.startsWith('flag-') ? 'flags' : isOfficeIcon(name) ? 'office' : 'ui';
  manifest.entries.push({ name, source: `icons/source/kaui/${name}.svg`, symbol: name, category, ownership: brandReferences.has(name) ? 'KAUI-authored brand reference; Zalo trademark remains with Zalo' : name.startsWith('flag-') ? 'Country flag artwork sourced from flag-icons; national insignia remain respective national symbols' : 'KAUI-owned' });
}
sprite.push('</defs></svg>');
spriteUi.push('</defs></svg>');
fs.writeFileSync(path.join(root, 'icons/manifest.json'), JSON.stringify(manifest, null, 2) + '\n');
fs.writeFileSync(path.join(out, 'sprite.svg'), sprite.join('\n').replace(/[ \t]+$/gm, '') + '\n');
fs.writeFileSync(path.join(out, 'sprite-ui.svg'), spriteUi.join('\n').replace(/[ \t]+$/gm, '') + '\n');
fs.writeFileSync(path.join(out, 'kaui-icons.css'), css.join('\n') + '\n');
fs.writeFileSync(path.join(out, 'kaui-icons.json'), JSON.stringify(manifest, null, 2) + '\n');
console.log(`[icons:build] Generated ${names.length} KAUI icons (${names.length - flagNames.length} UI & Office, ${flagNames.length} flags).`);

