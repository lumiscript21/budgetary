import { defineConfig } from 'vite';
import path from 'path';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';
import tsconfigPaths from 'vite-tsconfig-paths';
import { resolve } from 'path';

import { fileURLToPath } from 'node:url';
import { storybookTest } from '@storybook/addon-vitest/vitest-plugin';

const dirname =
  typeof __dirname !== 'undefined'
    ? __dirname
    : path.dirname(fileURLToPath(import.meta.url));

// More info at: https://storybook.js.org/docs/next/writing-tests/integrations/vitest-addon
export default defineConfig({
  plugins: [react(), tailwindcss(), tsconfigPaths()],
  resolve: {
    alias: [{ find: '@', replacement: resolve(__dirname, './src') }],
  },
  server: {
    host: true,
  },
  test: {
    projects: [
      {
        extends: true,
        plugins: [
          // The plugin will run tests for the stories defined in your Storybook config
          // See options at: https://storybook.js.org/docs/next/writing-tests/integrations/vitest-addon#storybooktest
          storybookTest({
            configDir: path.join(dirname, '.storybook'),
          }),
        ],
        test: {
          name: 'storybook',
          browser: {
            enabled: true,
            headless: true,
            provider: 'playwright',
            instances: [
              {
                browser: 'chromium',
              },
            ],
          },
          setupFiles: ['.storybook/vitest.setup.ts'],
        },
      },
      {
        test: {
          name: 'unit',
          globals: true,
          environment: 'jsdom',
          setupFiles: './src/testing/setup-tests.ts',
          alias: [{ find: '@', replacement: resolve(__dirname, './src') }],
          exclude: [
            '**/.git/**',
            '**/.next/**',
            '**/*.d.ts', // type definitions
            '**/build/**',
            '**/commitlint.*', // commit lint config
            '**/coverage/**',
            '**/dist/**',
            '**/eslint.*', // eslint config
            '**/main.tsx', // entry point
            '**/node_modules/**',
            '**/public/**',
            '**/setupTests.*', // test setup files
            '**/vite.config.*', // build config
            '**/vitest.config.*', // test config
          ],
        },
      },
    ],
    coverage: {
      exclude: [
        '**/.git/**',
        '**/.next/**',
        '**/*.d.ts', // type definitions
        '**/build/**',
        '**/commitlint.*', // commit lint config
        '**/coverage/**',
        '**/components/ui/**',
        '**/dist/**',
        '**/eslint.*', // eslint config
        '**/main.tsx', // entry point
        '**/node_modules/**',
        '**/public/**',
        '**/setupTests.*', // test setup files
        '**/vite.config.*', // build config
        '**/vitest.config.*', // test config
      ],
    },
  },
});
