<script setup lang="ts">
import type { IndexCollectionItem } from '@nuxt/content'

defineProps<{
  page: IndexCollectionItem
}>()
</script>

<template>
  <div>
    <h2 class="font-serif text-4xl sm:text-5xl text-highlighted">
      {{ page.experience.title }}
    </h2>
    <ol class="mt-6 border-t border-default">
      <li
        v-for="(experience, index) in page.experience.items"
        :key="index"
        class="border-b border-default py-4"
      >
        <div class="flex items-baseline justify-between gap-4">
          <p class="font-medium text-highlighted">
            {{ experience.position }} {{ experience.company.name }}
          </p>
          <p class="shrink-0 text-sm text-muted tabular-nums">
            {{ experience.date }}
          </p>
        </div>
        <p v-if="experience.location" class="mt-0.5 text-sm text-muted">
          {{ experience.location }}
        </p>
      </li>
    </ol>
  </div>
</template>
