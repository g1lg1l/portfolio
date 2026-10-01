<script setup lang="ts">
import type { IndexCollectionItem } from '@nuxt/content'

defineProps<{
  page: IndexCollectionItem
}>()
</script>

<template>
  <div>
    <h2 class="font-serif text-4xl sm:text-5xl text-highlighted">
      {{ page.about.title }}
    </h2>
    <p class="mt-6 whitespace-pre-line text-muted text-pretty leading-relaxed">
      {{ page.about.description }}
    </p>
    <ULink
      to="/about"
      class="mt-6 inline-block font-medium text-primary hover:underline underline-offset-4"
    >
      More about me
    </ULink>
  </div>
</template>
