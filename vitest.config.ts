import { defineConfig, mergeConfig } from 'vitest/config';
import viteConfig from './vite.config';

export default mergeConfig(
  viteConfig,
  defineConfig({
    test: {
      globals: true,
      environment: 'jsdom',
      setupFiles: './src/testing/setup-tests.ts',
      exclude: [
        '**/.git/**',
        '**/.next/**',
        '**/*.d.ts', // type definitions
        '**/build/**',
        '**/components/ui/**', // UI components
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
      coverage: {
        exclude: [
          '**/.git/**',
          '**/.next/**',
          '**/*.d.ts', // type definitions
          '**/build/**',
          '**/coverage/**',
          '**/dist/**',
          '**/eslint.*', // eslint config
          '**/main.tsx', // entry point
          '**/node_modules/**',
          '**/public/**',
          '**/setupTests.*', // test setup files
          '**/vite.config.*', // build config
          '**/vitest.config.*', // test config
          '**/components/ui/**', // UI components
        ],
      },
    },
  }),
);
