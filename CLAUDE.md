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

## Deploy target

**GitHub Pages** is the site (`.github/workflows/deploy-pages.yml`), served from `/portfolio/`. `runtimeConfig.public.siteUrl` defaults to `https://g1lg1l.github.io/portfolio`, so canonical/OG URLs point there.

Because of the `/portfolio/` base URL, **never hardcode a root-relative asset path** in markup: `<img src="/x.png">` or `href="/favicon.ico"` breaks on Pages. Use `<NuxtImg>` (also optimizes; external URLs pass through untouched), `<NuxtLink>`/`<ULink>`, or prefix with `useRuntimeConfig().app.baseURL`.

## Content

- `content/*.yml` drive the pages; the schemas are in `content.config.ts`.
- `content/projects/*.yml`, one per project, sorted by `date` desc. `featured: true` + `tagline` + `screenshots` renders `app/components/ProjectShowcase.vue` (screenshot fan, phone frames when `category: iOS`); the rest render as rows under "Earlier work" in `app/pages/projects.vue`.
- `stars: owner/repo` is the GitHub repo. Star counts are fetched in `projects.vue` during prerender and ship in the payload; on failure (rate limit) the count is hidden. `NUXT_GITHUB_TOKEN` lifts the limit (the Pages workflow passes `GITHUB_TOKEN`).
- Project images live in `public/images/projects/<slug>/`.
- Blog and Speaking pages exist but are hidden: their nav links are commented out in `app/utils/links.ts`. The Cmd+K content search (`UContentSearch` in `app.vue`) went with them: it loaded Nuxt Content's SQLite (about 1 MB) on every page just to search the blog. Bring it back from git with the blog.

## Code style

- Prettier: single quotes, no semicolons, no trailing commas. ESLint via `@nuxt/eslint` with stylistic `commaDangle: never`, `braceStyle: 1tbs`.
- Prefer Nuxt UI components and Tailwind utilities; scoped CSS only for what utilities can't express (see `ProjectShowcase.vue`).
- Motion: user-triggered "juice" (hover, drag, press) over scroll-triggered entrances. Always honour `prefers-reduced-motion`.
- Look: Pixelify Sans (`font-pixel`) for headings, buttons, links and the game bits, Public Sans for text, Tailwind's violet as `primary` (600 in light mode for contrast, 400 in dark). Icons are `i-pixelarticons-*`.
- The logo is me as a 16x16 pixel sticker: the `LOGO` grid and `LOGO_COLORS` in `app/utils/sprite.ts`, drawn by `PixelLogo.vue`. `public/favicon.svg`, `favicon.ico` and `apple-touch-icon.png` are rendered from the same grid: redraw them if it changes.
- The hero is `GameBoyAdvance.vue`: the downloaded model `public/models/retro-handheld.glb` ("Retro Handheld" by Michael Fuchs, CC-BY 3.0, credited in the footer), recoloured and cel-shaded with three.js, rendered small and upscaled pixelated. It's one mesh, so the screen and the button hit areas are laid over it in the model's units. Its 240x160 screen runs the runner from `app/utils/runner.ts`; clicking it moves the canvas into a fixed stage over a dimmed page, where its menus list projects and games (passed in by `landing/Hero.vue`). `BurnTransition.vue` is the page transition, a port of Runewheel's burn shader on the View Transitions API: the old page's snapshot is masked frame by frame while a small canvas draws the fire (no view transitions, or reduced motion: pages just swap).
- The background is `PixelSeasons.vue` (in the layout): Vue Bits' PixelSnow shader rewritten on plain WebGL2 at ~240px wide. What falls follows the season by month (`app/utils/seasons.ts`: snowflakes, petals, fireflies, leaves, with colours per theme); the footer's button flips through them via `useState('season')`, and `?season=` picks one.
- Icons pixelarticons lacks live in `app/assets/icons/` as `i-pixel-<name>` (itch.io).
- `app/components/vuebits/` are vendored Vue Bits components (MIT + Commons Clause): each starts with a comment saying what was changed. ESLint skips that folder; keep them close to upstream.
- Games: `content/games/*.yml` drive `app/pages/games.vue` (bosses, characters, runes and a devlog are optional lists); art and sprites in `public/images/games/<slug>/`. Sprites copied from the Runewheel repo: boss frames cropped from their idle sheets, character sheets as they are (two 64px frames, animated in CSS).
- Vendored files with `// @ts-nocheck` are upstream code that isn't strict-null clean; keep the comment if you update them.

## Performance

- Pages has no server: icons that only render in the browser must be in Nuxt Icon's client bundle (`icon.clientBundle` in `nuxt.config.ts`). Icon names built at runtime (the theme toggle's) are listed there by hand, since the scan can't see them.
- Heavy components (three.js, ogl) are used as `Lazy…` so they load after the page, and chunk prefetching is off (`build:manifest` hook): a lazy chunk loads only when something renders it.
- The About story is markdown parsed while prerendering (`parseMarkdown` in `about.vue`), so the client ships `MDCRenderer`, not the parser. Don't swap it back to `<MDC :value>`.
- Images for components that take raw URLs (`Stack`, `FlexCarousel`) bypass Nuxt Image: give them small files (the Runewheel screenshots are 960px WebP).

## Dependencies

- TypeScript stays on 6.x: TS 7 ships without the JS compiler API that `vue-tsc` needs.
- Renovate is configured (`renovate.json`).
