<script setup lang="ts">
const { data: page } = await useAsyncData("index", () => {
  return queryCollection("index").first();
});
if (!page.value) {
  throw createError({
    statusCode: 404,
    statusMessage: "Page not found",
    fatal: true,
  });
}

const seo = page.value?.seo;
const title = seo?.title || page.value?.title;
const description = seo?.description || page.value?.description;

useSeoMeta({
  title,
  ogTitle: title,
  twitterTitle: title,
  description,
  ogDescription: description,
  twitterDescription: description,
  ogImage: seo?.image,
  twitterImage: seo?.image,
  keywords: seo?.keywords?.join(", "),
  robots: seo?.noindex ? "noindex, nofollow" : undefined,
});
</script>

<template>
  <UPage v-if="page">
    <LandingHero :page />
    <UPageSection
      :ui="{
        container: 'lg:grid lg:grid-cols-2 lg:gap-8 px-0! py-8!',
      }"
    >
      <LandingAbout :page />
      <LandingWorkExperience :page />
    </UPageSection>
    <LandingBlog :page />
    <!-- <LandingTestimonials :page /> -->
    <!-- <LandingFAQ :page /> -->
  </UPage>
</template>
