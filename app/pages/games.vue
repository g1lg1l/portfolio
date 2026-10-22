<script setup lang="ts">
const { data: games } = await useAsyncData('games', () => {
  return queryCollection('games').order('date', 'DESC').all()
})

// Components that take a raw image URL (WebGL textures, <img>) need the base URL in front
const base = useRuntimeConfig().app.baseURL
const asset = (path: string) => `${base}${path.replace(/^\//, '')}`

// The numbers roll up the first time they scroll into view
const statsEl = ref<HTMLElement>()
const statsSeen = ref(false)
const statsVisible = useElementVisibility(statsEl)
watch(statsVisible, (v) => v && (statsSeen.value = true))

useSeoMeta({
  title: 'Games',
  description:
    'Small games by Gilbert Ndresaj, made in Godot after work. Right now: Runewheel, a macabre roguelike fought on a wheel of runes.'
})
</script>

<template>
  <UPage>
    <header class="pt-16 pb-12 sm:pt-24 sm:pb-16">
      <Motion
        as="h1"
        :initial="{ opacity: 0, y: 24 }"
        :animate="{ opacity: 1, y: 0 }"
        :transition="{ duration: 0.7, delay: 0.15, ease: [0.22, 1, 0.36, 1] }"
        class="font-pixel text-6xl sm:text-7xl lg:text-8xl leading-none text-highlighted"
      >
        Games
      </Motion>
      <p class="mt-6 max-w-[40ch] text-lg sm:text-xl text-muted text-pretty">
        Little worlds I make in Godot after work. Mostly pixels, sometimes
        skulls, always one more run.
      </p>
      <UButton
        to="https://g1lg1l.itch.io/"
        target="_blank"
        size="lg"
        icon="i-pixel-itchio"
        label="Play them on itch.io"
        class="mt-8"
      />
    </header>

    <article
      v-for="game in games"
      :id="game.slug"
      :key="game.slug"
      class="scroll-mt-24 pb-8"
    >
      <div class="grid grid-cols-1 items-center gap-10 lg:grid-cols-[auto_1fr]">
        <VuebitsTiltedCard
          :image-src="game.cover"
          :alt-text="`${game.title} key art`"
          :caption-text="game.status"
          container-height="252px"
          container-width="403px"
          image-height="252px"
          image-width="100%"
          :rotate-amplitude="12"
          :scale-on-hover="1.05"
          class="max-w-full [&_img]:[image-rendering:pixelated]"
        />
        <div>
          <VuebitsShinyText
            :text="`${game.status}, ${game.version}`"
            color="var(--ui-text-muted)"
            shine-color="var(--ui-primary)"
            :speed="3"
            class-name="font-pixel text-sm"
          />
          <h2
            class="mt-3 font-pixel text-5xl sm:text-6xl leading-none text-highlighted"
          >
            {{ game.title }}
          </h2>
          <p class="mt-3 font-pixel text-xl text-primary text-pretty">
            {{ game.tagline }}
          </p>
          <p class="mt-4 max-w-prose text-muted text-pretty">
            {{ game.description }}
          </p>
          <p class="mt-4 text-sm text-muted">
            Made with {{ game.engine }}, for
            {{ game.platforms.join(', ') }}
          </p>
        </div>
      </div>

      <dl
        v-if="game.stats"
        :ref="(el) => el && (statsEl = el as HTMLElement)"
        class="mt-12 grid grid-cols-3 border-t border-default sm:grid-cols-6"
      >
        <div
          v-for="stat in game.stats"
          :key="stat.label"
          class="border-b border-default py-5 not-last:border-r sm:px-4 max-sm:px-3"
        >
          <dd class="font-pixel text-4xl text-highlighted tabular-nums">
            <VuebitsCountUp
              :to="stat.value"
              :start-when="statsSeen"
              :duration="1.2"
            />
          </dd>
          <dt class="mt-1 font-pixel text-sm text-muted">{{ stat.label }}</dt>
        </div>
      </dl>

      <!-- The bosses, one per floor (two floors draw one of two), on a bendy carousel -->
      <section v-if="game.bosses" class="mt-20">
        <h2 class="font-pixel text-3xl sm:text-4xl text-highlighted">
          Who waits at the bottom
        </h2>
        <p class="mt-3 max-w-[52ch] text-muted text-pretty">
          Six bosses, one at the end of each floor. Drag them around, click one
          for a closer look.
        </p>
        <div class="relative left-1/2 mt-6 h-[28rem] w-screen -translate-x-1/2">
          <ClientOnly>
            <LazyVuebitsFlexCarousel
              :items="
                game.bosses.map((b) => ({
                  src: asset(b.image),
                  title: b.name,
                  subtitle: b.floor,
                  alt: `${b.name}, the boss of ${b.floor.toLowerCase()}`
                }))
              "
              :card-height="0.62"
              :gap="24"
              :capture-wheel="false"
              class-name="font-pixel"
            />
          </ClientOnly>
        </div>
      </section>

      <section v-if="game.characters" class="mt-20">
        <h2 class="font-pixel text-3xl sm:text-4xl text-highlighted">
          Pick a character
        </h2>
        <p class="mt-3 max-w-[52ch] text-muted text-pretty">
          Seven of them, each with their own wheel and one power to spend when
          the charge is full.
        </p>
        <ul class="mt-8 grid gap-4 sm:grid-cols-2">
          <li v-for="c in game.characters" :key="c.name">
            <VuebitsSpotlightCard
              class-name="h-full rounded-lg border-default bg-elevated/40 p-5!"
              spotlight-color="rgba(139, 92, 246, 0.22)"
            >
              <div class="flex items-start gap-4">
                <span
                  class="idle size-24 shrink-0"
                  role="img"
                  :aria-label="c.name"
                  :style="{ backgroundImage: `url(${asset(c.sheet)})` }"
                />
                <div>
                  <h3 class="font-pixel text-xl text-highlighted">
                    {{ c.name }}
                  </h3>
                  <p class="mt-1 text-sm text-muted text-pretty">
                    {{ c.blurb }}
                  </p>
                  <p class="mt-3 font-pixel text-sm text-primary">
                    Power: {{ c.power }}
                  </p>
                </div>
              </div>
            </VuebitsSpotlightCard>
          </li>
        </ul>
      </section>

      <section v-if="game.runes" class="mt-20">
        <h2 class="font-pixel text-3xl sm:text-4xl text-highlighted">
          A few of the runes
        </h2>
        <p class="mt-3 max-w-[52ch] text-muted text-pretty">
          Seventy-four of them so far, from a plain blade to an eclipse in a
          hand.
        </p>
        <VuebitsLogoLoop
          class="mt-8"
          :logos="game.runes.map((r) => ({ node: r }))"
          :speed="30"
          :gap="36"
          :logo-height="48"
          :hover-speed="6"
          fade-out
          fade-out-color="var(--ui-bg)"
          aria-label="Runes from Runewheel"
        >
          <template #renderItem="{ item }">
            <img
              :src="
                asset(
                  `/images/games/runewheel/sprites/rune-${(item as { node: string }).node}.png`
                )
              "
              :alt="(item as { node: string }).node.replace(/_/g, ' ')"
              width="48"
              height="48"
              class="size-12 [image-rendering:pixelated] transition-transform duration-300 ease-out hover:-translate-y-1"
            />
          </template>
        </VuebitsLogoLoop>
      </section>

      <section class="mt-20 grid gap-12 lg:grid-cols-2">
        <div>
          <h2 class="font-pixel text-3xl sm:text-4xl text-highlighted">
            Screenshots
          </h2>
          <p class="mt-3 text-muted text-pretty">
            Drag the top one away to see the next.
          </p>
          <div class="mt-8 aspect-[16/9] w-full max-w-md">
            <ClientOnly>
              <LazyVuebitsStack
                :cards-data="
                  game.screenshots.map((s, i) => ({
                    id: i + 1,
                    img: asset(s.src)
                  }))
                "
                random-rotation
                :sensitivity="160"
                send-to-back-on-click
              />
            </ClientOnly>
          </div>
        </div>
        <div v-if="game.devlog">
          <h2 class="font-pixel text-3xl sm:text-4xl text-highlighted">
            Devlog
          </h2>
          <p class="mt-3 text-muted text-pretty">
            What changed lately, newest first.
          </p>
          <ClientOnly>
            <LazyVuebitsAnimatedList
              class="mt-6"
              :items="game.devlog"
              :enable-arrow-navigation="false"
              :display-scrollbar="false"
            />
          </ClientOnly>
        </div>
      </section>
    </article>

    <!-- Where the next game goes when there is one -->
    <section
      class="slot mt-16 grid place-items-center gap-2 px-6 py-16 text-center"
    >
      <UIcon name="i-pixelarticons-gamepad" class="size-10 text-muted" />
      <h2 class="font-pixel text-2xl text-highlighted">
        Insert cartridge<span class="blink">_</span>
      </h2>
      <p class="max-w-[36ch] text-muted text-pretty">
        The next game is still a doodle in a notebook. It’ll show up here first.
      </p>
    </section>
  </UPage>
</template>

<style scoped>
/* A character's idle: two 64px frames side by side, shown at 96px, flipping in hard steps */
.idle {
  background-size: 192px 96px;
  background-repeat: no-repeat;
  image-rendering: pixelated;
  animation: idle 0.9s steps(2) infinite;
}

@keyframes idle {
  to {
    background-position: -192px 0;
  }
}

/* A dashed pixel border: 8px dashes along each edge */
.slot {
  background:
    repeating-linear-gradient(
        to right,
        var(--ui-border-accented) 0 8px,
        transparent 8px 16px
      )
      top / 100% 4px no-repeat,
    repeating-linear-gradient(
        to right,
        var(--ui-border-accented) 0 8px,
        transparent 8px 16px
      )
      bottom / 100% 4px no-repeat,
    repeating-linear-gradient(
        to bottom,
        var(--ui-border-accented) 0 8px,
        transparent 8px 16px
      )
      left / 4px 100% no-repeat,
    repeating-linear-gradient(
        to bottom,
        var(--ui-border-accented) 0 8px,
        transparent 8px 16px
      )
      right / 4px 100% no-repeat;
}

@media (prefers-reduced-motion: reduce) {
  .idle {
    animation: none;
  }
}
</style>
