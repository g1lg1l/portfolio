<script setup lang="ts">
const { data: page } = await useAsyncData('about', () => {
  return queryCollection('about').first()
})
if (!page.value) {
  throw createError({
    statusCode: 404,
    statusMessage: 'Page not found',
    fatal: true
  })
}

// The story is markdown in about.yml. It's parsed while prerendering, so the page ships only the
// renderer, not the markdown parser and its code highlighter (about 700 KB)
const { data: story } = await useAsyncData('about-story', async () => {
  const { parseMarkdown } = await import('@nuxtjs/mdc/runtime')
  return parseMarkdown(page.value!.content as unknown as string)
})

const { global } = useAppConfig()

// The toolbox, on two belts running opposite ways; hovering one slows it down
const belts = [
  [
    {
      node: 'TypeScript',
      icon: 'logos:typescript-icon',
      href: 'https://www.typescriptlang.org/'
    },
    {
      node: 'JavaScript',
      icon: 'logos:javascript',
      href: 'https://developer.mozilla.org/en-US/docs/Web/JavaScript'
    },
    { node: 'Vue', icon: 'logos:vue', href: 'https://vuejs.org/' },
    { node: 'Nuxt', icon: 'logos:nuxt-icon', href: 'https://nuxt.com/' },
    { node: 'Svelte', icon: 'logos:svelte-icon', href: 'https://svelte.dev/' },
    {
      node: 'Tailwind CSS',
      icon: 'logos:tailwindcss-icon',
      href: 'https://tailwindcss.com/'
    },
    {
      node: 'Three.js',
      icon: 'logos:threejs',
      href: 'https://threejs.org/',
      invert: true
    }
  ],
  [
    { node: 'Figma', icon: 'logos:figma', href: 'https://figma.com/' },
    {
      node: 'Godot',
      icon: 'logos:godot-icon',
      href: 'https://godotengine.org/'
    },
    { node: 'Vite', icon: 'logos:vitejs', href: 'https://vitejs.dev/' },
    { node: 'Git', icon: 'logos:git-icon', href: 'https://git-scm.com/' },
    {
      node: 'GitHub',
      icon: 'logos:github-icon',
      href: 'https://github.com/',
      invert: true
    },
    { node: 'GitLab', icon: 'logos:gitlab-icon', href: 'https://gitlab.com/' },
    { node: 'Docker', icon: 'logos:docker-icon', href: 'https://docker.com/' },
    {
      node: 'VS Code',
      icon: 'logos:visual-studio-code',
      href: 'https://code.visualstudio.com/'
    }
  ]
]

const seo = page.value?.seo
const title = seo?.title || page.value?.title
const description = seo?.description || page.value?.description

useSeoMeta({
  title,
  ogTitle: title,
  twitterTitle: title,
  description,
  ogDescription: description,
  twitterDescription: description,
  robots: seo?.noindex ? 'noindex, nofollow' : undefined
})
// LogoLoop's slot hands back its own item type: these are always tools
const tool = (item: unknown) => item as (typeof belts)[number][number]
</script>

<template>
  <UPage v-if="page">
    <header class="pt-16 pb-12 sm:pt-24 sm:pb-16">
      <Motion
        as="h1"
        :initial="{ opacity: 0, y: 24 }"
        :animate="{ opacity: 1, y: 0 }"
        :transition="{ duration: 0.7, delay: 0.15, ease: [0.22, 1, 0.36, 1] }"
        class="max-w-[24ch] font-pixel text-4xl sm:text-5xl leading-tight text-highlighted text-balance"
      >
        {{ page.title }}
      </Motion>
    </header>

    <div class="grid gap-12 pb-8 lg:grid-cols-[16rem_1fr] lg:gap-16">
      <aside class="lg:sticky lg:top-24 lg:self-start">
        <!-- Grab it and throw it: it springs back wherever it's dropped -->
        <Motion
          :initial="{ rotate: -6 }"
          drag
          drag-snap-to-origin
          :drag-elastic="0.5"
          :drag-transition="{ bounceStiffness: 500, bounceDamping: 12 }"
          :while-hover="{ scale: 1.06, rotate: -2 }"
          :while-tap="{ scale: 0.94 }"
          :while-drag="{ scale: 1.15, rotate: 8 }"
          class="group relative w-36 cursor-grab active:cursor-grabbing touch-none select-none"
          title="Go on, drag me"
        >
          <!-- A 36px copy blown up without smoothing: the sticker as a sprite.
               Hover or grab it and the full picture renders in, in a few hard steps -->
          <NuxtImg
            src="/sticker.png"
            :alt="global.picture?.alt || 'Gilbert Ndresaj'"
            width="36"
            height="36"
            draggable="false"
            class="w-full [image-rendering:pixelated] drop-shadow-lg pointer-events-none"
          />
          <NuxtImg
            src="/sticker.png"
            alt=""
            width="144"
            height="144"
            densities="x1 x2"
            draggable="false"
            class="absolute inset-0 w-full opacity-0 transition-opacity duration-300 ease-[steps(4)] pointer-events-none group-hover:opacity-100 group-active:opacity-100"
          />
        </Motion>

        <dl class="mt-8 grid gap-4 border-t border-default pt-6">
          <div v-for="fact in page.facts" :key="fact.label">
            <dt class="text-sm text-muted">{{ fact.label }}</dt>
            <dd class="text-highlighted">{{ fact.value }}</dd>
          </div>
        </dl>
        <UButton
          :to="`mailto:${global.email}`"
          icon="i-pixelarticons-mail"
          label="Email me"
          class="mt-6"
        />
      </aside>

      <div class="story max-w-[62ch] text-lg leading-relaxed">
        <MDCRenderer v-if="story" :body="story.body" :data="story.data" />
      </div>
    </div>

    <section class="py-16 sm:py-20">
      <h2 class="font-pixel text-3xl sm:text-4xl text-highlighted">Toolbox</h2>
      <p class="mt-4 max-w-[52ch] text-muted text-pretty">
        My inventory, fully stocked. What I reach for from the first Figma frame
        to the last deploy.
      </p>
      <div class="mt-10 grid gap-6">
        <VuebitsLogoLoop
          v-for="(belt, i) in belts"
          :key="i"
          :logos="belt"
          :speed="40"
          :direction="i ? 'right' : 'left'"
          :gap="40"
          :hover-speed="8"
          fade-out
          fade-out-color="var(--ui-bg)"
          aria-label="Tools I use"
        >
          <template #renderItem="{ item }">
            <ULink
              :to="tool(item).href"
              target="_blank"
              class="group flex items-center gap-2.5 py-2 text-highlighted"
            >
              <Icon
                :name="tool(item).icon"
                size="1.75rem"
                class="grayscale opacity-70 transition duration-300 ease-out group-hover:-translate-y-0.5 group-hover:grayscale-0 group-hover:opacity-100"
                :class="{ 'dark:invert': tool(item).invert }"
              />
              <span class="font-pixel">{{ tool(item).node }}</span>
            </ULink>
          </template>
        </VuebitsLogoLoop>
      </div>
    </section>
  </UPage>
</template>

<style scoped>
.story :deep(h3) {
  margin-top: 3rem;
  font-family: var(--font-pixel);
  font-size: 1.875rem;
  font-weight: 400;
  line-height: 1.1;
}

.story :deep(a) {
  font-family: var(--font-pixel);
  color: var(--ui-primary);
}

.story :deep(p:first-child) {
  margin-top: 0;
}
</style>
