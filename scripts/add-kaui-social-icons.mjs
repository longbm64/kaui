import fs from 'node:fs';
import path from 'node:path';
import { commSocialSecurityIcons } from './icons/comm-social-security.mjs';

const dir = path.join(process.cwd(), 'icons/source/kaui');
fs.mkdirSync(dir, { recursive: true });

const filledOnly = new Set(['social-x']);
const socialEntries = Object.entries(commSocialSecurityIcons).filter(([name]) => name.startsWith('social-'));

for (const [name, inner] of socialEntries) {
  const attrs = filledOnly.has(name)
    ? 'xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" stroke="none"'
    : 'xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"';
  fs.writeFileSync(path.join(dir, `${name}.svg`), `<svg ${attrs}>${inner}</svg>\n`);
}
console.log(`[icons:social] Added ${socialEntries.length} KAUI-owned social icons.`);
