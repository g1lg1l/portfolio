<script setup lang="ts">
import type { NuxtError } from '#app'

const props = defineProps({
  error: {
    type: Object as PropType<NuxtError>,
    required: true
  }
})

useHead({
  htmlAttrs: {
    lang: 'en'
  }
})

const missing = computed(() => props.error.statusCode === 404)

useSeoMeta({
  title: 'Game over',
  description: 'This page could not be found.'
})
</script>

<template>
  <div>
    <AppHeader :links="navLinks" />

    <UMain>
      <UContainer>
        <!-- A game over screen: the level you asked for isn't there -->
        <section class="grid min-h-[75vh] place-items-center py-24 text-center">
          <div>
            <PixelLogo class="mx-auto w-16" />
            <p class="mt-8 font-pixel text-sm text-muted">
              {{ error.statusCode }}
            </p>
            <VuebitsGlitchText
              children="Game over"
              :speed="0.7"
              class-name="mt-2 font-pixel text-6xl sm:text-8xl leading-none"
            />
            <p class="mx-auto mt-6 max-w-[36ch] text-lg text-muted text-pretty">
              {{
                missing
                  ? 'This level doesn’t exist (yet). Let’s get you back to the start.'
                  : 'Something crashed. Let’s start again from the top.'
              }}
            </p>
            <UButton
              size="lg"
              icon="i-pixelarticons-reload"
              label="Continue?"
              class="mt-8"
              @click="clearError({ redirect: '/' })"
            />
          </div>
        </section>
      </UContainer>
    </UMain>

    <AppFooter />

    <UToaster />
  </div>
</template>
