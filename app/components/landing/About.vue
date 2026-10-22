<script setup lang="ts">
import type { IndexCollectionItem } from '@nuxt/content'

defineProps<{
  page: IndexCollectionItem
}>()
</script>

<template>
  <section class="py-16 sm:py-20">
    <h2 class="font-pixel text-3xl sm:text-4xl text-highlighted">
      {{ page.about.title }}
    </h2>
    <p
      class="mt-6 max-w-[62ch] whitespace-pre-line text-lg text-muted text-pretty leading-relaxed"
    >
      {{ page.about.description }}
    </p>
    <ULink
      to="/about"
      class="mt-6 inline-block font-pixel text-primary hover:underline underline-offset-4"
    >
      More about me
    </ULink>
  </section>
</template>
