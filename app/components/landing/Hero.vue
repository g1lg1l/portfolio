<script setup lang="ts">
import type { IndexCollectionItem } from '@nuxt/content'

const { global } = useAppConfig()

defineProps<{
  page: IndexCollectionItem
}>()

const rise = (delay: number) => ({
  initial: { opacity: 0, y: 24 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.7, delay, ease: [0.22, 1, 0.36, 1] }
})
</script>

<template>
  <section
    class="grid items-center gap-y-8 pt-16 pb-12 sm:pt-24 sm:pb-20 lg:grid-cols-[1fr_auto] lg:gap-x-10"
  >
    <Motion
      :initial="{ opacity: 0, scale: 0.5, rotate: -18 }"
      :animate="{ opacity: 1, scale: 1, rotate: 0 }"
      :transition="{ type: 'spring', bounce: 0.55, duration: 1, delay: 0.1 }"
      :while-hover="{ scale: 1.06 }"
      :while-tap="{ scale: 0.9 }"
      class="w-48 sm:w-64 lg:order-last lg:w-[22rem] text-highlighted"
    >
      <GlassesMascot track class="w-full" />
    </Motion>

    <div>
      <Motion
        as="h1"
        v-bind="rise(0.25)"
        class="font-serif text-7xl sm:text-8xl lg:text-9xl leading-[0.9] tracking-tight text-highlighted text-balance"
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
          class="gap-2"
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
    </div>
  </section>
</template>
