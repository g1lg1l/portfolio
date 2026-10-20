<script setup lang="ts">
const { data: projects } = await useAsyncData('projects', () => {
  return queryCollection('projects').order('date', 'DESC').all()
})
</script>

<template>
  <section class="pt-8 pb-16 sm:pb-20">
    <div class="flex items-baseline justify-between gap-4">
      <h2 class="font-serif text-4xl sm:text-5xl text-highlighted">
        Selected work
      </h2>
      <ULink
        to="/projects"
        class="text-sm text-muted hover:text-highlighted transition-colors"
      >
        All projects
      </ULink>
    </div>

    <ul class="mt-8 border-t border-default">
      <li
        v-for="project in projects"
        :key="project.slug"
        class="border-b border-default"
      >
        <NuxtLink
          :to="`/projects#${project.slug}`"
          class="group grid grid-cols-[1fr_auto] items-baseline gap-x-6 gap-y-1 py-5 sm:grid-cols-[18rem_1fr_auto] focus-visible:outline-2 focus-visible:outline-primary rounded-sm"
        >
          <span
            class="font-serif text-3xl sm:text-[2.125rem] text-highlighted transition duration-300 group-hover:translate-x-2 group-hover:text-primary"
          >
            {{ project.title }}
          </span>
          <span
            class="text-muted text-pretty max-sm:col-span-2 max-sm:row-start-2"
          >
            {{ project.tagline || project.description }}
          </span>
          <span class="text-sm text-muted tabular-nums">
            {{ new Date(project.date).getFullYear() }}
          </span>
        </NuxtLink>
      </li>
    </ul>
  </section>
</template>
