import fs from 'node:fs';
import path from 'node:path';
import { execSync } from 'node:child_process';
import crypto from 'node:crypto';

const ROOT = process.cwd();
const PKG_PATH = path.join(ROOT, 'package.json');
const LOCK_PATH = path.join(ROOT, 'package-lock.json');
const DEMO_HTML_PATH = path.join(ROOT, 'demo/index.html');
const VERSIONS_DIR = path.join(ROOT, 'dist/versions');
const PUBLIC_BASE_URL = 'https://longbm64.github.io/kaui';
const INDEX_JSON_PATH = path.join(VERSIONS_DIR, 'index.json');


function manifestPath(version) {
  return path.join(VERSIONS_DIR, version, 'kaui-agent-manifest.json');
}

function bumpSemver(version, type) {
  const parts = version.split('.').map((n) => Number.parseInt(n, 10));
  if (parts.length !== 3 || parts.some(Number.isNaN)) {
    throw new Error(`Invalid semver: ${version}`);
  }
  if (type === 'major') return `${parts[0] + 1}.0.0`;
  if (type === 'minor') return `${parts[0]}.${parts[1] + 1}.0`;
  if (type === 'patch') return `${parts[0]}.${parts[1]}.${parts[2] + 1}`;
  if (/^\d+\.\d+\.\d+$/.test(type)) return type;
  throw new Error(`Unknown bump type: ${type}`);
}

function getFileMeta(filePath) {
  if (!fs.existsSync(filePath)) return null;
  const content = fs.readFileSync(filePath);
  return {
    bytes: content.length,
    sha256: crypto.createHash('sha256').update(content).digest('hex')
  };
}

function main() {
  const arg = process.argv[2] || 'build-only';
  const pkg = JSON.parse(fs.readFileSync(PKG_PATH, 'utf8'));
  const currentVersion = pkg.version;
  const nextVersion = arg === 'build-only' ? currentVersion : bumpSemver(currentVersion, arg);

  if (nextVersion !== currentVersion) {
    pkg.version = nextVersion;
    fs.writeFileSync(PKG_PATH, JSON.stringify(pkg, null, 2) + '\n');

    if (fs.existsSync(LOCK_PATH)) {
      const lock = JSON.parse(fs.readFileSync(LOCK_PATH, 'utf8'));
      lock.version = nextVersion;
      if (lock.packages && lock.packages['']) lock.packages[''].version = nextVersion;
      fs.writeFileSync(LOCK_PATH, JSON.stringify(lock, null, 2) + '\n');
    }

    if (fs.existsSync(DEMO_HTML_PATH)) {
      let demoHtml = fs.readFileSync(DEMO_HTML_PATH, 'utf8');
      demoHtml = demoHtml.replace(/v\d+\.\d+\.\d+\s+Production Ready/, `v${nextVersion} Production Ready`);
      demoHtml = demoHtml.replace(/\/dist\/versions\/\d+\.\d+\.\d+\/kaui-agent-manifest\.json/g, `/dist/versions/${nextVersion}/kaui-agent-manifest.json`);
      demoHtml = demoHtml.replace(/dist\/versions\/\d+\.\d+\.\d+\/kaui-agent-manifest\.json/g, `dist/versions/${nextVersion}/kaui-agent-manifest.json`);
      fs.writeFileSync(DEMO_HTML_PATH, demoHtml);
    }


    if (fs.existsSync(README_PATH)) {
      let readme = fs.readFileSync(README_PATH, 'utf8');
      readme = readme.replace(/badge\/version-\d+\.\d+\.\d+-blue/, `badge/version-${nextVersion}-blue`);
      fs.writeFileSync(README_PATH, readme);
    }
  }

  // Compile CSS and charts
  execSync('npm run build', { stdio: 'inherit' });
  execSync('npm run build:chart', { stdio: 'inherit' });

  const targetDir = path.join(VERSIONS_DIR, nextVersion);
  fs.mkdirSync(targetDir, { recursive: true });

  // Refresh the full agent manifest for this exact build/version.
  const manifestSourcePath = manifestPath(currentVersion);
  const baseManifest = fs.existsSync(manifestSourcePath)
    ? JSON.parse(fs.readFileSync(manifestSourcePath, 'utf8'))
    : {};
  const manifest = Object.assign({}, baseManifest, {
    name: 'KAUI CSS Kit Agent Manifest',
    version: nextVersion,
    builtAt: new Date().toISOString(),
    manifestUrl: `https://longbm64.github.io/kaui/dist/versions/${nextVersion}/kaui-agent-manifest.json`,
    liveDemoUrl: 'https://longbm64.github.io/kaui/demo',
    strictRule: 'MANDATORY: Use ONLY KAUI CSS Kit. Do NOT invent, custom-write, or recreate CSS when matching KAUI classes, components, or tokens exist. Custom CSS is strictly forbidden unless explicitly documented as unsupported by this manifest.',
    build: {
      version: nextVersion,
      mainCss: 'dist/kaui.min.css',
      chartCss: 'dist/kaui-chart.min.css',
      chartJs: 'dist/kaui-chart.min.js',
      artifactDirectory: `dist/versions/${nextVersion}/`,
      generatedBy: 'npm run build:versioned or npm run release:patch|minor|major'
    }
  });

  fs.writeFileSync(manifestPath(nextVersion), JSON.stringify(manifest, null, 2) + '\n');





  const artifacts = [
    'kaui.css',
    'kaui.css.map',
    'kaui.min.css',
    'kaui.min.css.map',
    'kaui-chart.css',
    'kaui-chart.js',
    'kaui-chart.min.css',
    'kaui-chart.min.js',
    'kaui-agent-manifest.json'
  ];

  const versionManifest = {
    version: nextVersion,
    builtAt: new Date().toISOString(),
    files: {}
  };

  for (const file of artifacts) {
    const src = file === 'kaui-agent-manifest.json' ? manifestPath(nextVersion) : path.join(ROOT, 'dist', file);
    if (fs.existsSync(src)) {
      const dest = path.join(targetDir, file);
      fs.copyFileSync(src, dest);
      versionManifest.files[file] = getFileMeta(src);
    }
  }

  const fileEntries = Object.keys(versionManifest.files).map((file) => ({
    name: file,
    url: `${PUBLIC_BASE_URL}/dist/versions/${nextVersion}/${encodeURIComponent(file)}`,
    metadata: versionManifest.files[file]
  }));

  let indexData = { latest: nextVersion, versions: {} };
  if (fs.existsSync(INDEX_JSON_PATH)) {
    try {
      indexData = JSON.parse(fs.readFileSync(INDEX_JSON_PATH, 'utf8'));
    } catch {}
  }
  indexData.latest = nextVersion;
  indexData.versions[nextVersion] = {
    version: nextVersion,
    builtAt: versionManifest.builtAt,
    directory: `dist/versions/${nextVersion}`,
    files: fileEntries
  };

  fs.writeFileSync(INDEX_JSON_PATH, JSON.stringify(indexData, null, 2) + '\n');
  console.log(`[kaui-release] Processed version v${nextVersion}. Artifacts stored in dist/versions/${nextVersion}`);
}

main();
