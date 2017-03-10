import { expect } from 'chai';
import { formatImports } from '../lib';

const input1 = `'use strict';

import { foo } from "./b";
import { bar } from './a';
import * as b from '../b';
import baz from '../../c';
import { writeFileSync } from 'fs';

import {
    one,
    two,
    three
} from './four';

require('./style.scss');

import { join as pathJoin } from 'path';

import './fix';
import * as sortBy from 'lodash/sortBy';

export const lorem = 'ipsum';


export const dolor = 'sit';
`;

const output1 = `'use strict';

import { writeFileSync } from 'fs';
import * as sortBy from 'lodash/sortBy';
import { join as pathJoin } from 'path';

import baz from '../../c';

import * as b from '../b';

import { bar } from './a';
import { foo } from './b';
import './fix';
import {
    one,
    two,
    three
} from './four';

require('./style.scss');

export const lorem = 'ipsum';


export const dolor = 'sit';
`;

describe('# formatImports', () => {
  it('should format imports', () => {
    expect(formatImports(input1.split('\n'))).to.deep.equal(output1.split('\n'));
  });

  it('should ignore format imports', () => {
    expect(formatImports([
      `// typescript-format-imports:ignore`,
      `import './b'`,
      `import './a'`,
    ])).to.deep.equal([
      `// typescript-format-imports:ignore`,
      `import './b'`,
      `import './a'`,
    ]);
  });

  it('throw an error', () => {
    expect(() => formatImports(["import module 'fs';"])).to.throw();
  });
});
