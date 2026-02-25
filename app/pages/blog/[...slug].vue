<script setup lang="ts">
import type { ContentNavigationItem } from '@nuxt/content'
import { mapContentNavigation } from '@nuxt/ui/utils/content'
import { findPageBreadcrumb } from '@nuxt/content/utils'

const route = useRoute()
const requestURL = useRequestURL()
const runtimeConfig = useRuntimeConfig()

const { data: page } = await useAsyncData(route.path, () =>
  queryCollection('blog').path(route.path).first()
)
if (!page.value) throw createError({ statusCode: 404, statusMessage: 'Page not found', fatal: true })
const { data: surround } = await useAsyncData(`${route.path}-surround`, () =>
  queryCollectionItemSurroundings('blog', route.path, {
    fields: ['description']
  })
)

const navigation = inject<Ref<ContentNavigationItem[]>>('navigation', ref([]))
const blogNavigation = computed(() => navigation.value.find(item => item.path === '/blog')?.children || [])

const breadcrumb = computed(() => mapContentNavigation(findPageBreadcrumb(blogNavigation?.value, page.value?.path)).map(({ icon, ...link }) => link))
const ogImage = page.value?.seo?.image || page.value?.image

if (ogImage) {
  defineOgImage({ url: ogImage })
} else {
  defineOgImageComponent('Blog', {
    headline: breadcrumb.value.map(item => item.label).join(' > ')
  }, {
    fonts: ['Geist:400', 'Geist:600']
  })
}

const title = page.value?.seo?.title || page.value?.title
const description = page.value?.seo?.description || page.value?.description
const image = ogImage || '/me.png'
const siteOrigin = computed(() => {
  const configuredSiteUrl = runtimeConfig.public.siteUrl?.trim()
  if (configuredSiteUrl) {
    return configuredSiteUrl.endsWith('/')
      ? configuredSiteUrl.slice(0, -1)
      : configuredSiteUrl
  }

  return requestURL.origin
})

const articleLink = computed(() => {
  return new URL(route.path, `${siteOrigin.value}/`).toString()
})

const publishedTime = page.value?.date
  ? new Date(page.value.date).toISOString()
  : undefined

const articleSchema = computed(() => {
  return {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: title,
    description,
    image: image.startsWith('http')
      ? image
      : new URL(image, `${siteOrigin.value}/`).toString(),
    datePublished: publishedTime,
    dateModified: publishedTime,
    mainEntityOfPage: articleLink.value,
    author: {
      '@type': 'Person',
      name: page.value?.author?.name || 'Gilbert Ndresaj'
    }
  }
})

useSeoMeta({
  title,
  ogTitle: title,
  twitterTitle: title,
  description,
  ogDescription: description,
  twitterDescription: description,
  ogImage: image,
  twitterImage: image,
  ogType: 'article',
  keywords: page.value?.seo?.keywords?.join(', '),
  robots: page.value?.seo?.noindex ? 'noindex, nofollow' : undefined,
  ogUrl: articleLink,
  twitterCard: 'summary_large_image'
})

useHead(() => ({
  script: [{
    key: 'ld-blog-post',
    type: 'application/ld+json',
    children: JSON.stringify(articleSchema.value)
  }],
  meta: publishedTime
    ? [{
        key: 'article-published-time',
        property: 'article:published_time',
        content: publishedTime
      }]
    : []
}))

const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  })
}
</script>

<template>
  <UMain class="mt-20 px-2">
    <UContainer class="relative min-h-screen">
      <UPage v-if="page">
        <ULink
          to="/blog"
          class="text-sm flex items-center gap-1"
        >
          <UIcon name="lucide:chevron-left" />
          Blog
        </ULink>
        <div class="flex flex-col gap-3 mt-8">
          <div class="flex text-xs text-muted items-center justify-center gap-2">
            <span v-if="page.date">
              {{ formatDate(page.date) }}
            </span>
            <span v-if="page.date && page.minRead">
              -
            </span>
            <span v-if="page.minRead">
              {{ page.minRead }} MIN READ
            </span>
          </div>
          <NuxtImg
            v-if="page.image"
            :src="page.image"
            :alt="page.title"
            class="rounded-lg w-full h-[300px] object-cover object-center"
          />
          <h1 class="text-4xl text-center font-medium max-w-3xl mx-auto mt-4">
            {{ page.title }}
          </h1>
          <p class="text-muted text-center max-w-2xl mx-auto">
            {{ page.description }}
          </p>
          <div class="flex items-center justify-center gap-2 mt-2">
            <UUser
              orientation="vertical"
              color="neutral"
              variant="outline"
              class="justify-center items-center text-center"
              v-bind="page.author"
            />
          </div>
        </div>
        <UPageBody class="max-w-3xl mx-auto">
          <ContentRenderer
            v-if="page.body"
            :value="page"
          />

          <div class="flex items-center justify-end gap-2 text-sm text-muted">
            <UButton
              size="sm"
              variant="link"
              color="neutral"
              label="Copy link"
              @click="copyToClipboard(articleLink, 'Article link copied to clipboard')"
            />
          </div>
          <UContentSurround :surround />
        </UPageBody>
      </UPage>
    </UContainer>
  </UMain>
</template>
