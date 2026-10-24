import { defineConfig } from 'astro/config';

export default defineConfig({
  output: 'static',
  compressHTML: true,
  build: {
    inlineStylesheets: 'always',
  },
  vite: {
    build: {
      // Keep every script as an external file so the CSP can stay at script-src 'self'.
      assetsInlineLimit: 0,
    },
  },
  devToolbar: {
    enabled: false,
  },
});
