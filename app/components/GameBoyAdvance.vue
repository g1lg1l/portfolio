<script setup lang="ts">
// A Game Boy Advance-style handheld ("Retro Handheld" by Michael Fuchs, CC-BY 3.0, via Poly Pizza),
// recoloured indigo, cel-shaded, rendered small then scaled up without smoothing (pixel art). Its screen runs the runner in demo mode. Click it and it's picked up: it flies to the middle of
// the window over a dimmed page, like a modal, and turns into a little menu: Play (the runner), Projects
// and Games, driven by the d-pad and A/B (clicking them, or the arrows, Enter and Backspace). Escape or a
// click outside puts it back.
import * as THREE from 'three'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js'

interface Entry {
  title: string
  to: string
  note?: string
}

const props = defineProps<{
  projects: Entry[]
  games: Entry[]
}>()

const el = ref<HTMLButtonElement>()
const stage = ref<HTMLDivElement>()
const focused = ref(false)
// The dimmed page fades out as soon as it's put down, before the Game Boy is back in place
const dimmed = ref(false)
const reduced = usePreferredReducedMotion()
const visible = useElementVisibility(el)
const modelUrl = `${useRuntimeConfig().app.baseURL}models/retro-handheld.glb`

// The screen's state machine
type Screen = 'play' | 'menu' | 'projects' | 'games'
const MENU: { label: string; screen: Screen }[] = [
  { label: 'Play', screen: 'play' },
  { label: 'Projects', screen: 'projects' },
  { label: 'Games', screen: 'games' }
]
const ui = reactive({ screen: 'play' as Screen, cursor: 0, booted: 0 })
const list = computed(() =>
  ui.screen === 'projects'
    ? props.projects
    : ui.screen === 'games'
      ? props.games
      : []
)

let api: { press: (b: Button) => void } | undefined
type Button = 'up' | 'down' | 'left' | 'right' | 'a' | 'b' | 'start' | 'select'

function leave(to?: string) {
  if (!to) return close()
  // Off to a page: drop it back at once, the page dissolve covers the rest
  settle()
  if (to.startsWith('http')) window.open(to, '_blank', 'noopener')
  else navigateTo(to)
}

function handle(b: Button) {
  if (ui.screen === 'play') {
    if (b === 'b') ui.screen = 'menu'
    return
  }
  if (ui.screen === 'menu') {
    if (b === 'up') ui.cursor = (ui.cursor + MENU.length - 1) % MENU.length
    if (b === 'down') ui.cursor = (ui.cursor + 1) % MENU.length
    if (b === 'a' || b === 'start') {
      ui.screen = MENU[ui.cursor]!.screen
      ui.cursor = 0
    }
    if (b === 'b') close()
    return
  }
  const n = list.value.length
  if (b === 'up' || b === 'left') ui.cursor = (ui.cursor + n - 1) % n
  if (b === 'down' || b === 'right') ui.cursor = (ui.cursor + 1) % n
  if (b === 'a' || b === 'start') leave(list.value[ui.cursor]?.to)
  if (b === 'b') {
    ui.cursor = MENU.findIndex((m) => m.screen === ui.screen)
    ui.screen = 'menu'
  }
}

// Picking it up: the canvas moves into a fixed stage above the dimmed page and grows to the middle
const place = (
  s: HTMLElement,
  r: { left: number; top: number; width: number; height: number }
) =>
  Object.assign(s.style, {
    left: `${r.left}px`,
    top: `${r.top}px`,
    width: `${r.width}px`,
    height: `${r.height}px`
  })
const centred = () => {
  const r = el.value!.getBoundingClientRect()
  const scale = Math.min(
    (innerWidth * 0.92) / r.width,
    (innerHeight * 0.72) / r.height
  )
  const width = r.width * scale
  const height = r.height * scale
  return {
    left: (innerWidth - width) / 2,
    top: (innerHeight - height) / 2.4,
    width,
    height
  }
}
const canvasEl = () =>
  el.value?.querySelector('canvas') ?? stage.value?.querySelector('canvas')

async function open() {
  const canvas = canvasEl()
  if (focused.value || !canvas) return
  focused.value = true
  dimmed.value = true
  ui.screen = 'menu'
  ui.cursor = 0
  ui.booted = performance.now()
  document.documentElement.style.overflow = 'hidden'
  await nextTick()
  const s = stage.value!
  s.style.transition = 'none'
  place(s, el.value!.getBoundingClientRect())
  s.appendChild(canvas)
  void s.offsetWidth
  s.style.transition =
    reduced.value === 'reduce'
      ? 'none'
      : 'all 0.55s cubic-bezier(0.22, 1, 0.36, 1)'
  place(s, centred())
  s.focus()
}

