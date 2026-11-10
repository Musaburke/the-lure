// @ts-check
import { defineConfig } from 'astro/config';

// https://astro.build/config
export default defineConfig({
  site: 'https://the-lure.pages.dev', // TODO(musa): set the real address once Cloudflare Pages gives one
  devToolbar: { enabled: false },
});
