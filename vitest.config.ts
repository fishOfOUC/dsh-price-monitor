import { defineConfig } from 'vitest/config'

/**
 * The cross-check tests import `deriveTurnTokenUsage` straight from the
 * deepseek-harness checkout (the harness workspace symlinks resolve its
 * imports). Vite's fs guard must therefore allow the harness tree.
 */
export default defineConfig({
  test: {
    include: ['tests/**/*.spec.{ts,tsx}'],
  },
  server: {
    fs: {
      allow: ['E:/tools/code_soft/deepseek-harness'],
    },
  },
})
