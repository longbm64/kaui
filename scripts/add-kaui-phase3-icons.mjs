import fs from 'node:fs';
import path from 'node:path';
const dir = path.join(process.cwd(), 'icons/source/kaui'); fs.mkdirSync(dir, { recursive: true });
const icons = {
  volume:'<path d="M4 10v4h4l5 4V6L8 10zM17 9a4 4 0 0 1 0 6M19 6a8 8 0 0 1 0 12"/>',
  'volume-off':'<path d="m4 10 5 4 4 3V7l-4 3H4zM3 3l18 18"/>',
  mic:'<rect x="8" y="3" width="8" height="12" rx="4"/><path d="M5 11a7 7 0 0 0 14 0M12 18v3M9 21h6"/>',
  'mic-off':'<path d="M8 8v4a4 4 0 0 0 7 2M16 8V6a4 4 0 0 0-7-2v4M5 11a7 7 0 0 0 11 5M12 18v3M9 21h6M3 3l18 18"/>',
  video:'<path d="M15 10 21 7v10l-6-3M4 6h10v12H4z"/>',
  'video-off':'<path d="m3 3 18 18M15 10l6-3v10l-6-3M4 6h7M15 6v12H4z"/>',
  music:'<path d="M9 18V5l11-2v13M9 18a3 3 0 1 1-3-3 3 3 0 0 1 3 3M20 16a3 3 0 1 1-3-3 3 3 0 0 1 3 3"/>',
  headphones:'<path d="M4 14v-2a8 8 0 0 1 16 0v2M4 14h3v6H4zM17 14h3v6h-3z"/>',
  film:'<rect x="3" y="4" width="18" height="16" rx="2"/><path d="M7 4v16M17 4v16M3 9h4M17 9h4M3 15h4M17 15h4"/>',
  'play-circle':'<circle cx="12" cy="12" r="9"/><path d="m10 8 6 4-6 4z"/>',
  'pause-circle':'<circle cx="12" cy="12" r="9"/><path d="M10 8v8M14 8v8"/>',
  'stop-circle':'<circle cx="12" cy="12" r="9"/><rect x="9" y="9" width="6" height="6"/>',
  'image-plus':'<rect x="3" y="4" width="18" height="16" rx="2"/><circle cx="8" cy="9" r="1"/><path d="m21 16-5-5-8 8M17 4v6M14 7h6"/>',
  message:'<path d="M4 5h16v11H8l-4 4z"/><path d="M8 9h8M8 12h5"/>',
  'message-circle':'<path d="M20 12a8 8 0 0 1-9 8l-5 1 1-5a8 8 0 1 1 13-4z"/>',
  'message-square':'<path d="M4 4h16v12H8l-4 4z"/>',
  messages:'<path d="M4 5h14v10H8l-4 3zM8 9h12v10l-4-3H8"/>',
  'at-sign':'<circle cx="12" cy="12" r="4"/><path d="M16 8v5a3 3 0 0 0 6 0v-1a10 10 0 1 0-3 7"/>',
  phone:'<path d="M6 3h4l2 5-3 2a12 12 0 0 0 5 5l2-3 5 2v4c-9 3-18-6-15-15z"/>',
  'phone-call':'<path d="M6 3h4l2 5-3 2a12 12 0 0 0 5 5l2-3 5 2v4c-9 3-18-6-15-15zM16 3a5 5 0 0 1 5 5M16 7a1 1 0 0 1 1 1"/>',
  inbox:'<path d="M4 4h16v16H4zM4 14h5l1 2h4l1-2h5M8 8h8"/>',
  megaphone:'<path d="m3 11 18-5v10L3 13zM3 11v2M7 14l2 6h3l-2-6"/>',
  notification:'<path d="M18 8a6 6 0 0 0-12 0c0 7-3 7-3 9h18c0-2-3-2-3-9M10 21h4"/>',
  'radio-tower':'<path d="M12 4v16M8 8a6 6 0 0 0 0 8M16 8a6 6 0 0 1 0 8M5 5a10 10 0 0 0 0 14M19 5a10 10 0 0 1 0 14"/>',
  'podcast':'<circle cx="12" cy="12" r="2"/><path d="M8 16a6 6 0 0 1 0-8M16 8a6 6 0 0 1 0 8M5 19a10 10 0 0 1 0-14M19 5a10 10 0 0 1 0 14"/>',
  'message-plus':'<path d="M4 4h16v12H8l-4 4zM12 7v6M9 10h6"/>'
};
for (const [name, inner] of Object.entries(icons)) { const file = path.join(dir, `${name}.svg`); if (!fs.existsSync(file)) fs.writeFileSync(file, `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">${inner}</svg>\n`); }
console.log(`[icons:phase3:add] Ensured ${Object.keys(icons).length} Phase 3 icons.`);