// Put it back where it was, then return the canvas to the page
function close() {
  const s = stage.value
  if (!focused.value || !s) return
  dimmed.value = false
  ui.screen = 'play'
  place(s, el.value!.getBoundingClientRect())
  // Back on the page, keyboard focus goes back to where it was
  const done = () => {
    settle()
    el.value?.focus({ preventScroll: true })
  }
  if (reduced.value === 'reduce') done()
  else setTimeout(done, 560)
}
function settle() {
  const canvas = canvasEl()
  if (canvas && el.value) el.value.appendChild(canvas)
  focused.value = false
  dimmed.value = false
  ui.screen = 'play'
  document.documentElement.style.overflow = ''
}

const KEYS: Record<string, Button> = {
  ArrowUp: 'up',
  ArrowDown: 'down',
  ArrowLeft: 'left',
  ArrowRight: 'right',
  w: 'up',
  s: 'down',
  a: 'left',
  d: 'right',
  Enter: 'a',
  ' ': 'a',
  x: 'a',
  Backspace: 'b',
  z: 'b'
}
useEventListener('keydown', (e: KeyboardEvent) => {
  if (!focused.value) return
  if (e.key === 'Escape') return close()
  // Keep focus on the Game Boy while it's in the hand (Escape puts it down)
  if (e.key === 'Tab') return e.preventDefault()
  const b = KEYS[e.key]
  if (!b) return
  e.preventDefault()
  api?.press(b)
})
useEventListener(
  'resize',
  () => focused.value && stage.value && place(stage.value, centred())
)

