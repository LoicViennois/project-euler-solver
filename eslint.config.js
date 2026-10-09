import js from '@eslint/js';
import { defineConfig, globalIgnores } from 'eslint/config';
import reactHooks from 'eslint-plugin-react-hooks';
import reactRefresh from 'eslint-plugin-react-refresh';
import globals from 'globals';
import tseslint from 'typescript-eslint';

export default defineConfig([
  globalIgnores([
    'dist',
    'dev-dist',
    '.claude/worktrees',
    'playwright-report',
    'test-results',
    'coverage',
    'src/routeTree.gen.ts',
  ]),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      js.configs.recommended,
      tseslint.configs.strict,
      reactHooks.configs.flat.recommended,
      reactRefresh.configs.vite,
    ],
    languageOptions: {
      globals: globals.browser,
    },
  },
  {
    files: ['src/routes/**/*.tsx'],
    rules: {
      // TanStack Router route files export `Route` alongside their components
      'react-refresh/only-export-components': 'off',
    },
  },
  {
    files: ['src/problems/**/*.ts'],
    rules: {
      // Solutions index arrays within bounds their loops already guarantee
      '@typescript-eslint/no-non-null-assertion': 'off',
    },
  },
]);
