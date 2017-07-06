[![Build Status](https://travis-ci.org/bancek/typescript-format-imports.svg?branch=master)](https://travis-ci.org/bancek/typescript-format-imports)
[![Coverage Status](https://coveralls.io/repos/github/bancek/typescript-format-imports/badge.svg?branch=master)](https://coveralls.io/github/bancek/typescript-format-imports?branch=master)

# Ts Format Imports

TypeScript format imports

# Settings

Add `tsFormatImports` to your `package.json`.

```
{
  ...
  "tsFormatImports": {
    "internalModules": [
      "common",
      "ui"
    ]
  },
  ...
}
```

# Commands list
````
yarn test           // run test(mocha) and coverage report(nyc)
yarn test:watch     // run test on watch mode (without coverage report)
yarn build          // build for both esm (ES5 + ES2015 module) and ES5 UMD bundle, at dist folder.
yarn lint           // run lint against lib and test
````

# License
MIT
