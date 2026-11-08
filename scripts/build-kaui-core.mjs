import fs from 'node:fs';
import path from 'node:path';

const root = process.cwd();
const sourceDir = path.join(root, 'icons/source/kaui');
const outDir = path.join(root, 'dist/icons');
fs.mkdirSync(sourceDir, { recursive: true });
fs.mkdirSync(outDir, { recursive: true });

// KAUI Core glyphs are authored for this project on a 24x24 grid.
const glyphs = {
  add: '<path d="M12 4v16M4 12h16"/>',
  close: '<path d="m5 5 14 14M19 5 5 19"/>',
  check: '<path d="m4 12 5 7L20 5"/>',
  search: '<circle cx="10.5" cy="10.5" r="6.5"/><path d="m16 16 5 5"/>',
  edit: '<path d="m4 17 1-5L15 2l5 5L10 17z"/><path d="M4 17h6"/>',
  delete: '<path d="M5 7h14M9 7V4h6v3M7 7l1 14h8l1-14"/>',
  save: '<path d="M5 3h11l3 3v15H5z"/><path d="M8 3v6h8V5M8 21v-7h8v7"/>',
  menu: '<path d="M4 6h16M4 12h16M4 18h16"/>',
  'arrow-left': '<path d="M20 12H4M10 5l-7 7 7 7"/>',
  'arrow-right': '<path d="M4 12h16M14 5l7 7-7 7"/>',
  'chevron-down': '<path d="m5 8 7 8 7-8"/>',
  'chevron-up': '<path d="m5 16 7-8 7 8"/>',
  'chevron-left': '<path d="m15 5-7 7 7 7"/>',
  'chevron-right': '<path d="m9 5 7 7-7 7"/>',
  'external-link': '<path d="M14 4h6v6M11 13 20 4M18 14v5H4V5h5"/>',
  info: '<circle cx="12" cy="12" r="9"/><path d="M12 11v5M12 7h.01"/>',
  warning: '<path d="m12 3 9 17H3z"/><path d="M12 9v5M12 17h.01"/>',
  error: '<circle cx="12" cy="12" r="9"/><path d="m9 9 6 6M15 9l-6 6"/>',
  success: '<circle cx="12" cy="12" r="9"/><path d="m7 12 3 3 7-7"/>',
  settings: '<circle cx="12" cy="12" r="3"/><path d="m12 3 1 2 2 .5 2-1 1.5 1.5-1 2 .5 2 2 1v2l-2 1-.5 2 1 2-1.5 1.5-2-1-2 .5-1 2h-2l-1-2-2-.5-2 1L3 19l1-2-.5-2-2-1v-2l2-1 .5-2-1-2L4.5 5.5l2 1 2-.5 1-2z"/>',
  user: '<circle cx="12" cy="8" r="4"/><path d="M4 21c.8-4 3.5-6 8-6s7.2 2 8 6"/>',
  calendar: '<rect x="4" y="5" width="16" height="16" rx="2"/><path d="M8 3v4M16 3v4M4 10h16"/>',
  bell: '<path d="M5 17h14l-2-3V9a5 5 0 0 0-10 0v5z"/><path d="M10 20h4"/>',
  mail: '<rect x="3" y="5" width="18" height="14" rx="2"/><path d="m4 7 8 6 8-6"/>',
  lock: '<rect x="5" y="10" width="14" height="11" rx="2"/><path d="M8 10V7a4 4 0 0 1 8 0v3"/>',
  eye: '<path d="M3 12s3-6 9-6 9 6 9 6-3 6-9 6-9-6-9-6z"/><circle cx="12" cy="12" r="2.5"/>',
  file: '<path d="M6 3h8l4 4v14H6z"/><path d="M14 3v5h4M9 13h6M9 17h4"/>',
  folder: '<path d="M3 7h7l2 2h9v10H3z"/>',
  home: '<path d="m3 11 9-8 9 8v9H3z"/><path d="M9 20v-6h6v6"/>',
  copy: '<rect x="8" y="8" width="12" height="12" rx="2"/><path d="M16 8V5a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h3"/>',
  download: '<path d="M12 3v12M7 11l5 5 5-5M4 19v2h16v-2"/>',
  upload: '<path d="M12 21V9M7 13l5-5 5 5M4 5V3h16v2"/>'
};

const names = Object.keys(glyphs);
const manifest = {
  name: 'KAUI Core Icons', version: '1.0.0', license: 'KAUI-owned', ownership: 'KAUI Contributors',
  canvas: '24x24', stroke: 2, linecap: 'round', linejoin: 'round', color: 'currentColor',
  provenance: 'Original KAUI artwork authored for the KAUI project', icons: names,
  entries: []
};
const sprite = ['<svg xmlns="http://www.w3.org/2000/svg"><defs>'];
const css = ['/** Generated KAUI Core icon classes. KAUI-owned artwork. */', '.k-icon { display:inline-block; width:1.25rem; height:1.25rem; fill:none; stroke:currentColor; stroke-width:2; stroke-linecap:round; stroke-linejoin:round; }'];
for (const name of names) {
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">${glyphs[name]}</svg>\n`;
  fs.writeFileSync(path.join(sourceDir, `${name}.svg`), svg);
  fs.writeFileSync(path.join(sourceDir, `${name}.meta.json`), JSON.stringify({ name, ownership: 'KAUI-owned', provenance: 'Original KAUI artwork', license: 'KAUI-owned' }, null, 2) + '\n');
  sprite.push(`<symbol id="${name}" viewBox="0 0 24 24">${glyphs[name]}</symbol>`);
  css.push(`.k-icon--${name} { }`);
  manifest.entries.push({ name, source: `icons/source/kaui/${name}.svg`, ownership: 'KAUI-owned', symbol: name });
}
sprite.push('</defs></svg>');
fs.writeFileSync(path.join(root, 'icons/core-manifest.json'), JSON.stringify(manifest, null, 2) + '\n');
fs.writeFileSync(path.join(outDir, 'kaui-core-sprite.svg'), sprite.join('\n') + '\n');
fs.writeFileSync(path.join(outDir, 'kaui-core-icons.css'), css.join('\n') + '\n');
fs.writeFileSync(path.join(outDir, 'kaui-core-icons.json'), JSON.stringify(manifest, null, 2) + '\n');
console.log(`[icons:core] Generated ${names.length} KAUI-owned core icons.`);
