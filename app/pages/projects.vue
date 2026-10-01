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
    <UPageHero
      :title="page.title"
      :description="page.description"
      :links="page.links"
      :ui="{
        title: '!mx-0 text-left',
        description: '!mx-0 text-left',
        links: 'justify-start'
      }"
    >
      <template #links>
        <UButton
          v-if="page.links?.[0]"
          :to="global.meetingLink"
          v-bind="page.links[0]"
        />
      </template>
    </UPageHero>
    <UPageSection :ui="{ container: '!pt-0 gap-20 sm:gap-24' }">
      <ProjectShowcase
        v-for="project in featured"
        :key="project.slug"
        :project
      />

      <section>
        <h2 class="text-xl lg:text-2xl font-medium">Earlier work</h2>
        <ul class="mt-4 divide-y divide-default/70 border-y border-default/70">
          <li v-for="project in archive" :key="project.slug">
            <ULink
              :to="project.link || project.url"
              target="_blank"
              class="group grid grid-cols-[1.25rem_1fr_auto] items-start gap-x-4 py-4 rounded-sm focus-visible:outline-2 focus-visible:outline-primary"
            >
              <Icon
                v-if="project.icon"
                :name="project.icon"
                size="1.25rem"
                class="mt-0.5"
              />
              <NuxtImg
                v-else-if="project.logo"
                :src="project.logo"
                alt=""
                width="20"
                height="20"
                densities="x1 x2"
                class="mt-0.5 size-5 rounded-sm object-cover"
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
    </UPageSection>
  </UPage>
</template>
