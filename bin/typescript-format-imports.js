#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const readPkgUp = require('read-pkg-up');

const { formatImports } = require('../typescript-format-imports.bundle');

if (process.argv.length < 3) {
  process.stderr.write('Usage: typescript-format-imports.js [file.ts]\n');
  process.exit(1);
}

const filename = process.argv[2];
const parentPath = path.resolve(path.join(filename, '..'));

const package = readPkgUp.sync({ cwd: parentPath });
const pkg = package.pkg || package.package || package.packageJson;

const options = {};

if (
  pkg != null &&
  pkg.tsFormatImports != null &&
  pkg.tsFormatImports.internalModules != null &&
  pkg.tsFormatImports.internalModules.length > 0
) {
  options.internalModules = new Set(pkg.tsFormatImports.internalModules);
}

const originalContent = fs.readFileSync(filename).toString();
const originalLines = originalContent.split('\n');

let lines = null;

try {
  lines = formatImports(originalLines, options);
} catch (e) {
  console.log(filename + ': ' + e);
  process.exit(1);
}

const newContent = lines.join('\n');

if (newContent !== originalContent) {
  fs.writeFileSync(filename, newContent);
}
