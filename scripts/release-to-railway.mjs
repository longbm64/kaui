#!/usr/bin/env node

import { execFileSync } from 'node:child_process';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';

const ROOT = process.cwd();
const RELEASE_BRANCH = 'release';
const remote = 'origin';

function git(...args) {
  return execFileSync('git', args, { cwd: ROOT, encoding: 'utf8', stdio: ['ignore', 'pipe', 'pipe'] }).trim();
}

function run(command, args, cwd) {
  execFileSync(command, args, { cwd, stdio: 'inherit' });
}

function fail(message) {
  console.error(`\nRelease stopped: ${message}`);
  process.exit(1);
}

const sourceBranch = git('branch', '--show-current');
if (!sourceBranch) fail('detached HEAD is not supported; checkout a source branch first.');
if (sourceBranch === RELEASE_BRANCH) fail(`you are already on '${RELEASE_BRANCH}'; run this command from main or another development branch.`);
if (git('status', '--porcelain')) fail('working tree is not clean; commit or stash changes before releasing.');

const sourceCommit = git('rev-parse', 'HEAD');
console.log(`Preparing release from '${sourceBranch}' (${sourceCommit}) to '${RELEASE_BRANCH}'...`);
git('fetch', remote, RELEASE_BRANCH);
const releaseRef = `${remote}/${RELEASE_BRANCH}`;
const worktree = fs.mkdtempSync(path.join(os.tmpdir(), 'kaui-release-'));

try {
  run('git', ['worktree', 'add', '--detach', worktree, releaseRef], ROOT);
  run('git', ['merge', '--no-ff', '--no-edit', sourceCommit], worktree);
  run('npm', ['ci'], worktree);
  run('npm', ['test'], worktree);
  run('npm', ['run', 'build'], worktree);

  console.log(`Pushing merged '${RELEASE_BRANCH}' to ${remote}; Railway will deploy it automatically.`);
  run('git', ['push', remote, `HEAD:refs/heads/${RELEASE_BRANCH}`], worktree);
} catch (error) {
  fail(`merge, verification, or push failed. No release push was completed unless the push step had already succeeded. Resolve the issue and retry. (${error.status ?? 'unknown status'})`);
} finally {
  try { run('git', ['worktree', 'remove', '--force', worktree], ROOT); } catch { /* preserve original failure */ }
}

console.log(`Release complete: ${sourceBranch} -> ${RELEASE_BRANCH}`);
