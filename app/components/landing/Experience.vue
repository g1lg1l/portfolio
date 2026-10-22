<script setup lang="ts">
import type { IndexCollectionItem } from '@nuxt/content'

const props = defineProps<{
  page: IndexCollectionItem
}>()

const items = computed(() => props.page.experience.items)
</script>

<template>
  <section class="py-16 sm:py-20">
    <h2 class="font-pixel text-3xl sm:text-4xl text-highlighted">
      {{ page.experience.title }}
    </h2>
    <p class="mt-4 max-w-[52ch] text-muted text-pretty">
      {{ page.experience.description }}
    </p>

    <!-- Levels, newest first, in the same shared-border grid as Selected work -->
    <ol class="mt-8 grid border-t border-default sm:grid-cols-2">
      <li
        v-for="(item, index) in items"
        :key="index"
        class="group flex flex-col gap-3 border-b border-default py-6 sm:px-5 sm:odd:border-r"
      >
        <span class="flex items-center justify-between gap-4">
          <span
            class="pixel-corners grid size-9 place-items-center font-pixel text-sm transition-transform duration-300 ease-out group-hover:-translate-y-0.5"
            :class="
              index === 0
                ? 'bg-primary text-inverted'
                : 'bg-elevated text-highlighted'
            "
          >
            {{ items.length - index }}
          </span>
          <span class="text-sm text-muted tabular-nums">{{ item.date }}</span>
        </span>
        <span class="font-pixel text-xl text-highlighted text-pretty">
          {{ item.position.replace(/ at$/, '') }}
        </span>
        <span class="text-sm text-muted">
          {{ item.company.name
          }}<template v-if="item.location">, {{ item.location }}</template>
          <span v-if="index === 0" class="ml-1 font-pixel text-primary">
            Now playing
          </span>
        </span>
      </li>
    </ol>
  </section>
</template>
