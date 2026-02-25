<script setup lang="ts">
const { footer } = useAppConfig();
</script>

<template>
  <div class="flex flex-col">
    <USeparator />
    <UFooter
      class="z-10 bg-default"
      :ui="{ container: 'px-0!', left: 'text-muted text-xs' }"
    >
      <template #left>
        {{ footer.credits }}
      </template>

      <template #right>
        <template v-if="footer?.links">
          <UButton
            v-for="(link, index) of footer?.links"
            :key="index"
            v-bind="{ size: 'md', color: 'neutral', variant: 'ghost', ...link }"
          />
        </template>
      </template>
    </UFooter>
  </div>
</template>
