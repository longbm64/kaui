# QUY TRÌNH `#release`

> Copy toàn bộ file này sang dự án khác để thiết lập quy trình release tự động.

## Mục tiêu

Khi chạy `#release` hoặc `npm run release`, hệ thống phải:

1. Kiểm tra branch và Git working tree.
2. Tăng version tự động (mặc định patch).
3. Build toàn bộ project.
4. Chạy test, lint, type-check và các lệnh verify đang tồn tại.
5. Commit và push branch nguồn.
6. Merge branch nguồn vào branch protected `release`.
7. Push branch `release`.
8. Chỉ deploy sau khi merge và push `release` thành công.

## Quy tắc an toàn

- Branch phát triển: `main` hoặc feature branch.
- Branch phát hành: `release`.
- Không chạy release trực tiếp trên `release` hoặc detached HEAD.
- Working tree phải sạch trước khi bắt đầu.
- Không dùng `git reset --hard`, force-push hoặc tự động stash/xóa code.
- Nếu có merge conflict, dừng ngay để xử lý thủ công.
- Không deploy nếu build/test/verify/merge/push thất bại.

## Version

Mặc định:

```text
1.1.1 -> 1.1.2
```

Hỗ trợ:

```bash
npm run release -- patch
npm run release -- minor
npm run release -- major
```

Version phải lấy từ manifest chính của dự án (`package.json`, `pubspec.yaml`, `Cargo.toml`, `pyproject.toml`, ...), không đoán từ branch hoặc commit.

## Flow bắt buộc

```text
- Triple-platform release synchronization contract:
  - Root `package.json`, `packages/npm/package.json`, and `packages/pub/pubspec.yaml` MUST strictly share the exact same version number upon running `#release`.
  - Package keywords (NPM `keywords` array) and topics (Pub.dev `topics` list) must be fully declared with design-system terms (`css`, `scss`, `ui-kit`, `widgets`, `tokens`, `theme`, `responsive`, `dark-mode`).
  - Pub.dev metadata must include `repository`, `issue_tracker`, and automatic `CHANGELOG.md` notes describing real architectural updates (typography sharpness, scroll containment, contrast improvements).
  - Release automation (`scripts/release-flow.mjs`) publishes atomically to Railway (Web CDN), NPM (`filekat`), and Pub.dev (`filekat`).

#release
  -> kiểm tra branch + working tree
  -> git fetch origin main release
  -> tăng version và build artifact
  -> test/lint/type-check/verify
  -> git commit "release: v<VERSION>"
  -> git push origin <SOURCE_BRANCH>
  -> git switch release
  -> git pull --ff-only origin release
  -> git merge --no-ff <SOURCE_BRANCH>
  -> git push origin release
  -> quay lại <SOURCE_BRANCH>
  -> deploy
```

Deploy chỉ được chạy sau bước push `release`. Nếu dự án chưa có deploy command rõ ràng, phải dừng và yêu cầu cấu hình; không tự đoán.

## `package.json`

```json
{
  "scripts": {
    "release": "node scripts/release-flow.mjs",
    "release:patch": "node scripts/release.mjs patch",
    "release:minor": "node scripts/release.mjs minor",
    "release:major": "node scripts/release.mjs major"
  }
}
```

## `scripts/release-flow.mjs`

```js
#!/usr/bin/env node
import { execFileSync } from 'node:child_process';
import fs from 'node:fs';

const root = process.cwd();
const bump = process.argv[2] || 'patch';
const deployCommand = process.env.RELEASE_DEPLOY_COMMAND || 'railway up';

function run(command, args = []) {
  console.log(`[release] ${command} ${args.join(' ')}`);
  execFileSync(command, args, { cwd: root, stdio: 'inherit' });
}

function capture(command, args = []) {
  return execFileSync(command, args, { cwd: root, encoding: 'utf8' }).trim();
}

function main() {
  const sourceBranch = capture('git', ['branch', '--show-current']);
  if (!sourceBranch || sourceBranch === 'release') {
    throw new Error('Run release from main or a feature branch, never release.');
  }
  if (capture('git', ['status', '--porcelain'])) {
    throw new Error('Working tree is not clean. Commit or stash changes first.');
  }

  run('git', ['fetch', 'origin', 'main', 'release']);
  run('npm', ['run', `release:${bump}`]);
  run('npm', ['test']);
  run('npm', ['run', 'build']);
  run('git', ['diff', '--check']);

  const pkg = JSON.parse(fs.readFileSync(`${root}/package.json`, 'utf8'));
  const version = pkg.version;

  run('git', ['add', '-A']);
  run('git', ['commit', '-m', `release: v${version}`]);
  run('git', ['push', 'origin', sourceBranch]);
  run('git', ['switch', 'release']);
  try {
    run('git', ['pull', '--ff-only', 'origin', 'release']);
    run('git', ['merge', '--no-ff', sourceBranch, '-m', `merge: v${version} into release`]);
    run('git', ['push', 'origin', 'release']);
  } finally {
    run('git', ['switch', sourceBranch]);
  }

  const deploy = deployCommand.trim().split(/\s+/);
  if (!deploy[0]) throw new Error('Deploy command is empty.');
  run(deploy[0], deploy.slice(1));
  console.log(`[release] v${version} deployed successfully.`);
}

try { main(); } catch (error) {
  console.error(`[release] FAILED: ${error.message}`);
  process.exitCode = 1;
}
```

## Git hooks bảo vệ `release`

`.githooks/pre-commit`:

```sh
#!/bin/sh
branch=$(git symbolic-ref --quiet --short HEAD 2>/dev/null || true)
[ "$branch" = "release" ] || exit 0
echo "BLOCKED: direct commits on release are forbidden."
exit 1
```

`.githooks/pre-push`:

```sh
#!/bin/sh
branch=$(git symbolic-ref --quiet --short HEAD 2>/dev/null || true)
[ "$branch" = "release" ] || exit 0
echo "BLOCKED: direct pushes to release are forbidden."
exit 1
```

Kích hoạt:

```bash
git config core.hooksPath .githooks
chmod +x .githooks/pre-commit .githooks/pre-push
```

## Xác minh sau khi cài đặt

```bash
node --check scripts/release-flow.mjs
npm test
npm run build
git diff --check
git status --short
```

Không chạy `npm run release` nếu chưa muốn tạo version, commit, merge và deploy thật.

## Release Bug Notice — Strip Header Comments in JS Artifacts
- **Bug:** `src/js/kaui.js` chứa block comment đầu file:
  ```js
  /**
   * KAUI Core Component Runtime (v1.1.1)
   * Zero-dependency vanilla JavaScript for KAUI Interactive Components:
   * ...
   */
  ```
  Khi build `dist/kaui.min.js`, script hiện tại chỉ dùng `cp src/js/kaui.js dist/kaui.min.js`, dẫn tới việc comment header bị giữ nguyên cả số version cũ `(v1.1.1)` trong file minified trên production / CDN.
- **Yêu cầu đợt #release tiếp theo:**
  Xóa bỏ block comment header này (hoặc tự động strip comments khi build `dist/kaui.min.js` và `dist/kaui.js`) để không còn xuất hiện trong bundle khi inspect response/preview.
