import fs from 'node:fs';
import path from 'node:path';
const dir = path.join(process.cwd(), 'icons/source/kaui'); fs.mkdirSync(dir, { recursive: true });
const icons = {
  package:'<path d="m3 7 9-4 9 4v10l-9 4-9-4zM3 7l9 4 9-4M12 11v10"/>',
  'package-check':'<path d="m3 7 9-4 9 4v10l-9 4-9-4zM3 7l9 4 9-4M12 11v10M8 16l2 2 4-4"/>',
  'package-plus':'<path d="m3 7 9-4 9 4v10l-9 4-9-4zM3 7l9 4 9-4M12 11v10M12 14v6M9 17h6"/>',
  truck:'<path d="M3 5h11v12H3zM14 9h4l3 3v5h-7zM7 20a2 2 0 1 0 0-4 2 2 0 0 0 0 4M18 20a2 2 0 1 0 0-4 2 2 0 0 0 0 4"/>',
  store:'<path d="M4 10v10h16V10M3 10l2-6h14l2 6M3 10a3 3 0 0 0 6 0 3 3 0 0 0 6 0 3 3 0 0 0 6 0M9 20v-6h6v6"/>',
  percent:'<circle cx="7" cy="7" r="2"/><circle cx="17" cy="17" r="2"/><path d="m5 19 14-14"/>',
  receipt:'<path d="M5 3h14v18l-3-2-4 2-4-2-3 2zM8 8h8M8 12h8M8 16h4"/>',
  coins:'<circle cx="8" cy="8" r="4"/><path d="M8 4h8a4 4 0 0 1 0 8H8M8 12v4a4 4 0 0 0 8 0v-4"/>',
  banknote:'<rect x="3" y="6" width="18" height="12" rx="2"/><circle cx="12" cy="12" r="2"/><path d="M7 10h.01M17 14h.01"/>',
  'scan-barcode':'<path d="M4 4v4M4 4h4M20 4h-4M20 4v4M4 20v-4M4 20h4M20 20h-4M20 20v-4M8 8v8M11 8v8M14 8v8M17 8v8"/>',
  server:'<rect x="3" y="4" width="18" height="6" rx="1"/><rect x="3" y="14" width="18" height="6" rx="1"/><path d="M7 7h.01M7 17h.01M11 7h6M11 17h6"/>',
  'server-cog':'<rect x="3" y="4" width="18" height="6" rx="1"/><path d="M7 7h.01M11 7h6M3 17h5M16 14v6M13 17h6"/><circle cx="16" cy="17" r="3"/>',
  cpu:'<rect x="7" y="7" width="10" height="10" rx="1"/><path d="M9 1v4M15 1v4M9 19v4M15 19v4M1 9h4M1 15h4M19 9h4M19 15h4M10 10h4v4h-4z"/>',
  'hard-drive':'<rect x="3" y="5" width="18" height="14" rx="2"/><path d="M3 15h18M7 10h.01M11 10h6"/>',
  wifi:'<path d="M3 8a14 14 0 0 1 18 0M6 12a9 9 0 0 1 12 0M9 16a5 5 0 0 1 6 0M12 20h.01"/>',
  'wifi-off':'<path d="M3 8a14 14 0 0 1 8-2M16 7a14 14 0 0 1 5 1M6 12a9 9 0 0 1 4-2M14 10a9 9 0 0 1 4 2M9 16a5 5 0 0 1 2-1M15 16a5 5 0 0 0-2-1M12 20h.01M3 3l18 18"/>',
  network:'<circle cx="5" cy="12" r="2"/><circle cx="19" cy="5" r="2"/><circle cx="19" cy="19" r="2"/><path d="m7 11 10-5M7 13l10 5"/>',
  globe:'<circle cx="12" cy="12" r="9"/><path d="M3 12h18M12 3a14 14 0 0 1 0 18M12 3a14 14 0 0 0 0 18"/>',
  'code-branch':'<path d="M6 3v12M18 9V3M6 15a3 3 0 1 0 0 6 3 3 0 0 0 0-6M18 9a3 3 0 1 0 0 6M6 6c0 3 3 3 6 3h3"/>',
  webhook:'<circle cx="6" cy="12" r="2.25"/><circle cx="18" cy="6" r="2.25"/><circle cx="18" cy="18" r="2.25"/><path d="m8.1 10.9 7.8-3.8M8.1 13.1l7.8 3.8"/><path d="M10 4.5a8.5 8.5 0 0 1 8 1.2M18 5.7l.1 3.1-3-.9"/>',
  'cloud-cog':'<path d="M7 18a5 5 0 1 1 1-9 6 6 0 0 1 7-1"/><circle cx="17" cy="16" r="3"/><path d="M17 12v1M17 19v1M13 16h1M20 16h1M14 13l1 1M19 18l1 1M20 13l-1 1M15 18l-1 1"/>',
  'database-backup':'<ellipse cx="12" cy="5" rx="8" ry="3"/><path d="M4 5v7c0 2 3.6 3 8 3M20 5v7M4 12v7c0 2 3.6 3 8 3 1.5 0 2.8-.1 4-.4M16 17h5v-5M21 17l-3 3"/>'
};
for (const [name, inner] of Object.entries(icons)) { const file = path.join(dir, `${name}.svg`); if (!fs.existsSync(file)) fs.writeFileSync(file, `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">${inner}</svg>\n`); }
console.log(`[icons:phase4:add] Ensured ${Object.keys(icons).length} Phase 4 icons.`);
