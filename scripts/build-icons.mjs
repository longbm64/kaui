import fs from 'node:fs';
import path from 'node:path';
const root = process.cwd();
const sourceRoot = path.join(root, 'icons/source/kaui');
const out = path.join(root, 'dist/icons');
fs.mkdirSync(sourceRoot, { recursive: true }); fs.mkdirSync(out, { recursive: true });
const names = fs.readdirSync(sourceRoot).filter(f => f.endsWith('.svg')).map(f => f.slice(0, -4)).sort();
if (!names.length) throw new Error('No KAUI icon sources found');

const brandReferences = new Set(['social-zalo']);
const manifest = { name: 'KAUI Icons', version: '1.2.0', license: 'KAUI Proprietary', ownership: 'KAUI-authored artwork; brand references retain respective trademark ownership', canvas: '24x24', stroke: 2, linecap: 'round', linejoin: 'round', color: 'currentColor', icons: names, entries: [] };
const sprite = ['<svg xmlns="http://www.w3.org/2000/svg"><defs>'];
const css = ['/** KAUI Official Icons. 100% KAUI-owned artwork. */', '.k-icon{display:inline-block;width:1.25rem;height:1.25rem;fill:none;stroke:currentColor;stroke-width:2;stroke-linecap:round;stroke-linejoin:round;}'];
for (const name of names) {
  const content = fs.readFileSync(path.join(sourceRoot, `${name}.svg`), 'utf8');
  const inner = content.replace(/<svg[^>]*>/, '').replace(/<\/svg>/, '').trim();
  sprite.push(`<symbol id="${name}" viewBox="0 0 24 24">${inner}</symbol>`);
  if (name === 'social-zalo') css.push('.k-icon--social-zalo{fill:currentColor;stroke:none;}');
  if (name === 'social-x') css.push('.k-icon--social-x{fill:currentColor;stroke:none;}');
  manifest.entries.push({ name, source: `icons/source/kaui/${name}.svg`, symbol: name, ownership: brandReferences.has(name) ? 'KAUI-authored brand reference; Zalo trademark remains with Zalo' : 'KAUI-owned' });
}
sprite.push('</defs></svg>');
fs.writeFileSync(path.join(root, 'icons/manifest.json'), JSON.stringify(manifest, null, 2) + '\n');
fs.writeFileSync(path.join(out, 'sprite.svg'), sprite.join('\n') + '\n');
fs.writeFileSync(path.join(out, 'kaui-icons.css'), css.join('\n') + '\n');
fs.writeFileSync(path.join(out, 'kaui-icons.json'), JSON.stringify(manifest, null, 2) + '\n');
console.log(`[icons:build] Generated ${names.length} KAUI-owned icons.`);

