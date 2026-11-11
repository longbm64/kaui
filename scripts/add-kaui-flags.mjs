import fs from 'node:fs';
import path from 'node:path';

const root = process.cwd();
const sourceDir = path.join(root, 'icons/source/kaui');
const countriesFile = path.join(root, 'demo/countries.js');
const sourceUrl = code => `https://raw.githubusercontent.com/lipis/flag-icons/main/flags/4x3/${code.toLowerCase()}.svg`;

function toSlug(name) {
  return name.toLowerCase()
    .normalize('NFD').replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

const content = fs.readFileSync(countriesFile, 'utf8');
const match = content.match(/var demoCountries = (\[[\s\S]*?\]);/);
const countries = eval(match[1]);
fs.mkdirSync(sourceDir, { recursive: true });

async function downloadBatch(batch) {
  await Promise.all(batch.map(async item => {
    const code = item[0].toLowerCase();
    const slug = 'flag-' + toSlug(item[2]);
    const target = path.join(sourceDir, `${slug}.svg`);
    if (fs.existsSync(target)) return;
    const response = await fetch(sourceUrl(code));
    if (!response.ok) throw new Error(`Unable to download ${slug} (${code}): ${response.status}`);
    const svg = await response.text();
    const body = svg.replace(/<svg[^>]*>/, '').replace(/<\/svg>/, '').trim();
    fs.writeFileSync(target, `<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 640 480" role="img">${body}</svg>\n`);
  }));
}

const batchSize = 25;
for (let i = 0; i < countries.length; i += batchSize) {
  const batch = countries.slice(i, i + batchSize);
  await downloadBatch(batch);
}

const totalFlags = fs.readdirSync(sourceDir).filter(f => f.startsWith('flag-') && f.endsWith('.svg')).length;
console.log(`[icons:flags:add] Verified ${totalFlags} country flag sources with full country names.`);


