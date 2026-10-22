<script setup lang="ts">
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
    <LandingHero :page />
    <LandingSelectedWork />
    <LandingAbout :page />
    <LandingExperience :page />
  </UPage>
</template>
