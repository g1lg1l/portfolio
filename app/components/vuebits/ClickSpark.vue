<!-- From Vue Bits (https://vue-bits.dev), MIT + Commons Clause, (c) 2025 David Haz.
     Changed: one fixed viewport canvas for the whole page, square pixel sparks on a 2px grid in the theme's gold,
     the loop only runs while sparks are alive, and nothing with reduced motion. -->
<template>
  <div class="relative" @click="handleClick">
    <canvas
      ref="canvasRef"
      aria-hidden="true"
      class="pointer-events-none fixed inset-0 z-50 size-full"
    />
    <slot />
  </div>
</template>

<script setup lang="ts">
interface Spark {
  x: number
  y: number
  angle: number
  startTime: number
}

const props = withDefaults(
  defineProps<{
    sparkSize?: number
    sparkRadius?: number
    sparkCount?: number
    duration?: number
  }>(),
  {
    sparkSize: 6,
    sparkRadius: 28,
    sparkCount: 8,
    duration: 420
  }
)

const canvasRef = useTemplateRef<HTMLCanvasElement>('canvasRef')
let sparks: Spark[] = []
let frame = 0
let color = ''

const ease = (t: number) => t * (2 - t)
const snap = (v: number) => Math.round(v / 2) * 2

const draw = (timestamp: number) => {
  const canvas = canvasRef.value
  const ctx = canvas?.getContext('2d')
  if (!ctx || !canvas) return
  ctx.clearRect(0, 0, canvas.width, canvas.height)
  ctx.fillStyle = color

  sparks = sparks.filter((spark) => {
    const elapsed = timestamp - spark.startTime
    if (elapsed >= props.duration) return false
    const eased = ease(elapsed / props.duration)
    const distance = eased * props.sparkRadius
    const size = Math.max(2, snap(props.sparkSize * (1 - eased)))
    ctx.fillRect(
      snap(spark.x + distance * Math.cos(spark.angle) - size / 2),
      snap(spark.y + distance * Math.sin(spark.angle) - size / 2),
      size,
      size
    )
    return true
  })

  frame = sparks.length ? requestAnimationFrame(draw) : 0
}

const handleClick = (e: MouseEvent) => {
  const canvas = canvasRef.value
  if (!canvas || window.matchMedia('(prefers-reduced-motion: reduce)').matches)
    return
  if (canvas.width !== innerWidth || canvas.height !== innerHeight) {
    canvas.width = innerWidth
    canvas.height = innerHeight
  }
  color = getComputedStyle(document.documentElement)
    .getPropertyValue('--ui-primary')
    .trim()

  const now = performance.now()
  for (let i = 0; i < props.sparkCount; i++) {
    sparks.push({
      x: e.clientX,
      y: e.clientY,
      angle: (2 * Math.PI * i) / props.sparkCount,
      startTime: now
    })
  }
  if (!frame) frame = requestAnimationFrame(draw)
}

onUnmounted(() => cancelAnimationFrame(frame))
</script>
