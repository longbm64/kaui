import fs from 'node:fs';
import path from 'node:path';

const dir = path.join(process.cwd(), 'icons/source/kaui');
fs.mkdirSync(dir, { recursive: true });
const icons = {
  'link-off': '<path d="m9 15-3 3a5 5 0 0 1-7-7l3-3M15 9l3-3a5 5 0 0 1 7 7l-3 3M8 12h8M3 3l18 18"/>',
  pin: '<path d="M12 17v5M5 3h14l-2 7 3 3H4l3-3z"/>',
  trash: '<path d="M4 7h16M10 11v6M14 11v6M6 7l1 14h10l1-14M9 7V3h6v4"/>',
  'rotate-cw': '<path d="M21 12a9 9 0 1 1-2.6-6.4M21 3v6h-6"/>',
  'rotate-ccw': '<path d="M3 12a9 9 0 1 0 2.6-6.4M3 3v6h6"/>',
  'plus-circle': '<circle cx="12" cy="12" r="9"/><path d="M12 8v8M8 12h8"/>',
  'minus-circle': '<circle cx="12" cy="12" r="9"/><path d="M8 12h8"/>',
  'help-circle': '<circle cx="12" cy="12" r="9"/><path d="M9.5 9a2.5 2.5 0 0 1 4.5 1.5c0 1.5-2 2-2 3M12 17h.01"/>',
  loader: '<path d="M12 3v3M12 18v3M3 12h3M18 12h3M5.6 5.6l2.1 2.1M16.3 16.3l2.1 2.1M18.4 5.6l-2.1 2.1M7.7 16.3l-2.1 2.1"/>',
  zap: '<path d="m13 2-9 12h7l-1 8 9-12h-7z"/>',
  'trending-up': '<path d="m3 17 6-6 4 4 8-8M16 7h5v5"/>',
  'trending-down': '<path d="m3 7 6 6 4-4 8 8M16 17h5v-5"/>',
  gauge: '<path d="M4 16a8 8 0 1 1 16 0M12 12l4-4M6 19h12"/>',
  analytics: '<path d="M4 19V5M4 19h16M8 16v-4M12 16V8M16 16v-7M20 16v-3"/>',
  dashboard: '<rect x="3" y="3" width="8" height="8" rx="1"/><rect x="13" y="3" width="8" height="5" rx="1"/><rect x="13" y="10" width="8" height="11" rx="1"/><rect x="3" y="14" width="8" height="7" rx="1"/>',
  kanban: '<rect x="3" y="4" width="5" height="16" rx="1"/><rect x="10" y="4" width="5" height="10" rx="1"/><rect x="17" y="4" width="5" height="13" rx="1"/>',
  list: '<path d="M8 6h13M8 12h13M8 18h13M3 6h.01M3 12h.01M3 18h.01"/>',
  'list-check': '<path d="m3 6 2 2 3-3M10 7h11M3 12l2 2 3-3M10 13h11M3 18l2 2 3-3M10 19h11"/>',
  'list-filter': '<path d="M4 6h16M4 12h12M4 18h8M20 15l-3 3-3-3M17 18V9"/>',
  'cloud-upload': '<path d="M7 18a5 5 0 1 1 1-9 6 6 0 0 1 11 3 3 3 0 1 1 0 6zM12 16V9M9 12l3-3 3 3"/>',
  'cloud-download': '<path d="M7 18a5 5 0 1 1 1-9 6 6 0 0 1 11 3 3 3 0 1 1 0 6zM12 9v7M9 13l3 3 3-3"/>',
  'file-plus': '<path d="M6 3h8l4 4v14H6zM14 3v5h4M12 12v6M9 15h6"/>',
  'file-minus': '<path d="M6 3h8l4 4v14H6zM14 3v5h4M9 15h6"/>',
  'file-check': '<path d="M6 3h8l4 4v14H6zM14 3v5h4M9 15l2 2 4-4"/>',
  'file-x': '<path d="M6 3h8l4 4v14H6zM14 3v5h4M9 14l6 6M15 14l-6 6"/>',
  'folder-open': '<path d="M3 7h7l2 2h9v11H3zM3 7l2 13M21 9l-2 11"/>',
  'folder-minus': '<path d="M3 7h7l2 2h9v11H3zM9 14h6"/>',
  book: '<path d="M4 4h6a2 2 0 0 1 2 2v14a2 2 0 0 0-2-2H4zM20 4h-6a2 2 0 0 0-2 2v14a2 2 0 0 1 2-2h6z"/>',
  'book-open': '<path d="M2 5a3 3 0 0 1 3-2h5a2 2 0 0 1 2 2v16a2 2 0 0 0-2-2H5a3 3 0 0 0-3 3zM22 5a3 3 0 0 0-3-2h-5a2 2 0 0 0-2 2v16a2 2 0 0 1 2-2h5a3 3 0 0 1 3 3z"/>',
  'user-minus': '<circle cx="9" cy="8" r="4"/><path d="M3 21c.7-4 2.7-6 6-6s5.3 2 6 6M16 12h6"/>',
  'user-check': '<circle cx="9" cy="8" r="4"/><path d="M3 21c.7-4 2.7-6 6-6s5.3 2 6 6M16 12l2 2 4-4"/>',
  'user-x': '<circle cx="9" cy="8" r="4"/><path d="M3 21c.7-4 2.7-6 6-6s5.3 2 6 6M16 11l5 5M21 11l-5 5"/>',
  'user-circle': '<circle cx="12" cy="12" r="9"/><circle cx="12" cy="9" r="3"/><path d="M6.5 19c.8-3 2.7-4.5 5.5-4.5s4.7 1.5 5.5 4.5"/>',
  key: '<circle cx="8" cy="15" r="4"/><path d="m11 12 8-8M16 7l2 2M18 5l2 2"/>',
  fingerprint: '<path d="M12 11a2 2 0 0 1 2 2v5M8 13a4 4 0 0 1 8 0v5M5 13a7 7 0 0 1 14 0v2M12 4a9 9 0 0 1 9 9M12 4a9 9 0 0 0-9 9"/>',
  'shield-alert': '<path d="M12 2 4 5v7c0 5 3.8 9 8 10 4.2-1 8-5 8-10V5z"/><path d="M12 8v4M12 16h.01"/>',
  'shield-x': '<path d="M12 2 4 5v7c0 5 3.8 9 8 10 4.2-1 8-5 8-10V5z"/><path d="m9 10 6 6M15 10l-6 6"/>'
};
for (const [name, inner] of Object.entries(icons)) {
  const file = path.join(dir, `${name}.svg`);
  if (!fs.existsSync(file)) fs.writeFileSync(file, `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">${inner}</svg>\n`);
}
console.log(`[icons:phase2:add] Ensured ${Object.keys(icons).length} Phase 2 KAUI icons.`);
