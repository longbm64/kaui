import fs from 'node:fs';
import path from 'node:path';

const root = process.cwd();
const pkg = JSON.parse(fs.readFileSync(path.join(root, 'package.json'), 'utf8'));
const version = pkg.version;
const versionDir = path.join(root, 'dist/versions', version);

if (!fs.existsSync(versionDir)) {
  throw new Error(`Version artifact directory missing: ${versionDir}`);
}

const required = [

  'kaui.css', 'kaui.min.css', 'kaui.css.map', 'kaui.min.css.map',
  'kaui-chart.css', 'kaui-chart.js', 'kaui-chart.min.css', 'kaui-chart.min.js',
  'kaui-agent-manifest.json', 'metadata.json',
  'tokens/kaui.tokens.json', 'tokens/kaui.tokens.css', 'tokens/kaui.tokens.dart',
  'tokens/KauiTokens.kt', 'tokens/KauiTokens.swift',
  'icons/sprite.svg', 'icons/kaui-icons.css', 'icons/kaui-icons.json'
];

for (const file of required) {
  const target = path.join(versionDir, file.replace(/^(tokens|icons)\//, '$1/'));
  if (!fs.existsSync(target)) throw new Error(`Missing release artifact: ${file}`);
}

const metadata = JSON.parse(fs.readFileSync(path.join(versionDir, 'metadata.json'), 'utf8'));
if (metadata.version !== version) throw new Error(`Metadata version mismatch: ${metadata.version} !== ${version}`);

const indexData = JSON.parse(fs.readFileSync(path.join(root, 'dist/versions/index.json'), 'utf8'));
if (!indexData.versions[version]) throw new Error(`Version ${version} not found in dist/versions/index.json`);

console.log(`[verify:release] Release v${version} verified with ${required.length} artifacts.`);
