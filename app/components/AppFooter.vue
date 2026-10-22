<script setup lang="ts">
const { footer, global } = useAppConfig()

// "Now playing": the game in the works, and the music
const { data: game } = await useAsyncData('now-playing', () =>
  queryCollection('games').order('date', 'DESC').first()
)
const spotify = footer.links?.find((l) => l.to?.includes('spotify'))
</script>

<template>
  <footer class="mt-24 sm:mt-32">
    <!-- The top divider runs the full width of the window -->
    <section
      class="relative pt-16 before:absolute before:top-0 before:left-1/2 before:w-screen before:-translate-x-1/2 before:border-t before:border-default sm:pt-20"
    >
      <h2 class="font-pixel text-3xl sm:text-4xl text-highlighted">
        Now playing
      </h2>
      <p class="mt-3 text-muted">
        What’s on my screen and in my headphones right now.
      </p>

      <ul
        class="mt-8 grid border-t border-default sm:grid-cols-2 max-sm:divide-y sm:divide-x divide-default"
      >
        <li v-if="game">
          <NuxtLink
            :to="`/games#${game.slug}`"
            class="group flex h-full flex-col gap-3 py-6 transition-colors hover:bg-elevated/50 focus-visible:outline-2 focus-visible:outline-primary sm:px-5"
          >
            <span class="font-pixel text-xs text-muted">Making</span>
            <span class="flex items-center gap-3">
              <NuxtImg
                v-if="game.icon"
                :src="game.icon"
                alt=""
                width="36"
                height="36"
                densities="x1 x2"
                class="size-9 [image-rendering:pixelated] transition-transform duration-300 ease-out group-hover:-translate-y-0.5"
              />
              <span class="font-pixel text-xl text-highlighted">
                {{ game.title }}
              </span>
            </span>
            <span class="text-sm text-muted text-pretty">
              {{ game.tagline }}
            </span>
          </NuxtLink>
        </li>

        <li v-if="spotify">
          <ULink
            :to="spotify.to"
            target="_blank"
            class="group flex h-full flex-col gap-3 py-6 text-default transition-colors hover:bg-elevated/50 focus-visible:outline-2 focus-visible:outline-primary sm:px-5"
          >
            <span class="font-pixel text-xs text-muted">Listening</span>
            <span class="flex items-center gap-3">
              <!-- Equaliser bars, bouncing in hard steps -->
              <span
                class="eq flex size-9 items-end justify-center gap-0.5"
                aria-hidden="true"
              >
                <span
                  v-for="i in 5"
                  :key="i"
                  class="w-1.5 bg-primary"
                  :style="{ animationDelay: `${-i * 0.17}s` }"
                />
              </span>
              <span class="font-pixel text-xl text-highlighted">
                On repeat
              </span>
            </span>
            <span class="text-sm text-muted text-pretty">
              Whatever’s stuck in my head this week, on Spotify.
            </span>
          </ULink>
        </li>
      </ul>
    </section>

    <div
      class="flex flex-col-reverse gap-4 border-t border-default py-6 sm:flex-row sm:items-center sm:justify-between"
    >
      <p
        class="flex flex-wrap items-center gap-2 font-pixel text-xs text-muted"
      >
        <PixelLogo class="size-5" />
        {{ footer.credits }}
        <span class="max-sm:hidden">·</span>
        <ULink
          to="https://poly.pizza/m/2nwiJ7W4kkz"
          target="_blank"
          class="hover:text-highlighted"
        >
          Handheld model by Michael Fuchs, CC-BY
        </ULink>
      </p>
      <div class="-ml-2 flex">
        <UButton
          :to="`mailto:${global.email}`"
          icon="i-pixelarticons-mail"
          size="md"
          color="neutral"
          variant="ghost"
          aria-label="Email Gilbert"
        />
        <UButton
          v-for="(link, index) of footer?.links"
          :key="index"
          v-bind="{ size: 'md', color: 'neutral', variant: 'ghost', ...link }"
        />
      </div>
    </div>
  </footer>
</template>

<style scoped>
.eq span {
  height: 100%;
  transform-origin: bottom;
  animation: eq 0.9s steps(4) infinite alternate;
}

.group:hover .eq span {
  animation-duration: 0.45s;
}

@keyframes eq {
  from {
    transform: scaleY(0.2);
  }
  to {
    transform: scaleY(1);
  }
}

@media (prefers-reduced-motion: reduce) {
  .eq span {
    animation: none;
    transform: scaleY(0.6);
  }
}
</style>
