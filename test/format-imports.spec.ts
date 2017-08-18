import { expect } from 'chai';
import { formatImports, FormatImportsOptions } from '../lib';

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

import * as d from '..';

require('./style.scss');

import { join as pathJoin } from 'path';

import './fix';
import * as sortBy from 'lodash/sortBy';

import * as helpers from 'ui/helpers';

import * as utils from 'common/utils';
import * as immutable from 'common/immutable';

export const lorem = 'ipsum';


export const dolor = 'sit';
`;

const output1 = `'use strict';

import { writeFileSync } from 'fs';
import * as sortBy from 'lodash/sortBy';
import { join as pathJoin } from 'path';

import * as immutable from 'common/immutable';
import * as utils from 'common/utils';

import * as helpers from 'ui/helpers';

import baz from '../../c';

import * as d from '..';
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
    const options: FormatImportsOptions = {
      internalModules: new Set(['common', 'ui']),
    };

    const output = formatImports(input1.split('\n'), options);

    expect(output).to.deep.equal(output1.split('\n'));

    const outputAgain = formatImports(output, options);

    expect(outputAgain).to.deep.equal(output1.split('\n'));
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
    expect(() => formatImports(['import module \'fs\';'])).to.throw();
  });
});
