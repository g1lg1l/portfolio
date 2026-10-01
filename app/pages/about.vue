<script setup lang="ts">
const { data: page } = await useAsyncData('about', () => {
  return queryCollection('about').first()
})
if (!page.value) {
  throw createError({
    statusCode: 404,
    statusMessage: 'Page not found',
    fatal: true
  })
}

const { global } = useAppConfig()

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
  <UPage v-if="page">
    <header class="pt-16 pb-12 sm:pt-24 sm:pb-16">
      <Motion
        as="h1"
        :initial="{ opacity: 0, y: 24 }"
        :animate="{ opacity: 1, y: 0 }"
        :transition="{ duration: 0.7, delay: 0.15, ease: [0.22, 1, 0.36, 1] }"
        class="max-w-[16ch] font-serif text-6xl sm:text-7xl lg:text-8xl leading-[0.95] tracking-tight text-highlighted text-balance"
      >
        {{ page.title }}
      </Motion>
    </header>

    <div class="grid gap-12 pb-8 lg:grid-cols-[16rem_1fr] lg:gap-16">
      <aside class="lg:sticky lg:top-24 lg:self-start">
        <!-- Grab it and throw it: it springs back wherever it's dropped -->
        <Motion
          :initial="{ rotate: -6 }"
          drag
          drag-snap-to-origin
          :drag-elastic="0.5"
          :drag-transition="{ bounceStiffness: 500, bounceDamping: 12 }"
          :while-hover="{ scale: 1.06, rotate: -2 }"
          :while-tap="{ scale: 0.94 }"
          :while-drag="{ scale: 1.15, rotate: 8 }"
          class="w-36 cursor-grab active:cursor-grabbing touch-none select-none"
          title="Go on, drag me"
        >
          <NuxtImg
            src="/sticker.png"
            :alt="global.picture?.alt || 'Gilbert Ndresaj'"
            width="144"
            height="144"
            densities="x1 x2"
            draggable="false"
            class="w-full drop-shadow-lg pointer-events-none"
          />
        </Motion>

        <dl class="mt-8 grid gap-4 border-t border-default pt-6">
          <div v-for="fact in page.facts" :key="fact.label">
            <dt class="text-sm text-muted">{{ fact.label }}</dt>
            <dd class="text-highlighted">{{ fact.value }}</dd>
          </div>
        </dl>
        <UButton
          :to="`mailto:${global.email}`"
          icon="i-lucide-mail"
          label="Email me"
          class="mt-6"
        />
      </aside>

      <div class="story max-w-[62ch] text-lg leading-relaxed">
        <MDC :value="page.content" />
      </div>
    </div>
  </UPage>
</template>

<style scoped>
.story :deep(h3) {
  margin-top: 3rem;
  font-family: var(--font-serif);
  font-size: 2.25rem;
  font-weight: 400;
  line-height: 1.1;
}

.story :deep(p:first-child) {
  margin-top: 0;
}
</style>
