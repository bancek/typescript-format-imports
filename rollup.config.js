const nodeResolve = require('rollup-plugin-node-resolve');

export default {
  input: 'dist/index.js',
  output: {
    format: 'umd',
    name: 'typescript-format-imports'
  },
  plugins: [
    nodeResolve(),
  ],
  external: [

  ],
  onwarn: ( warning ) => {
      const skip_codes = [
          'THIS_IS_UNDEFINED',
          'MISSING_GLOBAL_NAME'
      ];
      if ( skip_codes.indexOf(warning.code) != -1 ) return;
      console.error(warning);
  }
};
