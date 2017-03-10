import groupBy from 'lodash-es/groupBy';
import reverse from 'lodash-es/reverse';
import sortBy from 'lodash-es/sortBy';
import toPairs from 'lodash-es/toPairs';

export function importPath(text: string): string {
  let match = text.match(/from '(.*)'/);

  if (match == null) {
    match = text.match(/import '(.*)'/);
  }

  if (match == null) {
    throw new Error(`typescript-format-imports: invalid import ${text}`);
  } else {
    return match[1];
  }
}

export function pathDepth(path: string): number {
  if (path.startsWith('./')) {
    return 1;
  } else if (/\.\.\//.test(path)) {
    return 1 + path.split('/').filter((x) => x === '..').length;
  } else {
    return 0;
  }
}

export function formatImports(originalLines: string[]): string[] {
  let imports: string[] = [];

  const beforeLines: string[] = [];
  const afterLines: string[] = [];

  let ignore = false;
  let wasImport = false;
  let isBeforeImports = true;
  let multiLineImport: string[] | null = null;

  originalLines.forEach((text) => {
    if (/^\/\/ typescript-format-imports:ignore/.test(text)) {
      ignore = true;
    }

    if (multiLineImport != null) {
      multiLineImport.push(text);

      if (/}/.test(text)) {
        imports.push(multiLineImport.join('\n'));
        multiLineImport = null;
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

  imports = imports.map((text) => text.replace(/"/g, `'`));

  const groupedImports = groupBy(imports, (text) => pathDepth(importPath(text)));
  const groupedImportsPairs = toPairs(groupedImports)
    .map((x) => [parseInt(x[0], 10), x[1]] as [number, string[]]);

  const sortedGroups = reverse(
    sortBy(groupedImportsPairs, (x) => x[0] === 0 ? Infinity : x[0]),
  ) as Array<[number, string[]]>;

  const importLines: string[] = [];

  sortedGroups.forEach((x) => {
    sortBy(x[1], (text) => importPath(text))
      .forEach((text) => {
        text.split('\n').forEach((line) => importLines.push(line));
      });
    importLines.push('');
  });

  const lines = beforeLines.concat(importLines).concat(afterLines);

  return lines;
}
