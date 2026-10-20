<script setup lang="ts">
// The logo as a character: it bobs, glances around and blinks on a loop.
// With `track`, the eyes follow the pointer and the loop resumes once it stops moving.
const props = defineProps<{
  tile?: boolean
  track?: boolean
}>()

const el = ref<SVGSVGElement>()
const tracking = ref(false)
const look = reactive({ x: 0, y: 0 })
const settle = useDebounceFn(() => (tracking.value = false), 2500)

if (props.track) {
  useEventListener(
    'pointermove',
    (e: PointerEvent) => {
      if (!el.value) return
      const box = el.value.getBoundingClientRect()
      const dx = e.clientX - (box.left + box.width / 2)
      const dy = e.clientY - (box.top + box.height / 2)
      const distance = Math.hypot(dx, dy) || 1
      // Full glance once the pointer is ~300px away, smaller when it's close
      const reach = Math.min(1, distance / 300)
      look.x = (dx / distance) * 4 * reach
      look.y = (dy / distance) * 3 * reach
      tracking.value = true
      settle()
    },
    { passive: true }
  )
}
</script>

<template>
  <svg
    ref="el"
    :viewBox="tile ? '0 0 64 64' : '2 14 60 40'"
    class="mascot"
    :class="{ tracking }"
    aria-hidden="true"
  >
    <rect v-if="tile" width="64" height="64" rx="15" fill="#171717" />
    <g transform="rotate(-6 32 32)">
      <g class="bob">
        <g
          fill="none"
          :stroke="tile ? '#c4c06c' : 'var(--mascot-gold)'"
          stroke-width="5"
          stroke-linecap="round"
        >
          <circle cx="19" cy="34" r="10" />
          <circle cx="45" cy="34" r="10" />
          <path d="M29.5 32q2.5-2.5 5 0M9 32 5 28.5M55 32 59 28.5" />
        </g>
        <g class="look" :style="{ '--x': `${look.x}px`, '--y': `${look.y}px` }">
          <g class="blink" :fill="tile ? '#f5f5f5' : 'currentColor'">
            <circle cx="19" cy="34" r="3.2" />
            <circle cx="45" cy="34" r="3.2" />
          </g>
        </g>
      </g>
    </g>
  </svg>
</template>

<style scoped>
.bob,
.look,
.blink {
  transform-box: fill-box;
  transform-origin: center;
}

.bob {
  animation: bob 3.6s ease-in-out infinite;
}

.look {
  animation: glance 8s ease-in-out infinite;
}

.blink {
  animation: blink 7s infinite;
}

.tracking .look {
  animation: none;
  transform: translate(var(--x), var(--y));
  transition: transform 0.15s ease-out;
}

@keyframes bob {
  0%,
  100% {
    transform: translateY(0) rotate(0);
  }
  50% {
    transform: translateY(-1.5px) rotate(1.5deg);
  }
}

@keyframes glance {
  0%,
  18%,
  86%,
  100% {
    transform: translate(0, 0);
  }
  24%,
  40% {
    transform: translate(-3.5px, 0.5px);
  }
  46%,
  62% {
    transform: translate(3.5px, -1px);
  }
  68%,
  80% {
    transform: translate(2px, 2px);
  }
}

@keyframes blink {
  0%,
  30%,
  33%,
  78%,
  81%,
  85%,
  100% {
    transform: scaleY(1);
  }
  31.5%,
  79.5%,
  83% {
    transform: scaleY(0.1);
  }
}

@media (prefers-reduced-motion: reduce) {
  .bob,
  .look,
  .blink {
    animation: none;
  }
}
</style>
