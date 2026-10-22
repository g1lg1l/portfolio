<script setup lang="ts">
// The site icon: me as a 16x16 pixel sticker.
const pixels = LOGO.flatMap((row, y) =>
  [...row].flatMap((c, x) =>
    c === '.' ? [] : [{ x, y, fill: LOGO_COLORS[c] }]
  )
)
</script>

<template>
  <svg
    viewBox="0 0 16 16"
    shape-rendering="crispEdges"
    aria-hidden="true"
    class="pixel-logo"
  >
    <rect
      v-for="p in pixels"
      :key="`${p.x}-${p.y}`"
      :x="p.x"
      :y="p.y"
      width="1"
      height="1"
      :fill="p.fill"
    />
  </svg>
</template>
