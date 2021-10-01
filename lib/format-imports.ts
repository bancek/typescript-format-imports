import groupBy from 'lodash-es/groupBy';
import sortBy from 'lodash-es/sortBy';
import toPairs from 'lodash-es/toPairs';

export interface FormatImportsOptions {
  internalModules?: Set<string>;
}

export function importPath(text: string): string {
  let match = text.match(/from '(.*)'/);

  if (match == null) {
    match = text.match(/import '(.*)'/);
  }

  if (match == null) {
    match = text.match(/import .* = require\('(.*)'\)/);
  }

  if (match == null) {
    throw new Error(`typescript-format-imports: invalid import ${text}`);
  } else {
    return match[1];
  }
}

function leftPad(num: number, size: number) {
  return ('000000000' + num).substr(-size);
}

export function pathKey(path: string, internalModules: Set<string>): string {
  if (path.startsWith('./') || path === '.') {
    if (/\.(css|scss|sass)$/.test(path)) {
      return '10010';
    } else {
      return '10000';
    }
  } else if (path === '..') {
    return '09999';
  } else if (/\.\.\//.test(path)) {
    return leftPad(10000 - path.split('/').filter(x => x === '..').length, 5);
  } else {
    let key = '00100';

    internalModules.forEach((module) => {
      if (path.indexOf(module) === 0) {
        key = '01000' + module;
      }
    });

    return key;
  }
}

export function formatImports(originalLines: string[], options?: FormatImportsOptions): string[] {
  const internalModules = options != null && options.internalModules != null ?
    options.internalModules : new Set<string>();

  let imports: string[] = [];

  const beforeLines: string[] = [];
  const afterLines: string[] = [];

  let ignore = false;
  let wasImport = false;
  let isBeforeImports = true;
  let multiLineImport: string[] | undefined;

  originalLines.forEach((text) => {
    if (/^\/\/ typescript-format-imports:ignore/.test(text)) {
      ignore = true;
    }

    if (multiLineImport !== undefined) {
      multiLineImport.push(text);

      if (/}/.test(text)) {
        imports.push(multiLineImport.join('\n'));
        multiLineImport = undefined;
      }
    } else if (/^import /.test(text)) {
      if (/{/.test(text) && !/}/.test(text)) {
        multiLineImport = [text];
      } else {
        imports.push(text);
      }

      isBeforeImports = false;
      wasImport = true;
    } else if (isBeforeImports) {
      beforeLines.push(text);
    } else if (text === '' && (wasImport || afterLines.length === 0)) {
      wasImport = false;
    } else {
      afterLines.push(text);
      wasImport = false;
    }
  });

  if (ignore) {
    return originalLines;
  }

  imports = imports.map(text => text.replace(/"/g, `'`));

  const groupedImports = groupBy(imports, text => pathKey(importPath(text), internalModules));
  const groupedImportsPairs = toPairs(groupedImports)
    .map(x => [x[0], x[1]] as [string, string[]]);

  const sortedGroups = sortBy(groupedImportsPairs, x => x[0]);

  const importLines: string[] = [];

  sortedGroups.forEach((x) => {
    sortBy(x[1], text => importPath(text))
      .forEach((text) => {
        text.split('\n').forEach(line => importLines.push(line));
      });
    importLines.push('');
  });

  const lines = beforeLines.concat(importLines).concat(afterLines);

  return lines;
}
