<script setup lang="ts">
import type { IndexCollectionItem } from '@nuxt/content'

const { global } = useAppConfig()

defineProps<{
  page: IndexCollectionItem
}>()

// What the Game Boy's menus list (same queries as Selected work and the Games page, so they're shared)
const [{ data: projects }, { data: games }] = await Promise.all([
  useAsyncData('projects', () =>
    queryCollection('projects').order('date', 'DESC').all()
  ),
  useAsyncData('games', () =>
    queryCollection('games').order('date', 'DESC').all()
  )
])
const projectEntries = computed(() => [
  ...(projects.value ?? []).map((p) => ({
    title: p.title,
    to: `/projects#${p.slug}`,
    note: p.tagline || p.description
  })),
  {
    title: 'All projects',
    to: '/projects',
    note: 'The full list, with screenshots'
  }
])
const gameEntries = computed(() => [
  ...(games.value ?? []).map((g) => ({
    title: g.title,
    to: `/games#${g.slug}`,
    note: g.tagline
  })),
  {
    title: 'More on itch.io',
    to: 'https://g1lg1l.itch.io/',
    note: 'Everything I’ve put out so far'
  }
])

const rise = (delay: number) => ({
  initial: { opacity: 0, y: 24 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.7, delay, ease: [0.22, 1, 0.36, 1] }
})
</script>

<template>
  <section
    class="relative isolate grid items-center gap-y-8 pt-16 pb-12 sm:pt-24 sm:pb-20 lg:grid-cols-[1fr_auto] lg:gap-x-6"
  >
    <!-- Pixels trail the pointer across the whole hero, under everything -->
    <ClientOnly>
      <div
        class="pointer-events-none absolute inset-y-0 left-1/2 -z-10 w-screen -translate-x-1/2 opacity-40 mask-b-from-60%"
        aria-hidden="true"
      >
        <LazyVuebitsPixelTrail
          :grid-size="56"
          :trail-size="0.08"
          :max-age="400"
          color="#8b5cf6"
        />
      </div>
    </ClientOnly>

    <figure class="w-full max-w-md lg:order-last lg:w-[30rem]">
      <div class="aspect-[3/2]">
        <ClientOnly>
          <LazyGameBoyAdvance :projects="projectEntries" :games="gameEntries" />
        </ClientOnly>
      </div>
      <Motion
        as="figcaption"
        v-bind="rise(1.2)"
        class="mt-1 text-center font-pixel text-sm text-muted"
      >
        Click to pick it up
      </Motion>
    </figure>

    <div>
      <Motion
        as="h1"
        v-bind="rise(0.25)"
        class="font-pixel text-6xl sm:text-7xl lg:text-8xl leading-none text-highlighted text-balance"
      >
        {{ page.title }}
      </Motion>
      <Motion
        as="p"
        v-bind="rise(0.4)"
        class="mt-6 max-w-[38ch] text-lg sm:text-xl text-muted text-pretty"
      >
        {{ page.description }}
      </Motion>
      <Motion
        v-bind="rise(0.55)"
        class="mt-8 flex flex-wrap items-center gap-3"
      >
        <UButton
          v-if="page.hero.links?.[0]"
          size="lg"
          v-bind="page.hero.links[0]"
        />
        <UButton
          :color="global.available ? 'success' : 'error'"
          variant="ghost"
          size="lg"
          class="gap-2 font-pixel"
          :to="global.available ? global.meetingLink : ''"
          :label="
            global.available
              ? 'Available for new projects'
              : 'Not available at the moment'
          "
        >
          <template #leading>
            <span class="relative flex size-2">
              <span
                class="absolute inline-flex size-full rounded-full opacity-75"
                :class="
                  global.available ? 'bg-success animate-ping' : 'bg-error'
                "
              />
              <span
                class="relative inline-flex size-2 scale-90 rounded-full"
                :class="global.available ? 'bg-success' : 'bg-error'"
              />
            </span>
          </template>
        </UButton>
      </Motion>
      <Motion v-bind="rise(0.7)" class="mt-6">
        <NuxtLink
          to="/games"
          class="group inline-flex items-center gap-2 font-pixel text-sm text-muted transition-colors hover:text-highlighted"
        >
          <NuxtImg
            src="/images/games/runewheel/icon.png"
            alt=""
            width="24"
            height="24"
            densities="x1 x2"
            class="size-6 transition-transform duration-300 ease-out [image-rendering:pixelated] group-hover:-translate-y-0.5"
          />
          Now making Runewheel, a roguelike on a wheel of runes
          <UIcon
            name="i-pixelarticons-arrow-right"
            class="size-4 transition-transform duration-300 group-hover:translate-x-1"
          />
        </NuxtLink>
      </Motion>
    </div>
  </section>
</template>
