<script setup lang="ts"></script>

<template>
  <VuebitsClickSpark>
    <UContainer class="pt-10">
      <AppHeader :links="navLinks" />
      <slot />
      <AppFooter />
    </UContainer>
    <ClientOnly>
      <BurnTransition />
    </ClientOnly>
  </VuebitsClickSpark>
</template>
