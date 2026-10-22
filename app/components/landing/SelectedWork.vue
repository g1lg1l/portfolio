<script setup lang="ts">
const { data: projects } = await useAsyncData('projects', () => {
  return queryCollection('projects').order('date', 'DESC').all()
})
</script>

<template>
  <section class="pt-8 pb-16 sm:pb-20">
    <div class="flex items-baseline justify-between gap-4">
      <h2 class="font-pixel text-3xl sm:text-4xl text-highlighted">
        Selected work
      </h2>
      <ULink
        to="/projects"
        class="font-pixel text-sm text-muted hover:text-highlighted transition-colors"
      >
        All projects
      </ULink>
    </div>

    <!-- A grid of cells sharing their borders, like the footer's -->
    <ul class="mt-8 grid border-t border-default sm:grid-cols-2">
      <li
        v-for="project in projects"
        :key="project.slug"
        class="border-b border-default sm:odd:border-r"
      >
        <NuxtLink
          :to="`/projects#${project.slug}`"
          class="group flex h-full flex-col gap-3 py-6 transition-colors hover:bg-elevated/50 focus-visible:outline-2 focus-visible:outline-primary sm:px-5"
        >
          <span class="flex items-center justify-between gap-4">
            <span class="grid size-9 place-items-center">
              <NuxtImg
                v-if="project.logo"
                :src="project.logo"
                alt=""
                width="36"
                height="36"
                densities="x1 x2"
                class="size-9 rounded-lg object-contain transition-transform duration-300 ease-out group-hover:-translate-y-0.5"
              />
              <Icon
                v-else-if="project.icon"
                :name="project.icon"
                mode="svg"
                class="size-7 text-highlighted transition-transform duration-300 ease-out group-hover:-translate-y-0.5"
              />
            </span>
            <span
              class="flex items-center gap-2 text-sm text-muted tabular-nums"
            >
              <span
                v-if="project.ongoing"
                class="size-1.5 bg-success"
                aria-label="Active"
              />
              {{ new Date(project.date).getFullYear() }}
              <UIcon
                name="i-pixelarticons-arrow-right"
                class="size-4 -translate-x-1 opacity-0 transition duration-300 group-hover:translate-x-0 group-hover:opacity-100"
              />
            </span>
          </span>
          <span
            class="font-pixel text-2xl text-highlighted transition-colors group-hover:text-primary"
          >
            {{ project.title }}
          </span>
          <span class="text-sm text-muted text-pretty">
            {{ project.tagline || project.description }}
          </span>
        </NuxtLink>
      </li>
    </ul>
  </section>
</template>
