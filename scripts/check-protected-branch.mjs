#!/usr/bin/env node

const protectedBranch = 'release';
const currentBranch = process.argv[2] || '';

if (currentBranch === protectedBranch) {
  console.error(`\nBLOCKED: direct changes on '${protectedBranch}' are forbidden.`);
  console.error('Work on main or a feature branch, then use #release to publish safely.');
  process.exit(1);
}
