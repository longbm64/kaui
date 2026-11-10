import fs from 'node:fs';
import path from 'node:path';
const dir = path.join(process.cwd(), 'icons/source/kaui'); fs.mkdirSync(dir, { recursive: true });
const icons = {
  bold:'<path d="M7 4h6a4 4 0 0 1 0 8H7zM7 12h7a4 4 0 0 1 0 8H7zM7 4v16"/>',
  italic:'<path d="M10 4h8M6 20h8M14 4 10 20"/>',
  underline:'<path d="M6 3v7a6 6 0 0 0 12 0V3M4 21h16"/>',
  'align-left':'<path d="M4 5h16M4 9h11M4 13h16M4 17h11M4 21h16"/>',
  'align-center':'<path d="M4 5h16M7 9h10M4 13h16M7 17h10M4 21h16"/>',
  'align-right':'<path d="M4 5h16M9 9h11M4 13h16M9 17h11M4 21h16"/>',
  text:'<path d="M4 5h16M12 5v14M8 19h8"/>',
  paperclip:'<path d="m12 20 7-7a5 5 0 0 0-7-7l-7 7a3 3 0 0 0 4 4l7-7a1 1 0 0 0-1-1l-6 6"/>',
  palette:'<path d="M12 3a9 9 0 0 0 0 18h1a2 2 0 0 0 0-4h-1a2 2 0 0 1 0-4h4a5 5 0 0 0 0-10zM7 10h.01M9 7h.01M14 7h.01M17 10h.01"/>',
  'eye-dropper':'<path d="m14 4 6 6M13 5l6 6-8 8H6v-5zM6 19l-3 3"/>',
  accessibility:'<circle cx="12" cy="4" r="2"/><path d="M5 8h14M12 6v13M8 21l4-8 4 8"/>',
  contrast:'<circle cx="12" cy="12" r="9"/><path d="M12 3a9 9 0 0 1 0 18z"/>',
  languages:'<path d="M4 5h8M8 3v2M5 5c0 4 3 7 7 8M5 9c2-1 4-3 5-5M14 14h6M17 12v2M14 21l3-7 3 7M15 19h4"/>',
  translate:'<path d="M4 5h8M8 3v2M5 5c0 4 3 7 7 8M5 9c2-1 4-3 5-5M14 21l4-10 4 10M15.5 18h5"/>',
  captions:'<rect x="3" y="5" width="18" height="14" rx="2"/><path d="M7 12h4M13 12h4M7 15h2M11 15h6"/>',
  keyboard:'<rect x="3" y="6" width="18" height="12" rx="2"/><path d="M6 10h.01M9 10h.01M12 10h.01M15 10h.01M18 10h.01M6 14h12"/>',
  mouse:'<rect x="7" y="3" width="10" height="18" rx="5"/><path d="M12 3v5M7 11h10"/>',
  'screen-reader':'<path d="M4 12a8 8 0 0 1 16 0M7 12a5 5 0 0 1 10 0M10 12a2 2 0 0 1 4 0M12 14v7"/>',
  'text-cursor:' : '<path d="M8 4h8M8 20h8M12 4v16"/>',
  'table-properties':'<rect x="3" y="4" width="18" height="16"/><path d="M3 9h18M9 4v16M15 4v16M18 14v5M15 17h6"/>'
};
for (const [name, inner] of Object.entries(icons)) { const safe = name.replace(/:$/, ''); const file = path.join(dir, `${safe}.svg`); if (!fs.existsSync(file)) fs.writeFileSync(file, `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">${inner}</svg>\n`); }
console.log(`[icons:phase5:add] Ensured ${Object.keys(icons).length} Phase 5 icons.`);
