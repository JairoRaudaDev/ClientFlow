import { defineConfig, globalIgnores } from 'eslint/config';
import nextCoreWebVitals from 'eslint-config-next/core-web-vitals';

import baseConfig from '@clientflow/config/eslint/base';

const nextConfig = nextCoreWebVitals.filter((entry) => entry.name !== 'next/typescript');

export default defineConfig(
  globalIgnores(['.next/**', 'next-env.d.ts']),
  ...nextConfig,
  baseConfig,
);
