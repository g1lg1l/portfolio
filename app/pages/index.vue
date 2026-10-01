<script setup lang="ts">
// import ColorBends from "~/components/sfx/ColorBends.vue";

const { data: page } = await useAsyncData('index', () => {
  return queryCollection('index').first()
})
if (!page.value) {
  throw createError({
    statusCode: 404,
    statusMessage: 'Page not found',
    fatal: true
  })
}

const seo = page.value?.seo
const title = seo?.title || page.value?.title
const description = seo?.description || page.value?.description

useSeoMeta({
  title,
  ogTitle: title,
  twitterTitle: title,
  description,
  ogDescription: description,
  twitterDescription: description,
  robots: seo?.noindex ? 'noindex, nofollow' : undefined
})
</script>

<template>
  <UPage v-if="page" class="relative">
    <!-- <div
    class="pointer-events-none absolute top-0 left-1/2 -translate-x-1/2 w-screen h-full max-h-[480px] z-0 -mt-10"
  >
    <ColorBends
      class="w-full h-full opacity-40"
      :colors="['#8a5cff', '#ff5c7a', '#00ffd1']"
      :rotation="45"
      :speed="0.4"
      :scale="0.7"
      :frequency="1"
      :warpStrength="1.14"
      :mouseInfluence="1"
      :parallax="20"
      :noise="0.2"
      transparent
    />
  </div> -->
    <LandingHero :page />
    <LandingSelectedWork />
    <section class="grid gap-16 py-16 sm:py-20 lg:grid-cols-2 lg:gap-12">
      <LandingAbout :page />
      <LandingWorkExperience :page />
    </section>
    <LandingToolbox />
    <!-- <LandingBlog :page /> -->
    <!-- <LandingTestimonials :page /> -->
    <!-- <LandingFAQ :page /> -->
  </UPage>
</template>
