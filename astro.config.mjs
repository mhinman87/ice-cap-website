// @ts-check
import { defineConfig } from 'astro/config';

import sitemap from '@astrojs/sitemap';

// https://astro.build/config
export default defineConfig({
  site: 'https://icecaplabs.com',
  integrations: [sitemap()],
  redirects: {
    '/lead-automation': '/lead-capture',
    '/customer-automation': '/chatbot',
    '/call-assistant': '/booking',
    '/operations-automation': '/operations',
  },
});