onMounted(() => {
  if (!el.value) return
  let renderer: THREE.WebGLRenderer
  try {
    renderer = new THREE.WebGLRenderer({ antialias: false, alpha: true })
  } catch {
    return // No WebGL: the hero just goes without its Game Boy
  }
  const canvas = renderer.domElement
  canvas.style.imageRendering = 'pixelated'
  canvas.style.display = 'block'
  canvas.style.width = canvas.style.height = '100%'
  el.value.appendChild(canvas)
  const still = reduced.value === 'reduce'

  const scene = new THREE.Scene()
  const camera = new THREE.PerspectiveCamera(30, 1.5, 1, 100)
  camera.position.set(0, 0.2, 14.5)
  camera.lookAt(0, 0, 0)
  scene.add(new THREE.HemisphereLight('#ffffff', '#2e1065', 1.4))
  const sun = new THREE.DirectionalLight('#ffffff', 2.3)
  sun.position.set(-3, 5, 6)
  scene.add(sun)

  // Three hard bands of light: cel shading
  const bands = new THREE.DataTexture(
    new Uint8Array([90, 170, 255]),
    3,
    1,
    THREE.RedFormat
  )
  bands.minFilter = bands.magFilter = THREE.NearestFilter
  bands.needsUpdate = true
  const materials = new Map<string, THREE.Material>()
  const toon = (color: string) => {
    if (!materials.has(color))
      materials.set(
        color,
        new THREE.MeshToonMaterial({ color, gradientMap: bands })
      )
    return materials.get(color)!
  }
  // The model's units are about 39 wide: `model` scales it to ~7.6, and everything laid over it
  // (screen, button hit areas) is placed in those units
  const gba = new THREE.Group()
  scene.add(gba)
  const model = new THREE.Group()
  model.scale.setScalar(0.195)
  gba.add(model)
  const RECOLOUR: Record<string, string> = {
    lambert3SG: '#6d5bd0', // the shell
    lambert7SG: '#2e1065', // buttons and d-pad
    lambert5SG: '#1e1035' // screen surround
  }
  const ink = new THREE.MeshBasicMaterial({
    color: '#1e1035',
    side: THREE.BackSide
  })
  new GLTFLoader().load(modelUrl, (gltf) => {
    // Collected first: the outlines added below are meshes too, and traverse would walk into them
    const parts: THREE.Mesh[] = []
    gltf.scene.traverse((o) => o instanceof THREE.Mesh && parts.push(o))
    parts.forEach((o) => {
      o.material = toon(
        RECOLOUR[(o.material as THREE.Material).name] ?? '#6d5bd0'
      )
      // Outline: a copy pushed out along its normals, drawn from the back
      const hull = o.geometry.clone()
      const p = hull.attributes.position!
      const n = hull.attributes.normal!
      for (let i = 0; i < p.count; i++)
        p.setXYZ(
          i,
          p.getX(i) + n.getX(i) * 0.35,
          p.getY(i) + n.getY(i) * 0.35,
          p.getZ(i) + n.getZ(i) * 0.35
        )
      o.add(new THREE.Mesh(hull, ink))
    })
    model.add(gltf.scene)
  })

  // The screen: 240x160, like the real one
  const SW = 240
  const SH = 184 // the model's screen is a little squarer than the real 3:2
  const screen2d = document.createElement('canvas')
  screen2d.width = SW
  screen2d.height = SH
  const ctx = screen2d.getContext('2d')!
  ctx.imageSmoothingEnabled = false
  const game2d = document.createElement('canvas')
  game2d.width = RUNNER_W
  game2d.height = RUNNER_H
  const gctx = game2d.getContext('2d')!
  const runner = createRunner()
  const tex = new THREE.CanvasTexture(screen2d)
  tex.colorSpace = THREE.SRGBColorSpace
  tex.minFilter = THREE.LinearFilter
  tex.magFilter = THREE.NearestFilter
  tex.generateMipmaps = false
  const uniforms = {
    uTex: { value: tex },
    uTime: { value: 0 },
    uOn: { value: still ? 1 : 0 },
    uHit: { value: 0 }
  }
  const screen = new THREE.Mesh(
    new THREE.PlaneGeometry(16.16, 12.36),
    new THREE.ShaderMaterial({
      uniforms,
      vertexShader: /* glsl */ `
        varying vec2 vUv;
        void main() {
          vUv = uv;
          gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }`,
      fragmentShader: /* glsl */ `
        uniform sampler2D uTex;
        uniform float uTime, uOn, uHit;
        varying vec2 vUv;
        float rand(vec2 p) { return fract(sin(dot(p, vec2(12.9898, 78.233))) * 43758.5453); }
        void main() {
          vec2 c = vUv * 2.0 - 1.0;
          vec2 uv = vUv;
          uv.x += (rand(vec2(floor(uv.y * 160.0), floor(uTime * 24.0))) - 0.5) * 0.04 * uHit;
          vec3 col = texture2D(uTex, uv).rgb;
          col = mix(col, vec3(rand(floor(uv * vec2(240.0, 160.0)) + uTime)), uHit * 0.6);
          // Power on: a bright line that opens up into the picture
          float w = smoothstep(0.0, 0.35, uOn), h = smoothstep(0.3, 1.0, uOn);
          float lit = step(abs(c.x), w) * step(abs(c.y), max(h, 0.02));
          col = (col + (1.0 - h) * 1.5) * lit;
          gl_FragColor = vec4(col, 1.0);
          #include <colorspace_fragment>
        }`
    })
  )
  screen.position.set(0, 0.04, 2.17)
  model.add(screen)

  // The model is a single mesh, so its buttons are invisible hit areas laid over it
  const meshes = new Map<THREE.Object3D, Button>()
  const hitMat = new THREE.MeshBasicMaterial({ visible: false })
  const ZONES: [Button, number, number, number][] = [
    ['up', -14.1, 1.6, 1.8],
    ['down', -14.1, -1.9, 1.8],
    ['left', -15.9, -0.15, 1.8],
    ['right', -12.3, -0.15, 1.8],
    ['a', 15.7, 1.1, 2.8],
    ['b', 12.3, -1.4, 2.8],
    ['select', -2.05, -8.15, 2],
    ['start', 5.4, -8.15, 2]
  ]
  for (const [b, x, y, size] of ZONES) {
    const zone = new THREE.Mesh(new THREE.BoxGeometry(size, size, 1), hitMat)
    zone.position.set(x, y, 2.6)
    model.add(zone)
    meshes.set(zone, b)
  }
  // A press kicks the whole console a little toward the side it came from
  const kickX = { x: 0, v: 0 }
  const kickY = { x: 0, v: 0 }

  const drawText = (
    s: string,
    x: number,
    y: number,
    size = 16,
    color = PALETTE[3]!
  ) => {
    ctx.font = `${size}px "Pixelify Sans", monospace`
    ctx.fillStyle = color
    ctx.fillText(s, x, y)
  }
  const fit = (s: string, width: number, size = 16) => {
    ctx.font = `${size}px "Pixelify Sans", monospace`
    if (ctx.measureText(s).width <= width) return s
    while (s.length && ctx.measureText(`${s}…`).width > width)
      s = s.slice(0, -1)
    return `${s}…`
  }

  const drawScreen = (t: number) => {
    const [bg, dim, mid, light] = PALETTE
    if (ui.screen === 'play') {
      runner.draw(gctx, t)
      ctx.drawImage(game2d, 0, 0, SW, (SW * RUNNER_H) / RUNNER_W)
      if (!focused.value && Math.floor(t * 1.5) % 2) {
        ctx.fillStyle = bg!
        ctx.fillRect(66, 163, 108, 18)
        drawText('Pick me up', 76, 177, 14, light)
      } else if (focused.value) {
        ctx.fillStyle = bg!
        ctx.fillRect(0, 162, SW, 22)
        drawText('A jump   B menu', 8, 177, 13, mid)
      }
      return
    }
    ctx.fillStyle = bg!
    ctx.fillRect(0, 0, SW, SH)
    // The boot logo slides down for half a second after it's picked up
    const boot = Math.min(1, (performance.now() - ui.booted) / 500)
    const title =
      ui.screen === 'menu'
        ? 'GIL ADVANCE'
        : ui.screen === 'projects'
          ? 'Projects'
          : 'Games'
    drawText(title, 12, 10 + 16 * boot, 16, mid)
    ctx.fillStyle = dim!
    ctx.fillRect(12, 32, SW - 24, 2)
    const rows =
      ui.screen === 'menu' ? MENU.map((m) => ({ title: m.label })) : list.value
    const start = Math.max(0, Math.min(ui.cursor - 2, rows.length - 5))
    rows.slice(start, start + 5).forEach((row, i) => {
      const index = start + i
      const y = 44 + i * 20
      if (index === ui.cursor) {
        ctx.fillStyle = dim!
        ctx.fillRect(8, y - 2, SW - 16, 19)
        if (Math.floor(t * 3) % 2) drawText('▶', 12, y + 13, 14, light)
      }
      drawText(
        fit(row.title, SW - 52),
        30,
        y + 13,
        16,
        index === ui.cursor ? light : PALETTE[3]! + 'b0'
      )
    })
    const note = ui.screen !== 'menu' ? list.value[ui.cursor]?.note : undefined
    ctx.fillStyle = bg!
    ctx.fillRect(0, 164, SW, 20)
    drawText(
      note ? fit(note, SW - 16, 12) : 'A choose   B back',
      8,
      178,
      12,
      mid
    )
  }

  // Springs: the entrance (a short drop and a pop) and the squash on a press
  const drop = { x: still ? 0 : 0.6, v: 0 }
  const pop = { x: still ? 0 : -0.4, v: 0 }
  const squash = { x: 0, v: 0 }
  const spring = (
    s: { x: number; v: number },
    dt: number,
    k: number,
    d: number
  ) => {
    s.v += (-k * s.x - d * s.v) * dt
    s.x += s.v * dt
  }
  const look = { x: 0, y: 0 }
  const ndc = new THREE.Vector2()
  const ray = new THREE.Raycaster()

  api = {
    press(b) {
      const left = ['up', 'down', 'left', 'right', 'select'].includes(b)
      kickY.v += left ? -2.5 : 2.5
      kickX.v += b === 'up' ? -2 : b === 'down' ? 2 : 1.2
      if (ui.screen === 'play') {
        if (b === 'a' || b === 'up') runner.press(clock())
        if (b === 'start') runner.pause()
      }
      handle(b)
    }
  }

  useEventListener(
    canvas,
    'pointermove',
    (e: PointerEvent) => {
      if (focused.value) return
      const box = canvas.getBoundingClientRect()
      look.x = (e.clientX - box.left) / box.width - 0.5
      look.y = (e.clientY - box.top) / box.height - 0.5
    },
    { passive: true }
  )
  useEventListener(canvas, 'pointerleave', () => {
    look.x = look.y = 0
  })
  // On the page a click picks it up (the button around the canvas does that); in the hand, clicks press buttons
  useEventListener(canvas, 'click', (e: MouseEvent) => {
    if (!focused.value) return
    e.stopPropagation()
    const box = canvas.getBoundingClientRect()
    ndc.set(
      ((e.clientX - box.left) / box.width) * 2 - 1,
      -((e.clientY - box.top) / box.height) * 2 + 1
    )
    ray.setFromCamera(ndc, camera)
    for (const hit of ray.intersectObjects([...meshes.keys()], true)) {
      let o: THREE.Object3D | null = hit.object
      while (o && !meshes.has(o)) o = o.parent
      if (o) return api!.press(meshes.get(o)!)
    }
    squash.v = -2.5
  })

  let size = [0, 0]
  const start = performance.now()
  const clock = () => (performance.now() - start) / 1000
  let last = 0
  document.fonts?.load('16px "Pixelify Sans"')
  renderer.setAnimationLoop(() => {
    const t = clock()
    if (!visible.value && !focused.value) return
    // 30 frames a second on the page is plenty for a pixel-art screen; full rate in the hand
    if (!focused.value && t - last < 1 / 31) return
    const dt = Math.min(0.05, t - last)
    last = t

    // Follow whatever box the canvas sits in (the page, or the stage while it's in the hand)
    const parent = canvas.parentElement
    if (
      parent &&
      (parent.clientWidth !== size[0] || parent.clientHeight !== size[1])
    ) {
      size = [parent.clientWidth, parent.clientHeight]
      // Small and chunky on the page; sharp enough to read the menus in the hand
      renderer.setPixelRatio(
        Math.min(1, (focused.value ? 900 : 420) / size[0]!)
      )
      renderer.setSize(size[0]!, size[1]!, false)
      camera.aspect = size[0]! / size[1]!
      camera.updateProjectionMatrix()
    }
    canvas.style.maskImage = focused.value
      ? ''
      : 'linear-gradient(transparent, black 10%, black 90%, transparent)'

    // Reduced motion: the game only moves while it's in the hand
    if (ui.screen === 'play' && (!still || focused.value)) runner.step(dt, t)
    drawScreen(t)
    tex.needsUpdate = true
    uniforms.uTime.value = t
    uniforms.uOn.value = Math.min(
      1,
      uniforms.uOn.value + (t > 0.5 ? dt * 1.6 : 0)
    )
    uniforms.uHit.value = Math.max(0, 1 - (t - runner.hit) * 3)

    spring(kickX, dt, 220, 14)
    spring(kickY, dt, 220, 14)
    model.rotation.set(kickX.x * 0.12, kickY.x * 0.12, 0)

    spring(drop, dt, 90, 14)
    spring(pop, dt, 160, 12)
    spring(squash, dt, 120, 9)
    const s = 1 + pop.x
    gba.scale.set(s * (1 - squash.x * 0.4), s * (1 + squash.x), s)
    const calm = still || focused.value
    gba.position.y = drop.x + (calm ? 0 : Math.sin(t * 1.5) * 0.06)
    const ry = focused.value ? 0 : -0.18 + look.x * 0.35
    const rx = focused.value ? 0 : 0.08 + look.y * 0.2
    gba.rotation.y += (ry - gba.rotation.y) * 0.08
    gba.rotation.x += (rx - gba.rotation.x) * 0.08

    renderer.render(scene, camera)
  })

  onBeforeUnmount(() => {
    renderer.setAnimationLoop(null)
    document.documentElement.style.overflow = ''
    scene.traverse((o) => {
      if (o instanceof THREE.Mesh) {
        o.geometry.dispose()
        ;[o.material].flat().forEach((m) => m.dispose())
      }
    })
    tex.dispose()
    bands.dispose()
    renderer.dispose()
    canvas.remove()
  })
})
</script>

