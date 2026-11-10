import fs from 'node:fs';
import path from 'node:path';

const dir = path.join(process.cwd(), 'icons/source/kaui');
fs.mkdirSync(dir, { recursive: true });

const icons = {
  'arrow-up-right': '<path d="M5 19 19 5M9 5h10v10"/>',
  'arrow-down-left': '<path d="M19 5 5 19M15 19H5V9"/>',
  'more-horizontal': '<circle cx="5" cy="12" r="1"/><circle cx="12" cy="12" r="1"/><circle cx="19" cy="12" r="1"/>',
  'more-vertical': '<circle cx="12" cy="5" r="1"/><circle cx="12" cy="12" r="1"/><circle cx="12" cy="19" r="1"/>',
  maximize: '<path d="M8 3H3v5M16 3h5v5M8 21H3v-5M21 16v5h-5"/>',
  minimize: '<path d="M4 12h16"/>',
  expand: '<path d="m9 3-6 6M3 3v6h6M15 21l6-6M21 21v-6h-6"/>',
  collapse: '<path d="m9 9-6-6M3 9V3h6M15 15l6 6M21 15v6h-6"/>',
  'log-in': '<path d="M10 17l5-5-5-5M15 12H3M21 3v18"/>',
  'log-out': '<path d="m14 17-5-5 5-5M9 12h12M3 3v18"/>',
  undo: '<path d="M9 7 4 12l5 5M4 12h10a6 6 0 0 1 6 6"/>',
  redo: '<path d="m15 7 5 5-5 5M20 12H10a6 6 0 0 0-6 6"/>',
  send: '<path d="m22 2-7 20-4-9-9-4zM22 2 11 13"/>',
  share: '<circle cx="18" cy="5" r="3"/><circle cx="6" cy="12" r="3"/><circle cx="18" cy="19" r="3"/><path d="m8.6 10.5 6.8-4M8.6 13.5l6.8 4"/>',
  link: '<path d="M10 13a5 5 0 0 0 7.5.5l2-2a5 5 0 0 0-7-7l-1 1M14 11a5 5 0 0 0-7.5-.5l-2 2a5 5 0 0 0 7 7l1-1"/>',
  bookmark: '<path d="M6 3h12v18l-6-4-6 4z"/>',
  archive: '<path d="M3 6h18M5 6v15h14V6M3 3h18v3H3zM9 10h6"/>',
  'success-circle': '<circle cx="12" cy="12" r="9"/><path d="m8 12 3 3 5-6"/>',
  'error-circle': '<circle cx="12" cy="12" r="9"/><path d="m9 9 6 6M15 9l-6 6"/>',
  'warning-triangle': '<path d="m12 3 10 18H2z"/><path d="M12 9v4M12 17h.01"/>',
  'info-circle': '<circle cx="12" cy="12" r="9"/><path d="M12 11v5M12 8h.01"/>',
  clock: '<circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/>',
  history: '<path d="M3 12a9 9 0 1 0 3-6.7M3 4v8h8"/><path d="M12 7v5l3 2"/>',
  activity: '<path d="M3 12h4l2-7 4 14 2-7h6"/>',
  'chart-line': '<path d="M3 19 9 13l4 4 8-10"/><path d="M17 7h4v4"/>',
  'chart-bar': '<path d="M4 20V10M10 20V4M16 20v-7M22 20H2"/>',
  'chart-pie': '<path d="M12 3v9h9A9 9 0 1 1 12 3z"/><path d="M15 3a9 9 0 0 1 6 6h-6z"/>',
  database: '<ellipse cx="12" cy="5" rx="8" ry="3"/><path d="M4 5v7c0 2 3.6 3 8 3s8-1 8-3V5M4 12v7c0 2 3.6 3 8 3s8-1 8-3v-7"/>',
  cloud: '<path d="M7 18a5 5 0 1 1 1-9 6 6 0 0 1 11 3 3 3 0 1 1 0 6z"/>',
  'user-plus': '<circle cx="9" cy="8" r="4"/><path d="M3 21c.7-4 2.7-6 6-6s5.3 2 6 6M19 8v6M16 11h6"/>',
  'shield-check': '<path d="M12 2 4 5v7c0 5 3.8 9 8 10 4.2-1 8-5 8-10V5z"/><path d="m8 12 3 3 5-6"/>'
};

for (const [name, inner] of Object.entries(icons)) {
  const file = path.join(dir, `${name}.svg`);
  if (!fs.existsSync(file)) {
    fs.writeFileSync(file, `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">${inner}</svg>\n`);
  }
}
console.log(`[icons:priority:add] Ensured ${Object.keys(icons).length} priority KAUI icons.`);
