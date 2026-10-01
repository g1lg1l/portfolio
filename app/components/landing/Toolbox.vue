<script setup lang="ts">
const tools = [
  {
    name: 'TypeScript',
    icon: 'logos:typescript-icon',
    to: 'https://www.typescriptlang.org/'
  },
  {
    name: 'JavaScript',
    icon: 'logos:javascript',
    to: 'https://developer.mozilla.org/en-US/docs/Web/JavaScript'
  },
  { name: 'Vue', icon: 'logos:vue', to: 'https://vuejs.org/' },
  { name: 'Nuxt', icon: 'logos:nuxt-icon', to: 'https://nuxt.com/' },
  { name: 'Vite', icon: 'logos:vitejs', to: 'https://vitejs.dev/' },
  { name: 'Svelte', icon: 'logos:svelte-icon', to: 'https://svelte.dev/' },
  {
    name: 'Tailwind CSS',
    icon: 'logos:tailwindcss-icon',
    to: 'https://tailwindcss.com/'
  },
  {
    name: 'Three.js',
    icon: 'logos:threejs',
    to: 'https://threejs.org/',
    invert: true
  },
  { name: 'Figma', icon: 'logos:figma', to: 'https://figma.com/' },
  { name: 'Godot', icon: 'logos:godot-icon', to: 'https://godotengine.org/' },
  { name: 'Git', icon: 'logos:git-icon', to: 'https://git-scm.com/' },
  {
    name: 'GitHub',
    icon: 'logos:github-icon',
    to: 'https://github.com/',
    invert: true
  },
  { name: 'GitLab', icon: 'logos:gitlab-icon', to: 'https://gitlab.com/' },
  { name: 'Docker', icon: 'logos:docker-icon', to: 'https://docker.com/' },
  {
    name: 'VS Code',
    icon: 'logos:visual-studio-code',
    to: 'https://code.visualstudio.com/'
  }
]
</script>

<template>
  <section class="py-16 sm:py-20">
    <h2 class="font-serif text-4xl sm:text-5xl text-highlighted">Toolbox</h2>
    <p class="mt-4 max-w-[52ch] text-muted text-pretty">
      What I reach for most days, from the first Figma frame to the last deploy.
    </p>
    <ul class="mt-8 flex flex-wrap gap-x-7 gap-y-5">
      <li v-for="tool in tools" :key="tool.name">
        <ULink
          :to="tool.to"
          target="_blank"
          class="group flex items-center gap-2.5 text-highlighted"
        >
          <Icon
            :name="tool.icon"
            size="1.5rem"
            class="grayscale opacity-70 transition duration-300 group-hover:grayscale-0 group-hover:opacity-100 group-hover:-rotate-6 group-hover:scale-110"
            :class="{ 'dark:invert': tool.invert }"
          />
          <span class="text-sm">{{ tool.name }}</span>
        </ULink>
      </li>
    </ul>
  </section>
</template>
