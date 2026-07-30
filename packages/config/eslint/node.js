import { defineConfig } from 'eslint/config';
import globals from 'globals';

import baseConfig from './base.js';

export default defineConfig(baseConfig, {
  files: ['**/*.{js,mjs,cjs,ts,mts,cts}'],
  languageOptions: {
    globals: globals.node,
  },
});
