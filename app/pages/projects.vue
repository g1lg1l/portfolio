<script setup lang="ts">
const { data: page } = await useAsyncData("projects-page", () => {
  return queryCollection("pages").path("/projects").first();
});
if (!page.value) {
  throw createError({
    statusCode: 404,
    statusMessage: "Page not found",
    fatal: true,
  });
}

const { data: projects } = await useAsyncData("projects", () => {
  return queryCollection("projects")
    .order("order", "ASC")
    .order("date", "DESC")
    .all();
});

const { global } = useAppConfig();

useSeoMeta({
  title: page.value?.seo?.title || page.value?.title,
  ogTitle: page.value?.seo?.title || page.value?.title,
  description: page.value?.seo?.description || page.value?.description,
  ogDescription: page.value?.seo?.description || page.value?.description,
});
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
        links: 'justify-start',
      }"
    >
      <template #links>
        <div v-if="page.links" class="flex items-center gap-2">
          <UButton
            :label="page.links[0]?.label"
            :to="global.meetingLink"
            v-bind="page.links[0]"
          />
          <UButton :to="`mailto:${global.email}`" v-bind="page.links[1]" />
        </div>
      </template>
    </UPageHero>
    <UPageSection
      :ui="{
        container: '!pt-0',
      }"
    >
      <Motion
        v-for="(project, index) in projects"
        :key="project.title"
        :initial="{ opacity: 0, transform: 'translateY(10px)' }"
        :while-in-view="{ opacity: 1, transform: 'translateY(0)' }"
        :transition="{ delay: 0.2 * index }"
        :in-view-options="{ once: true }"
      >
        <UPageCard
          :title="project.title"
          :description="project.description"
          :to="project.link || project.url"
          orientation="horizontal"
          variant="naked"
          :reverse="index % 2 === 1"
          class="group"
          :ui="{
            wrapper: 'max-sm:order-last',
          }"
        >
          <template #leading>
            <div class="flex items-center gap-2 text-sm text-muted flex-wrap">
              <Icon v-if="project.icon" :name="project.icon" size="1.3em" />
              <NuxtImg
                v-else-if="project.logo"
                :src="project.logo"
                width="22"
                height="22"
                class="size-5 rounded-sm object-cover"
              />
              <span>{{ new Date(project.date).getFullYear() }}</span>
              <UBadge
                v-if="project.category"
                color="neutral"
                variant="subtle"
                size="sm"
              >
                {{ project.category }}
              </UBadge>
              <UBadge
                v-if="project.ongoing"
                color="success"
                variant="soft"
                size="sm"
              >
                ongoing
              </UBadge>
            </div>
          </template>
          <template #footer>
            <div class="flex flex-col gap-2">
              <div class="flex items-center gap-3 flex-wrap">
                <ULink
                  :to="project.link || project.url"
                  class="text-sm text-primary flex items-center"
                >
                  View Project
                  <UIcon
                    name="i-lucide-arrow-right"
                    class="size-4 text-primary transition-all opacity-0 group-hover:translate-x-1 group-hover:opacity-100"
                  />
                </ULink>
                <ULink
                  v-if="project.stars"
                  :to="`https://github.com/${project.stars}`"
                  target="_blank"
                  class="text-sm text-muted hover:text-primary transition-colors"
                >
                  {{ project.stars }}
                </ULink>
              </div>
              <div class="flex flex-wrap gap-1">
                <UBadge
                  v-for="tag in project.tags"
                  :key="`${project.slug}-${tag}`"
                  color="neutral"
                  variant="outline"
                  size="sm"
                >
                  {{ tag }}
                </UBadge>
              </div>
            </div>
          </template>
          <img
            :src="project.image"
            :alt="project.title"
            loading="lazy"
            decoding="async"
            width="960"
            height="540"
            class="object-cover w-full h-48 rounded-lg"
          />
        </UPageCard>
      </Motion>
    </UPageSection>
  </UPage>
</template>
