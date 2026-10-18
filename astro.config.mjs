import { defineConfig } from 'astro/config';

// ZAKUIKit documentation platform — static output, zero integrations beyond Astro core.
// Every interactive behaviour is shipped as native ES modules scoped per-page.
export default defineConfig({
  site: 'https://zak-ui.dev',
  compressHTML: true,
  prefetch: {
    prefetchAll: false,
    defaultStrategy: 'hover',
  },
  build: {
    inlineStylesheets: 'auto',
  },
  // Legacy documentation URLs keep resolving after catalog moves/renames.
  redirects: {
    '/docs/forms/toggle': '/docs/buttons/button-toggle',
    '/docs/forms/dynamic-form': '/docs/forms/dynamic-field',
  },
  devToolbar: {
    enabled: false,
  },
});
