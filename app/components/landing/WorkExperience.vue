<script setup lang="ts">
import type { IndexCollectionItem } from '@nuxt/content'

defineProps<{
  page: IndexCollectionItem
}>()
</script>

<template>
  <UPageSection
    :title="page.experience.title"
    :ui="{
      container: '!p-0 gap-4 sm:gap-4',
      title: 'text-left text-xl sm:text-xl lg:text-2xl font-medium',
      description: 'mt-2'
    }"
  >
    <template #description>
      <div class="divide-y divide-default/70 border-y border-default/70">
        <Motion
          v-for="(experience, index) in page.experience.items"
          :key="index"
          :initial="{ opacity: 0, transform: 'translateY(20px)' }"
          :while-in-view="{ opacity: 1, transform: 'translateY(0)' }"
          :transition="{ delay: 0.4 + 0.2 * index }"
          :in-view-options="{ once: true }"
          class="py-3 sm:py-3.5"
        >
          <div class="flex items-start justify-between gap-3">
            <p class="text-sm sm:text-base text-left text-highlighted font-medium">
              {{ experience.position }} {{ experience.company.name }}
            </p>
            <p class="text-xs sm:text-sm text-muted whitespace-nowrap text-right">
              {{ experience.date }}
            </p>
          </div>
          <p
            v-if="experience.location"
            class="text-sm text-muted text-left mt-0.5"
          >
            {{ experience.location }}
          </p>
        </Motion>
      </div>
    </template>
  </UPageSection>
</template>

<style scoped>

</style>
