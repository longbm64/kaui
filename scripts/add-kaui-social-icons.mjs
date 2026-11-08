import fs from 'node:fs';
import path from 'node:path';
const dir = path.join(process.cwd(), 'icons/source/kaui');
fs.mkdirSync(dir, { recursive: true });
const icons = {
  'social-facebook':'<path d="M14 21v-8h3l.5-3H14V8c0-1 .5-2 2-2h1.5V3h-2C11 3 10 5 10 8v2H7v3h3v8z"/>',
  'social-zalo':'<text x="12" y="16.4" text-anchor="middle" font-family="Arial,Helvetica,sans-serif" font-size="14" font-weight="700" letter-spacing="-.75" fill="currentColor">zalo</text>',
  'social-threads':'<path d="M12 21c-5 0-8-3.5-8-9s3-9 8-9c4 0 7 2 8 6M8 12c2-2 6-2 8 0 2 3 0 6-4 6-3 0-5-2-5-4 0-3 4-4 8-2 3 1 4 3 4 5"/>',
  'social-telegram':'<path d="m3 11 18-7-4 16-5-5-3 3v-6zM9 15l8-7"/>',
  'social-instagram':'<rect x="3" y="3" width="18" height="18" rx="5"/><circle cx="12" cy="12" r="4"/><circle cx="17.5" cy="6.5" r=".5"/>',
  'social-youtube':'<path d="M4 8a2 2 0 0 1 2-2c4-.6 8-.6 12 0a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2c-4 .6-8 .6-12 0a2 2 0 0 1-2-2zM10 9l5 3-5 3z"/>',
  'social-tiktok':'<path d="M14 4v11a4 4 0 1 1-3-4M14 4c1 2 2 3 5 3"/>',
  'social-linkedin':'<rect x="4" y="4" width="16" height="16" rx="2"/><path d="M8 10v6M8 7.5v.01M12 16v-3a2 2 0 0 1 4 0v3M12 10v6"/>',
  'social-x':'<path d="M5 4 19 20M19 4 5 20"/>',
  'social-whatsapp':'<path d="M12 3a9 9 0 0 1 8 13l1 4-5-1A9 9 0 1 1 12 3zM9 8c1 3 2 5 5 6l1-1 2 1"/>',
  'social-discord':'<path d="M6 6c4-2 8-2 12 0l2 10c-4 3-12 3-16 0zM9 12h.01M15 12h.01"/>',
  'social-github':'<path d="M8 19c-4 1-4-2-6-2M16 19v-3c0-1-.5-2-1.5-2.5 3-.3 6-1.5 6-6a5 5 0 0 0-1-3.5A4 4 0 0 0 19 1.5S17 1 16 2.5a13 13 0 0 0-8 0C6.5 1 5 1.5 5 1.5a4 4 0 0 0-.2 2.5A5 5 0 0 0 3.5 7c0 4.5 3 5.7 6 6C8.5 14 8 15 8 16v3"/>',
  'social-reddit':'<circle cx="12" cy="13" r="8"/><path d="M8 14c2 2 6 2 8 0M9 11h.01M15 11h.01M12 5l1-3 3 1"/>',
  'social-wechat':'<path d="M4 12a6 5 0 0 1 10-3 5 5 0 0 1 6 5 5 5 0 0 1-7 4l-4 2 .7-3A6 5 0 0 1 4 12zM8 12h.01M12 12h.01M16 14h.01"/>',
  'social-share':'<circle cx="6" cy="12" r="2"/><circle cx="18" cy="6" r="2"/><circle cx="18" cy="18" r="2"/><path d="m8 11 8-4M8 13l8 4"/>',
  'social-community':'<circle cx="8" cy="9" r="3"/><circle cx="16" cy="9" r="3"/><path d="M3 20c1-3 2-5 5-5s5 2 5 5M11 20c1-3 2-5 5-5s5 2 5 5"/>'
};
for (const [name, inner] of Object.entries(icons)) fs.writeFileSync(path.join(dir, `${name}.svg`), `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">${inner}</svg>\n`);
console.log(`[icons:social] Added ${Object.keys(icons).length} KAUI-owned social icons.`);
