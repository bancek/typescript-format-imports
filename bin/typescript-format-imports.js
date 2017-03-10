#!/usr/bin/env node

const fs = require('fs');

const { formatImports } = require('../typescript-format-imports.bundle');

if (process.argv.length < 3) {
  process.stderr.write('Usage: typescript-format-imports.js [file.ts]\n');
  process.exit(1);
}

const filename = process.argv[2];

const originalContent = fs.readFileSync(filename).toString();
const originalLines = originalContent.split('\n');

const lines = formatImports(originalLines);
const newContent = lines.join('\n');

if (newContent !== originalContent) {
  fs.writeFileSync(filename, newContent);
}
