<script setup lang="ts">
// One pass between pages: the page you're leaving burns away from the bottom up in 6px blocks, behind a
// crackling rim of five flat fire bands with embers rising off it, and the new page is already there
// underneath. It rides the View Transitions API: the browser keeps a snapshot of the old page above the
// new one, and every frame that snapshot is masked by what hasn't burnt yet, while a small canvas (one
// pixel per block, scaled up without smoothing) draws the rim and the embers on top. Both come from the
// same numbers, so the fire always sits exactly on the edge of the hole.
// Ported from Runewheel's burn.gdshader, itself adapted from "2D dissolve with burn edge" by mreliptik
// (CC0). Browsers without view transitions, and reduced motion, just swap pages.
const BLOCK = 6
const BURN_MS = 750
const RIM = 0.09
// The rim's bands, from the hole outwards: white-hot, gold, orange, crimson, then the scorch
const BANDS: [number, number[]][] = [
  [0.12, [229, 222, 197]],
  [0.32, [211, 162, 59]],
  [0.55, [226, 130, 71]],
  [0.8, [148, 56, 53]],
  [1, [100, 38, 46]]
]

const fire = ref<HTMLCanvasElement>()
const router = useRouter()
const nuxtApp = useNuxtApp()
const reduced = usePreferredReducedMotion()

// The shader's hash and noise, in JavaScript
let seed = 0
const fract = (v: number) => v - Math.floor(v)
function hash(x: number, y: number) {
  let a = fract(x * 0.1031 + seed * 0.1234)
  let b = fract(y * 0.1031 + seed * 0.1234)
  let c = fract(x * 0.1031 + seed * 0.1234)
  const d = a * (b + 33.33) + b * (c + 33.33) + c * (a + 33.33)
  a += d
  b += d
  c += d
  return fract((a + b) * c)
}
function noise(x: number, y: number) {
  const ix = Math.floor(x)
  const iy = Math.floor(y)
  const smooth = (f: number) => f * f * f * (f * (f * 6 - 15) + 10)
  const fx = smooth(x - ix)
  const fy = smooth(y - iy)
  const top = hash(ix, iy) + (hash(ix + 1, iy) - hash(ix, iy)) * fx
  const bottom =
    hash(ix, iy + 1) + (hash(ix + 1, iy + 1) - hash(ix, iy + 1)) * fx
  return top + (bottom - top) * fy
}