<template>
  <button
    ref="el"
    type="button"
    aria-label="A Game Boy Advance: pick it up to play, or browse projects and games on it. Arrows move, Enter chooses, Backspace goes back, Escape puts it down."
    :aria-expanded="focused"
    class="block size-full cursor-pointer rounded-3xl focus-visible:outline-2 focus-visible:outline-primary"
    @click="open"
  />
  <Teleport to="body">
    <Transition
      enter-from-class="opacity-0"
      leave-to-class="opacity-0"
      enter-active-class="transition-opacity duration-300"
      leave-active-class="transition-opacity duration-300"
    >
      <div
        v-if="dimmed"
        class="fixed inset-0 z-[60] bg-default/85 backdrop-blur-sm"
        @click="close"
      >
        <p
          id="gba-hint"
          class="absolute inset-x-0 bottom-8 text-center font-pixel text-sm text-muted"
        >
          Arrows or the d-pad to move, A or Enter to choose, B to go back. Esc
          to put it down.
        </p>
        <UButton
          icon="i-pixelarticons-close"
          color="neutral"
          variant="ghost"
          aria-label="Put the Game Boy down"
          class="absolute top-4 right-4"
          @click.stop="close"
        />
      </div>
    </Transition>
    <div
      v-show="focused"
      ref="stage"
      tabindex="-1"
      role="dialog"
      aria-modal="true"
      aria-label="Game Boy Advance"
      aria-describedby="gba-hint"
      class="fixed z-[61] outline-none"
    />
  </Teleport>
</template>
