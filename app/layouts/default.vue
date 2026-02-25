<script setup lang="ts"></script>

<template>
  <div>
    <UContainer class="pt-10">
      <AppHeader :links="navLinks" />
      <slot />
      <AppFooter />
    </UContainer>
  </div>
</template>