onMounted(() => {
  const canvas = fire.value!
  if (!document.startViewTransition) return
  const ctx = canvas.getContext('2d')!
  const mask = document.createElement('canvas')
  const mctx = mask.getContext('2d')!
  const root = document.documentElement

  let cols = 0
  let rows = 0
  let burn = new Float32Array(0)

  // Before the old page is captured: size everything and work out how fast each block burns
  const prepare = () => {
    seed = Math.random() * 100
    cols = Math.ceil(innerWidth / BLOCK)
    rows = Math.ceil(innerHeight / BLOCK)
    canvas.width = mask.width = cols
    canvas.height = mask.height = rows
    burn = new Float32Array(cols * rows)
    for (let y = 0; y < rows; y++)
      for (let x = 0; x < cols; x++) {
        const n =
          noise(x / 30, y / 30) * 0.62 +
          noise(x / 11, y / 11) * 0.3 +
          noise(x / 4, y / 4) * 0.08
        burn[y * cols + x] = n + (1 - y / rows - n) * 0.6
      }
    root.classList.add('burning')
  }

  // One frame of the burn at progress p: the fire into the canvas, what's left into the mask
  const drawFrame = (p: number, time: number) => {
    const img = ctx.createImageData(cols, rows)
    const left = mctx.createImageData(cols, rows)
    const threshold = -RIM + (1 + RIM) * p
    for (let y = 0; y < rows; y++)
      for (let x = 0; x < cols; x++) {
        const i = y * cols + x
        const flicker = noise(x / 3, y / 3 + time * 9) - 0.5
        const heat = (burn[i]! + flicker * RIM * 0.4 - threshold) / RIM
        let color: number[] | undefined
        if (heat >= 0 && heat < 1)
          color = BANDS.find(([edge]) => heat < edge)![1]
        else if (heat >= 1 && heat < 2.2) {
          // Embers rise off the rim over what's left, fewer the further from it
          const spark = hash(x, y + Math.floor(time * 30))
          if (spark < 0.05 * (1 - (heat - 1) / 1.2)) {
            const tint = hash(y + seed, x)
            color = BANDS[tint < 0.3 ? 0 : tint < 0.7 ? 1 : 2]![1]
          }
        }
        if (color) {
          img.data.set(color, i * 4)
          img.data[i * 4 + 3] = 255
        }
        // The old page shows wherever the fire hasn't reached yet
        if (heat >= 1) left.data[i * 4 + 3] = 255
      }
    ctx.putImageData(img, 0, 0)
    mctx.putImageData(left, 0, 0)
    root.style.setProperty('--burn-mask', `url(${mask.toDataURL()})`)
  }

  const run = () => {
    // Keeps the view transition alive for as long as the burn takes
    root.animate([{ opacity: 1 }, { opacity: 1 }], {
      duration: BURN_MS,
      pseudoElement: '::view-transition-old(root)'
    })
    const start = performance.now()
    const tick = () => {
      const p = Math.min(1, (performance.now() - start) / BURN_MS)
      drawFrame(p, performance.now() / 1000)
      if (p < 1) requestAnimationFrame(tick)
    }
    tick()
  }

  const cleanup = () => {
    root.classList.remove('burning')
    root.style.removeProperty('--burn-mask')
    ctx.clearRect(0, 0, canvas.width, canvas.height)
  }

  let swapped: (() => void) | undefined
  let safety: ReturnType<typeof setTimeout>
  // A click mid-burn starts a new transition: only the latest one cleans up after itself
  let latest = 0
  const swap = () => {
    clearTimeout(safety)
    swapped?.()
    swapped = undefined
  }
  const offBefore = router.beforeEach((to, from) => {
    if (to.path === from.path || reduced.value === 'reduce') return
    const id = ++latest
    return new Promise<void>((proceed) => {
      prepare()
      drawFrame(0, 0)
      const transition = document.startViewTransition(() => {
        // The old page is captured: let the router render the new one, and wait until it's there
        proceed()
        return new Promise<void>((done) => {
          swapped = done
          safety = setTimeout(swap, 2000)
        })
      })
      transition.ready.then(run, () => {})
      transition.finished.finally(() => id === latest && cleanup())
    })
  })
  const offAfter = router.afterEach((_to, _from, failure) => {
    if (failure) swap()
  })
  // Just after the page renders, so the scroll back to the top is in the new snapshot. Not in an
  // animation frame: the browser holds those back while it waits for the new page
  const offFinish = nuxtApp.hook('page:finish', () => {
    setTimeout(swap, 0)
  })
  onBeforeUnmount(() => {
    offBefore()
    offAfter()
    offFinish()
    swap()
    cleanup()
  })
})
</script>

<template>
  <canvas ref="fire" aria-hidden="true" class="burn-fire" />
</template>

<style>
/* The fire sits in its own layer above both pages */
.burn-fire {
  pointer-events: none;
  position: fixed;
  inset: 0;
  width: 100%;
  height: 100%;
  image-rendering: pixelated;
  view-transition-name: burn-fire;
}

::view-transition-old(burn-fire) {
  display: none;
}

::view-transition-new(burn-fire) {
  animation: none;
}

/* While burning, the old page sits on top of the new one, masked down to what hasn't burnt */
html.burning::view-transition-old(root) {
  z-index: 2;
  animation: none;
  mask-image: var(--burn-mask);
  mask-size: 100% 100%;
  mask-repeat: no-repeat;
  image-rendering: pixelated;
}

html.burning::view-transition-new(root) {
  z-index: 1;
  animation: none;
}
</style>
