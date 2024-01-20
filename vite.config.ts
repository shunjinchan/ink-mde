/// <reference types="vitest" />

import { resolve } from 'node:path'
import { defineConfig } from 'vite'
import solidjs from 'vite-plugin-solid'

// https://vitejs.dev/config/
export default defineConfig(({ isSsrBuild }) => {
  return {
    build: {
      emptyOutDir: false,
      lib: {
        entry: './src/index.tsx',
        fileName: 'client',
      },
      rollupOptions: {
        output: [
          {
            esModule: true,
            exports: 'named',
            format: 'es',
          },
          {
            exports: 'named',
            format: 'cjs',
            inlineDynamicImports: true,
            interop: 'esModule',
          },
        ],
      },
      sourcemap: true,
      target: 'esnext',
    },
    plugins: [
      solidjs({
        solid: {
          generate: isSsrBuild ? 'ssr' : 'dom',
          hydratable: true,
          omitNestedClosingTags: false,
        },
      }),
    ],
    resolve: {
      alias: {
        '/': resolve(__dirname, './'),
        'ink-mde': resolve(__dirname, './src/index'),
      },
      conditions: [
        'browser',
        'node',
        'solid',
      ],
    },
    optimizeDeps: {
      exclude: ['@codemirror/state'],
    },
    test: {
      clearMocks: true,
      deps: {
        inline: [
          'solid-js',
        ],
      },
      environment: 'jsdom',
    },
  }
})
