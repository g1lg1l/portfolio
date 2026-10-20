// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  modules: [
    '@nuxt/eslint',
    '@nuxt/image',
    '@nuxt/icon',
    '@nuxt/ui',
    '@nuxt/content',
    '@vueuse/nuxt',
    'motion-v/nuxt',
    // Vercel-only: the script 404s anywhere else (e.g. GitHub Pages)
    ...(process.env.VERCEL ? ['@vercel/analytics/nuxt'] : [])
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
      collections: ['simple-icons', 'lucide', 'logos']
    }
  },

  // Resized at build time into static files, never by Vercel's (metered) image optimizer
  image: {
    provider: 'ipx'
  },
})
