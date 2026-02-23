<script setup lang="ts">
import type { IndexCollectionItem } from '@nuxt/content'

const { footer, global } = useAppConfig()

defineProps<{
  page: IndexCollectionItem
}>()

const techStack = [
  { name: 'JavaScript', icon: 'simple-icons:javascript', to: 'https://developer.mozilla.org/en-US/docs/Web/JavaScript' },
  { name: 'TypeScript', icon: 'simple-icons:typescript', to: 'https://www.typescriptlang.org/' },
  { name: 'Vue', icon: 'simple-icons:vuedotjs', to: 'https://vuejs.org/' },
  { name: 'Nuxt', icon: 'simple-icons:nuxtdotjs', to: 'https://nuxt.com/' },
  { name: 'Vite', icon: 'simple-icons:vite', to: 'https://vitejs.dev/' },
  { name: 'Svelte', icon: 'simple-icons:svelte', to: 'https://svelte.dev/' },
  { name: 'Tailwind CSS', icon: 'simple-icons:tailwindcss', to: 'https://tailwindcss.com/' },
  { name: 'Git', icon: 'simple-icons:git', to: 'https://git-scm.com/' },
  { name: 'Docker', icon: 'simple-icons:docker', to: 'https://docker.com/' },
  { name: 'Figma', icon: 'simple-icons:figma', to: 'https://figma.com/' },
  { name: 'VS Code', icon: 'simple-icons:visualstudiocode', to: 'https://code.visualstudio.com/' },
  { name: 'Godot', icon: 'simple-icons:godotengine', to: 'https://godotengine.org/' },
  { name: 'Three.js', icon: 'simple-icons:threedotjs', to: 'https://threejs.org/' },
  { name: 'GitHub', icon: 'simple-icons:github', to: 'https://github.com/' },
  { name: 'GitLab', icon: 'simple-icons:gitlab', to: 'https://gitlab.com/' }
]
</script>

<template>
  <UPageHero
    :ui="{
      container: 'py-10 sm:py-14 lg:py-16',
      headline: 'flex items-center justify-center',
      title: 'text-shadow-md max-w-lg mx-auto',
      links: 'mt-4 flex-col justify-center items-center'
    }"
  >
    <template #headline>
      <Motion
        :initial="{
          scale: 1.1,
          opacity: 0
        }"
        :animate="{
          scale: 1,
          opacity: 1
        }"
        :transition="{
          duration: 0.6,
          delay: 0.1
        }"
      >
        <NuxtImg
          :src="global.picture?.light || '/me.png'"
          :alt="global.picture?.alt || 'Profile picture'"
          width="360"
          height="360"
          densities="x1 x2"
          quality="95"
          class="size-20 rounded-full object-cover ring ring-default ring-offset-3 ring-offset-(--ui-bg)"
        />
      </Motion>
    </template>

    <template #title>
      <Motion
        :initial="{
          scale: 1.1,
          opacity: 0
        }"
        :animate="{
          scale: 1,
          opacity: 1
        }"
        :transition="{
          duration: 0.6,
          delay: 0.1
        }"
      >
        {{ page.title }}
      </Motion>
    </template>

    <template #description>
      <Motion
        :initial="{
          scale: 1.1,
          opacity: 0
        }"
        :animate="{
          scale: 1,
          opacity: 1
        }"
        :transition="{
          duration: 0.6,
          delay: 0.3
        }"
      >
        {{ page.description }}
      </Motion>
    </template>

    <template #links>
      <Motion
        :initial="{
          scale: 1.1,
          opacity: 0
        }"
        :animate="{
          scale: 1,
          opacity: 1
        }"
        :transition="{
          duration: 0.6,
          delay: 0.5
        }"
      >
        <div
          v-if="page.hero.links"
          class="flex items-center gap-2"
        >
          <UButton
            size="lg"
            v-bind="page.hero.links[0]"
          />
          <UButton
            :color="global.available ? 'success' : 'error'"
            variant="ghost"
            size="lg"
            class="gap-2"
            :to="global.available ? global.meetingLink : ''"
            :label="global.available ? 'Available for new projects' : 'Not available at the moment'"
          >
            <template #leading>
              <span class="relative flex size-2">
                <span
                  class="absolute inline-flex size-full rounded-full opacity-75"
                  :class="global.available ? 'bg-success animate-ping' : 'bg-error'"
                />
                <span
                  class="relative inline-flex size-2 scale-90 rounded-full"
                  :class="global.available ? 'bg-success' : 'bg-error'"
                />
              </span>
            </template>
          </UButton>
        </div>
      </Motion>

      <div class="gap-x-4 inline-flex mt-4">
        <Motion
          v-for="(link, index) of footer?.links"
          :key="index"

          :initial="{
            scale: 1.1,
            opacity: 0
          }"
          :animate="{
            scale: 1,
            opacity: 1
          }"
          :transition="{
            duration: 0.6,
            delay: 0.5 + index * 0.1
          }"
        >
          <UButton
            v-bind="{ size: 'lg', color: 'neutral', variant: 'ghost', ...link }"
          />
        </Motion>
      </div>
    </template>

    <Motion
      :initial="{
        scale: 1.05,
        opacity: 0
      }"
      :animate="{
        scale: 1,
        opacity: 1
      }"
      :transition="{
        duration: 0.6,
        delay: 0.8
      }"
      class="pt-2 sm:pt-4"
    >
      <UCarousel
        v-slot="{ item }"
        :items="techStack"
        loop
        dots
        :autoplay="{ delay: 2200 }"
        :ui="{
          viewport: '-mx-4 sm:-mx-8 lg:-mx-12 max-w-(--ui-container)',
          item: 'basis-1/2 sm:basis-1/3 lg:basis-1/5 px-2'
        }"
      >
        <ULink
          :to="item.to"
          target="_blank"
          class="h-28 rounded-lg border border-default bg-elevated/40 hover:bg-elevated/70 transition-colors flex flex-col items-center justify-center gap-2"
        >
          <Icon
            :name="item.icon"
            size="2em"
          />
          <span class="text-sm text-muted text-center px-2">{{ item.name }}</span>
        </ULink>
      </UCarousel>
    </Motion>
  </UPageHero>
</template>
