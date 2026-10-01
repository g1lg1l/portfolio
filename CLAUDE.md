# Portfolio

Gil's personal site. Nuxt 4 + Nuxt UI 4 + Nuxt Content 3, Tailwind 4, motion-v. Fully prerendered (`nitro.prerender.crawlLinks`), no server routes. `README.md` is the public presentation; this file is for working on the code.

## Commands

```sh
npm run dev         # http://localhost:3000
npm run lint        # must pass
npm run typecheck   # app/components/sfx/ColorBends.vue has known errors (unused three.js effect); ignore those, add no new ones
npx prettier --write <files you touched>   # many older files aren't formatted; don't reformat them as a side effect
NUXT_APP_BASE_URL=/portfolio/ npx nuxt build --preset github_pages   # the GitHub Pages build
```

To view the Pages build, serve a folder that contains `portfolio -> .output/public` (e.g. `python3 -m http.server`) and open `/portfolio/`.

## Two deploy targets

- **GitHub Pages** is the main site (`.github/workflows/deploy-pages.yml`), served from `/portfolio/`. `runtimeConfig.public.siteUrl` defaults to `https://g1lg1l.github.io/portfolio`, so canonical/OG URLs point there from every deployment.
- **Vercel** is a mirror (gilgil.vercel.app) on the Hobby plan, so keep it cheap: `vercel.json` runs `nuxt generate` (preset `vercel-static`, zero functions) and `image.provider: 'ipx'` pre-renders images instead of using Vercel's metered optimizer. `@vercel/analytics/nuxt` is only added when `process.env.VERCEL` is set. Don't add server routes, ISR or Speed Insights.

Because of the `/portfolio/` base URL, **never hardcode a root-relative asset path** in markup: `<img src="/x.png">` or `href="/favicon.ico"` breaks on Pages. Use `<NuxtImg>` (also optimizes; external URLs pass through untouched), `<NuxtLink>`/`<ULink>`, or prefix with `useRuntimeConfig().app.baseURL`.

## Content

- `content/*.yml` drive the pages; the schemas are in `content.config.ts`.
- `content/projects/*.yml`, one per project, sorted by `date` desc. `featured: true` + `tagline` + `screenshots` renders `app/components/ProjectShowcase.vue` (screenshot fan, phone frames when `category: iOS`); the rest render as rows under "Earlier work" in `app/pages/projects.vue`.
- `stars: owner/repo` is the GitHub repo. Star counts are fetched in `projects.vue` during prerender and ship in the payload; on failure (rate limit) the count is hidden. `NUXT_GITHUB_TOKEN` lifts the limit (the Pages workflow passes `GITHUB_TOKEN`).
- Project images live in `public/projects/<slug>/`.
- Blog and Speaking pages exist but are hidden: their nav links are commented out in `app/utils/links.ts`.

## Code style

- Prettier: single quotes, no semicolons, no trailing commas. ESLint via `@nuxt/eslint` with stylistic `commaDangle: never`, `braceStyle: 1tbs`.
- Prefer Nuxt UI components and Tailwind utilities; scoped CSS only for what utilities can't express (see `ProjectShowcase.vue`).
- Motion: user-triggered "juice" (hover, drag, press) over scroll-triggered entrances. Always honour `prefers-reduced-motion`.

## Dependencies

- `overrides.vue-router` pins vue-router 5: `@vercel/analytics@2` declares an optional peer of `vue-router@^4`, which breaks `npm ci` against Nuxt 4.5 without it. Drop the override once they accept v5.
- TypeScript stays on 6.x: TS 7 ships without the JS compiler API that `vue-tsc` needs.
- Renovate is configured (`renovate.json`).
