<script setup lang="ts">
const { footer } = useAppConfig()
</script>

<template>
  <div>
    <UDivider class="mb-2" />
    <UFooter
      class="z-10 bg-default"
      :ui="{ left: 'text-muted text-xs' }"
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
