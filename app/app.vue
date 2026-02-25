<script setup lang="ts">
const { footer, global } = useAppConfig();
const route = useRoute();
const requestURL = useRequestURL();
const runtimeConfig = useRuntimeConfig();

const colorMode = useColorMode();
const color = computed(() =>
  colorMode.value === "dark" ? "#020618" : "white",
);

const siteName = computed(() => global.seo?.siteName || "Gilbert Ndresaj");
const authorName = computed(() => global.seo?.authorName || siteName.value);
const defaultTitle = computed(
  () => global.seo?.defaultTitle || "Frontend & Creative Developer",
);
const defaultDescription = computed(
  () =>
    global.seo?.defaultDescription ||
    "Portfolio of Gilbert Ndresaj, Frontend and Creative Developer.",
);
const twitterHandle = computed(() => global.seo?.twitterHandle || "");
const locale = computed(() => global.seo?.locale || "en_US");

const siteOrigin = computed(() => {
  const configuredSiteUrl = runtimeConfig.public.siteUrl?.trim();
  if (configuredSiteUrl) {
    return configuredSiteUrl.endsWith("/")
      ? configuredSiteUrl.slice(0, -1)
      : configuredSiteUrl;
  }

  return requestURL.origin;
});

const toAbsoluteUrl = (url: string) => {
  if (/^https?:\/\//i.test(url)) {
    return url;
  }

  const path = url.startsWith("/") ? url : `/${url}`;
  return new URL(path, `${siteOrigin.value}/`).toString();
};

const canonicalUrl = computed(() => toAbsoluteUrl(route.path));
const defaultImage = computed(() =>
  toAbsoluteUrl(global.seo?.defaultImage || "/me.png"),
);

const sameAs = computed(() => {
  return (
    footer.links
      ?.map((link) => link.to)
      .filter((link): link is string => Boolean(link)) || []
  );
});

const personSchema = computed(() => {
  return {
    "@context": "https://schema.org",
    "@type": "Person",
    name: authorName.value,
    image: defaultImage.value,
    url: siteOrigin.value,
    email: global.email ? `mailto:${global.email}` : undefined,
    jobTitle: "Frontend & Creative Developer",
    sameAs: sameAs.value,
  };
});

const websiteSchema = computed(() => {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: siteName.value,
    url: siteOrigin.value,
    inLanguage: "en",
  };
});

useHead(() => ({
  meta: [
    { charset: "utf-8" },
    { name: "viewport", content: "width=device-width, initial-scale=1" },
    { key: "theme-color", name: "theme-color", content: color.value },
    {
      key: "format-detection",
      name: "format-detection",
      content: "telephone=no",
    },
  ],
  link: [
    { rel: "icon", href: "/favicon.ico" },
    { key: "canonical", rel: "canonical", href: canonicalUrl.value },
  ],
  script: [
    {
      key: "ld-person",
      type: "application/ld+json",
      children: JSON.stringify(personSchema.value),
    },
    {
      key: "ld-website",
      type: "application/ld+json",
      children: JSON.stringify(websiteSchema.value),
    },
  ],
  htmlAttrs: {
    lang: "en",
  },
}));

useSeoMeta({
  title: () => defaultTitle.value,
  titleTemplate: (titleChunk) => {
    if (!titleChunk) {
      return siteName.value;
    }

    return titleChunk.toLowerCase().includes(siteName.value.toLowerCase())
      ? titleChunk
      : `${titleChunk} · ${siteName.value}`;
  },
  description: () => defaultDescription.value,
  applicationName: () => siteName.value,
  author: () => authorName.value,
  robots: "index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1",
  ogTitle: () => defaultTitle.value,
  ogDescription: () => defaultDescription.value,
  ogSiteName: () => siteName.value,
  ogType: "website",
  ogLocale: () => locale.value,
  ogUrl: () => canonicalUrl.value,
  ogImage: () => defaultImage.value,
  twitterTitle: () => defaultTitle.value,
  twitterDescription: () => defaultDescription.value,
  twitterImage: () => defaultImage.value,
  twitterCard: "summary_large_image",
  twitterSite: () => twitterHandle.value,
  twitterCreator: () => twitterHandle.value,
});

const [{ data: navigation }, { data: files }] = await Promise.all([
  useAsyncData(
    "navigation",
    () => {
      return Promise.all([queryCollectionNavigation("blog")]);
    },
    {
      transform: (data) => data.flat(),
    },
  ),
  useLazyAsyncData(
    "search",
    () => {
      return Promise.all([queryCollectionSearchSections("blog")]);
    },
    {
      server: false,
      transform: (data) => data.flat(),
    },
  ),
]);
</script>

<template>
  <UApp>
    <NuxtLayout>
      <UMain class="relative">
        <NuxtPage />
      </UMain>
    </NuxtLayout>

    <ClientOnly>
      <LazyUContentSearch
        :files="files"
        :navigation="navigation"
        shortcut="meta_k"
        :links="navLinks"
        :fuse="{ resultLimit: 42 }"
      />
    </ClientOnly>
  </UApp>
</template>
