// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  modules: [
    '@nuxt/eslint',
    '@nuxt/image',
    '@nuxt/icon',
    '@nuxt/ui',
    '@nuxt/content',
    '@vueuse/nuxt',
    'motion-v/nuxt'
  ],

  devtools: {
    enabled: false
  },

  css: ['~/assets/css/main.css'],

  runtimeConfig: {
    // Optional, lifts the GitHub API rate limit for star counts (NUXT_GITHUB_TOKEN)
    githubToken: '',
    public: {
      // Canonical and Open Graph URLs, on every deployment
      siteUrl:
        process.env.NUXT_PUBLIC_SITE_URL || 'https://g1lg1l.github.io/portfolio'
    }
  },

  compatibilityDate: '2024-11-01',

  nitro: {
    prerender: {
      routes: ['/'],
      crawlLinks: true
    }
  },

  hooks: {
    // No speculative downloads of every lazy chunk (three.js, the About page's markdown parser):
    // each loads when a page renders the component that needs it
    'build:manifest': (manifest) => {
      for (const item of Object.values(manifest)) item.prefetch = false
    }
  },

  eslint: {
    config: {
      stylistic: {
        commaDangle: 'never',
        braceStyle: '1tbs'
      }
    }
  },

  icon: {
    provider: 'server',
    serverBundle: {
      collections: ['simple-icons', 'lucide', 'logos', 'pixelarticons']
    },
    // Pixel icons pixelarticons doesn't have (itch.io): i-pixel-<file name>
    customCollections: [{ prefix: 'pixel', dir: './app/assets/icons' }],
    // Pages has no server to fetch icons from at runtime: every icon that only renders in the
    // browser (client-only components, the theme toggle) has to ship in the client bundle
    clientBundle: {
      scan: { globInclude: ['app/**/*.{vue,ts}', 'content/**/*.yml'] },
      // Built from a variable, so the scan can't see them
      icons: ['pixelarticons:sun', 'pixelarticons:moon'],
      includeCustomCollections: true
    }
  },

  // Resized at build time into static files, never by a metered image optimizer
  image: {
    provider: 'ipx'
  }
})
