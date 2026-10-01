<script setup lang="ts">
const { footer, global } = useAppConfig()
</script>

<template>
  <footer class="mt-8">
    <section class="border-t border-default py-16 sm:py-24">
      <h2
        class="font-serif text-5xl sm:text-7xl leading-[0.95] text-highlighted text-balance"
      >
        Got a project in mind?
      </h2>
      <p class="mt-5 max-w-[46ch] text-lg text-muted text-pretty">
        {{
          global.available
            ? "I'm open to freelance work and collaborations. Tell me what you're building."
            : "I'm not taking on new work right now, but I'm always happy to talk."
        }}
      </p>
      <div class="mt-8 flex flex-wrap items-center gap-2">
        <UButton
          :to="`mailto:${global.email}`"
          size="xl"
          icon="i-lucide-mail"
          :label="global.email"
        />
        <UButton
          size="xl"
          color="neutral"
          variant="ghost"
          icon="i-lucide-copy"
          label="Copy email"
          @click="copyToClipboard(global.email, 'Email copied')"
        />
      </div>
    </section>

    <div
      class="flex flex-col-reverse gap-4 border-t border-default py-6 sm:flex-row sm:items-center sm:justify-between"
    >
      <p class="flex items-center gap-2 text-xs text-muted">
        <GlassesMascot tile class="size-5" />
        {{ footer.credits }}
      </p>
      <div class="-ml-2 flex">
        <UButton
          v-for="(link, index) of footer?.links"
          :key="index"
          v-bind="{ size: 'md', color: 'neutral', variant: 'ghost', ...link }"
        />
      </div>
    </div>
  </footer>
</template>
