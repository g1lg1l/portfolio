<script setup lang="ts">
import type { NavigationMenuItem } from '@nuxt/ui'

defineProps<{
  links: NavigationMenuItem[]
}>()
</script>

<template>
  <div
    class="fixed top-2 sm:top-4 mx-auto left-1/2 transform -translate-x-1/2 z-10"
  >
    <UNavigationMenu
      :items="links"
      variant="link"
      color="neutral"
      class="bg-muted/80 backdrop-blur-sm rounded-full px-1.5 sm:px-4 border border-muted/50 shadow-lg shadow-neutral-950/5"
      :ui="{
        link: 'px-1.5 py-1 text-xs sm:px-2 sm:text-sm',
        linkLeadingIcon: 'hidden'
      }"
    >
      <template #list-leading>
        <NuxtLink to="/" aria-label="Home" class="group mr-1 rounded-sm">
          <PixelLogo
            class="size-7 transition-transform duration-300 ease-out group-hover:-translate-y-0.5"
          />
        </NuxtLink>
      </template>
      <template #list-trailing>
        <ColorModeButton />
      </template>
    </UNavigationMenu>
  </div>
</template>
