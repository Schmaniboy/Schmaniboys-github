import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    include: ['packages/**/*.test.ts', 'apps/**/*.test.ts'],
    exclude: ['**/node_modules/**', '**/.next/**'],
    environment: 'node',
    setupFiles: ['./vitest.setup.ts'],
    passWithNoTests: false,
    // Integrationstests teilen sich eine Datenbank und duerfen sich nicht
    // gegenseitig die Zeilen unter den Fuessen wegloeschen.
    fileParallelism: false,
  },
});
