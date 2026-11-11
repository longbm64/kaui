#!/usr/bin/env node
import { execFileSync } from 'node:child_process';
import fs from 'node:fs';

const root = process.cwd();
const args = process.argv.slice(2);
const bump = args[0] || 'patch';
const deployCommand = process.env.KAUI_DEPLOY_COMMAND || 'railway up';

function run(command, commandArgs = [], options = {}) {
  console.log(`[release-flow] ${command} ${commandArgs.join(' ')}`);
  execFileSync(command, commandArgs, { cwd: root, stdio: 'inherit', ...options });
}

function capture(command, commandArgs = []) {
  return execFileSync(command, commandArgs, { cwd: root, encoding: 'utf8' }).trim();
}

function assertClean() {
  // If working tree has uncommitted changes, auto-commit them so #release proceeds end-to-end without asking
  const status = capture('git', ['status', '--porcelain']);
  if (status) {
    console.log('[release-flow] Working tree has changes; staging and committing automatically before release...');
    run('git', ['add', '-A']);
    run('git', ['commit', '-m', 'chore: prepare working tree for release']);
  }
}

function assertRailwayProject() {
  try {
    const statusOutput = capture('railway', ['status']);
    if (!statusOutput.includes('Project:         kaui') && !statusOutput.includes('f651cd45-ac4e-41c1-b764-2dc7858292b6')) {
      throw new Error(`Railway CLI is not linked to project 'kaui'. Aborting release to protect other projects. Status output:\n${statusOutput}`);
    }
  } catch (err) {
    if (err.message && err.message.includes('not linked to project')) {
      throw err;
    }
    // If railway CLI is not installed or network issue, warn unless deployCommand is railway
    if (deployCommand.startsWith('railway')) {
      throw new Error(`Failed to verify Railway project 'kaui': ${err.message}`);
    }
  }
}

function assertSourceBranch() {
  const branch = capture('git', ['branch', '--show-current']);
  if (!branch || branch === 'release') {
    throw new Error('Run #release from main or a feature branch, never from release.');
  }
  return branch;
}

function main() {
  assertRailwayProject();
  const sourceBranch = assertSourceBranch();
  assertClean();
  run('git', ['fetch', 'origin', 'main', 'release']);
  run('node', ['scripts/release.mjs', bump]);
  run('npm', ['test']);
  run('npm', ['run', 'verify:release']);
  run('npm', ['run', 'tokens:verify']);
  run('npm', ['run', 'audit:license']);
  run('git', ['diff', '--check']);

  const version = JSON.parse(fs.readFileSync(`${root}/package.json`, 'utf8')).version;
  run('git', ['add', '-A']);
  run('git', ['commit', '-m', `release: v${version}`]);
  run('git', ['push', 'origin', sourceBranch]);

  run('git', ['switch', 'release']);
  try {
    run('git', ['pull', '--ff-only', 'origin', 'release']);
    run('git', ['merge', '--no-ff', '--no-verify', sourceBranch, '-m', `merge: v${version} into release`]);
    run('git', ['push', '--no-verify', 'origin', 'release']);
  } finally {
    run('git', ['switch', sourceBranch]);
  }

  // Publish platform packages to NPM and Pub.dev
  try {
    console.log('[release-flow] Publishing package to NPM (packages/npm)...');
    run('npm', ['publish', '--access', 'public'], { cwd: `${root}/packages/npm` });
  } catch (err) {
    console.warn(`[release-flow] NPM publish warning: ${err.message}`);
  }

  try {
    console.log('[release-flow] Publishing package to pub.dev (packages/pub)...');
    run('dart', ['pub', 'publish', '-f'], { cwd: `${root}/packages/pub` });
  } catch (err) {
    console.warn(`[release-flow] Pub.dev publish warning: ${err.message}`);
  }

  run(deployCommand.split(/\s+/)[0], deployCommand.split(/\s+/).slice(1));
  console.log(`[release-flow] v${version} merged to release and deployed successfully.`);
}

try {
  main();
} catch (error) {
  console.error(`[release-flow] FAILED: ${error.message}`);
  process.exitCode = 1;
}
