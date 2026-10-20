<script setup lang="ts">
const { data: page } = await useAsyncData('projects-page', () => {
  return queryCollection('pages').path('/projects').first()
})
if (!page.value) {
  throw createError({
    statusCode: 404,
    statusMessage: 'Page not found',
    fatal: true
  })
}

const { data: projects } = await useAsyncData('projects', () => {
  return queryCollection('projects').order('date', 'DESC').all()
})

const featured = computed(() => projects.value?.filter((p) => p.featured) ?? [])
const archive = computed(() => projects.value?.filter((p) => !p.featured) ?? [])

// Fetched while prerendering, so the counts ship in the payload and visitors never hit the GitHub API
const { data: stars } = await useAsyncData('github-stars', async (nuxtApp) => {
  const token = import.meta.server && nuxtApp.$config.githubToken
  const repos = projects.value?.flatMap((p) => (p.stars ? [p.stars] : [])) ?? []
  const counts = await Promise.all(
    repos.map((repo) =>
      $fetch<{ stargazers_count: number }>(
        `https://api.github.com/repos/${repo}`,
        {
          headers: token ? { Authorization: `Bearer ${token}` } : {}
        }
      )
        .then((r) => [repo, r.stargazers_count] as const)
        // Rate limited or offline: the row just shows no count
        .catch(() => [repo, 0] as const)
    )
  )
  return Object.fromEntries(counts)
})
const formatStars = new Intl.NumberFormat('en', { notation: 'compact' }).format

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
        class="font-serif text-7xl sm:text-8xl lg:text-9xl leading-[0.9] tracking-tight text-highlighted"
      >
        {{ page.title }}
      </Motion>
      <p class="mt-6 max-w-[38ch] text-lg sm:text-xl text-muted text-pretty">
        {{ page.description }}
      </p>
      <UButton
        v-if="page.links?.[0]"
        v-bind="page.links[0]"
        :to="global.meetingLink"
        size="lg"
        class="mt-8"
      />
    </header>
    <div class="flex flex-col gap-20 pb-8 sm:gap-24">
      <ProjectShowcase
        v-for="project in featured"
        :key="project.slug"
        :project
      />

      <section>
        <h2 class="font-serif text-4xl sm:text-5xl text-highlighted">
          Earlier work
        </h2>
        <ul class="mt-4 divide-y divide-default/70 border-y border-default/70">
          <li
            v-for="project in archive"
            :id="project.slug"
            :key="project.slug"
            class="scroll-mt-24"
          >
            <ULink
              :to="project.link || project.url"
              target="_blank"
              class="group grid grid-cols-[1.25rem_1fr_auto] items-start gap-x-4 py-4 rounded-sm focus-visible:outline-2 focus-visible:outline-primary"
            >
              <Icon
                v-if="project.icon"
                :name="project.icon"
                mode="svg"
                class="mt-0.5 size-5"
              />
              <NuxtImg
                v-else-if="project.logo"
                :src="project.logo"
                alt=""
                width="20"
                height="20"
                densities="x1 x2"
                class="mt-0.5 size-5 object-contain"
              />
              <span v-else />
              <span>
                <span
                  class="font-medium text-highlighted transition-colors group-hover:text-primary"
                >
                  {{ project.title }}
                </span>
                <span class="block mt-0.5 text-sm text-muted text-pretty">
                  {{ project.description }}
                </span>
              </span>
              <span
                class="flex items-center gap-4 text-sm text-muted tabular-nums"
              >
                <span
                  v-if="project.stars && stars?.[project.stars]"
                  class="flex items-center gap-1"
                  :aria-label="`${stars[project.stars]} stars on GitHub`"
                >
                  <UIcon name="i-lucide-star" class="size-3.5" />
                  {{ formatStars(stars[project.stars]!) }}
                </span>
                <span class="max-sm:hidden">{{
                  new Date(project.date).getFullYear()
                }}</span>
                <UIcon
                  name="i-lucide-arrow-up-right"
                  class="size-4 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
                />
              </span>
            </ULink>
          </li>
        </ul>
      </section>
    </div>
  </UPage>
</template>
