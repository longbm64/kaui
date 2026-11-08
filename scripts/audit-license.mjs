import fs from 'node:fs';
import path from 'node:path';

const root = process.cwd();
const pkg = JSON.parse(fs.readFileSync(path.join(root, 'package.json'), 'utf8'));
const requiredFiles = ['LICENSE', 'NON_COMMERCIAL_LICENSE.md', 'COMMERCIAL_LICENSE.md', 'THIRD_PARTY_NOTICES.md'];
for (const file of requiredFiles) {
  if (!fs.existsSync(path.join(root, file))) throw new Error(`Missing compliance file: ${file}`);
}
console.log(`[audit:license] License files verified for version ${pkg.version}. Package license: ${pkg.license}`);
