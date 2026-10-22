<script setup lang="ts">
// The page's background: whatever the season drops, drifting through a 3D grid of cells, drawn at about
// 240 pixels across and scaled up without smoothing. Snowflakes in winter, petals in spring, fireflies in
// summer, leaves in autumn (SEASONS in utils/seasons.ts). Moving the pointer stirs the air a little.
// The shader is Vue Bits' PixelSnow (https://vue-bits.dev, MIT + Commons Clause, (c) 2025 David Haz),
// rewritten on plain WebGL2 and drawn at its own low resolution instead of through three.js at full size,
// with new shapes, three colours per season, fireflies that pulse, and the wind integrated on the CPU.
// Reduced motion: one still frame.
const PIXELS = 240

const canvas = ref<HTMLCanvasElement>()
const season = useState<Season | null>('season', () => null)
const colorMode = useColorMode()
const reduced = usePreferredReducedMotion()
const route = useRoute()

const VERT = `#version 300 es
in vec2 p;
void main() { gl_Position = vec4(p, 0.0, 1.0); }`

const FRAG = `#version 300 es
precision highp float;
uniform float uTime, uWobble, uFlakeSize, uMinFlakeSize, uDepthFade, uFarPlane, uGamma, uDensity, uShape, uTwinkle;
uniform vec2 uResolution;
uniform vec3 uCam, uColorA, uColorB, uColorC;
out vec4 color;

#define M1 1597334677U
#define M2 3812015801U
#define M3 3299493293U
#define F0 (1.0/float(0xffffffffU))
#define hash(n) n*(n^(n>>15))
#define coord3(p) (uvec3(p).x*M1^uvec3(p).y*M2^uvec3(p).z*M3)

vec3 hash3(uint n) {
  return vec3(hash(n) * uvec3(0x1U, 0x1ffU, 0x3ffffU)) * F0;
}

float snowflakeDist(vec2 p) {
  float r = length(p);
  float a = atan(p.y, p.x);
  float PI = 3.14159265;
  a = abs(mod(a + PI / 6.0, PI / 3.0) - PI / 6.0);
  vec2 q = r * vec2(cos(a), sin(a));
  float dMain = abs(q.y);
  dMain = max(dMain, max(-q.x, q.x - 1.0));
  vec2 b1s = vec2(0.4, 0.0);
  vec2 b1d = vec2(0.574, 0.819);
  float b1t = clamp(dot(q - b1s, b1d), 0.0, 0.4);
  float dB1 = length(q - b1s - b1t * b1d);
  vec2 b2s = vec2(0.7, 0.0);
  float b2t = clamp(dot(q - b2s, b1d), 0.0, 0.25);
  float dB2 = length(q - b2s - b2t * b1d);
  return min(dMain, min(dB1, dB2)) * 10.0;
}

void main() {
  vec2 res = uResolution;
  vec3 ray = normalize(vec3((gl_FragCoord.xy - res * 0.5) / res.x, 1.0));
  vec3 camK = normalize(vec3(1.0, 1.0, 1.0));
  vec3 camI = normalize(vec3(1.0, 0.0, -1.0));
  vec3 camJ = cross(camK, camI);
  ray = ray.x * camI + ray.y * camJ + ray.z * camK;

  // Where the wind has carried the camera so far (summed up in JavaScript, so gusts stay smooth)
  vec3 camPos = uCam.x * camI + uCam.y * camJ + uCam.z * camK;
  vec3 pos = camPos;
  vec3 strides = 1.0 / max(abs(ray), vec3(0.001));
  vec3 phase = fract(pos) * strides;
  phase = mix(strides - phase, phase, step(ray, vec3(0.0)));

  float t = 0.0;
  for (int i = 0; i < 256; i++) {
    if (t >= uFarPlane) break;
    vec3 fpos = floor(pos);
    vec3 h = hash3(coord3(fpos));
    if (h.x < uDensity) {
      vec3 flakePos = 0.5 - 0.5 * cos(
        4.0 * sin(fpos.yzx * 0.073) + 4.0 * sin(fpos.zxy * 0.27) + 2.0 * h + uWobble * vec3(7.0, 8.0, 5.0)
      );
      flakePos = flakePos * 0.8 + 0.1 + fpos;
      float toIntersection = dot(flakePos - pos, camK) / dot(ray, camK);
      if (toIntersection > 0.0) {
        vec3 testPos = pos + ray * toIntersection - flakePos;
        vec2 q = vec2(dot(testPos, camI), dot(testPos, camJ));
        float depth = dot(flakePos - camPos, camK);
        float flakeSize = max(uFlakeSize, uMinFlakeSize * depth * 0.5 / res.x);
        // Petals and leaves turn as they fall
        float spin = h.z * 6.2831 + uWobble * (h.y - 0.5) * 6.0;
        vec2 r = mat2(cos(spin), -sin(spin), sin(spin), cos(spin)) * q;
        float dist;
        if (uShape < 0.5) dist = max(abs(q.x), abs(q.y));
        else if (uShape < 1.5) dist = length(q);
        else if (uShape < 2.5) dist = snowflakeDist(q / flakeSize) * flakeSize;
        else if (uShape < 3.5) dist = length(r * vec2(1.0, 2.0));
        else dist = (abs(r.x) + abs(r.y) * 1.8) * 0.75;

        if (dist < flakeSize) {
          // Fades with distance, and fades in from the camera so nothing passes right in front of it
          float intensity = exp2(-(t + toIntersection) / uDepthFade) * min(1.0, pow(uFlakeSize / flakeSize, 2.0))
            * smoothstep(1.5, 4.0, depth);
          // Fireflies glow on and off, each at its own pace
          float pulse = 0.15 + 0.85 * pow(0.5 + 0.5 * sin(uTime * (1.0 + 2.0 * h.z) + h.x * 40.0), 2.0);
          intensity *= mix(1.0, pulse, uTwinkle);
          vec3 tint = h.y < 0.34 ? uColorA : h.y < 0.67 ? uColorB : uColorC;
          color = vec4(tint, clamp(pow(intensity, uGamma), 0.0, 1.0));
          return;
        }
      }
    }
    float nextStep = min(min(phase.x, phase.y), phase.z);
    vec3 sel = step(phase, vec3(nextStep));
    phase = phase - nextStep + strides * sel;
    t += nextStep;
    pos = mix(pos + ray * nextStep, floor(pos + ray * nextStep + 0.5), sel);
  }
  color = vec4(0.0);
}`

const rgb = (hex: string) =>
  [1, 3, 5].map((i) => parseInt(hex.slice(i, i + 2), 16) / 255)

onMounted(() => {
  // The season from the calendar, unless the footer's switch (or ?season=) picked another
  const asked = route.query.season as Season | undefined
  season.value ??= asked && SEASONS[asked] ? asked : seasonOf(new Date())

  const c = canvas.value!
  const gl = c.getContext('webgl2', {
    alpha: true,
    premultipliedAlpha: false,
    antialias: false
  })
  if (!gl) return
  const shader = (type: number, src: string) => {
    const s = gl.createShader(type)!
    gl.shaderSource(s, src)
    gl.compileShader(s)
    return s
  }
  const program = gl.createProgram()!
  gl.attachShader(program, shader(gl.VERTEX_SHADER, VERT))
  gl.attachShader(program, shader(gl.FRAGMENT_SHADER, FRAG))
  gl.linkProgram(program)
  if (!gl.getProgramParameter(program, gl.LINK_STATUS)) return
  gl.useProgram(program)
  gl.bindBuffer(gl.ARRAY_BUFFER, gl.createBuffer())
  gl.bufferData(
    gl.ARRAY_BUFFER,
    new Float32Array([-1, -1, 3, -1, -1, 3]),
    gl.STATIC_DRAW
  )
  const loc = gl.getAttribLocation(program, 'p')
  gl.enableVertexAttribArray(loc)
  gl.vertexAttribPointer(loc, 2, gl.FLOAT, false, 0, 0)
  const u = (name: string) => gl.getUniformLocation(program, name)

  gl.uniform1f(u('uMinFlakeSize'), 1.25)
  gl.uniform1f(u('uDepthFade'), 8)
  gl.uniform1f(u('uFarPlane'), 20)
  gl.uniform1f(u('uGamma'), 0.4545)

  // The look of the current season, in the current theme
  const apply = () => {
    const s = SEASONS[season.value ?? 'winter']
    const colors = colorMode.value === 'dark' ? s.dark : s.light
    gl.uniform3fv(u('uColorA'), rgb(colors[0]))
    gl.uniform3fv(u('uColorB'), rgb(colors[1]))
    gl.uniform3fv(u('uColorC'), rgb(colors[2]))
    gl.uniform1f(u('uShape'), s.shape)
    gl.uniform1f(u('uDensity'), s.density)
    gl.uniform1f(u('uFlakeSize'), s.size)
    gl.uniform1f(u('uTwinkle'), s.twinkle)
  }
  const resize = () => {
    c.width = PIXELS
    c.height = Math.round((PIXELS * innerHeight) / innerWidth)
    gl.viewport(0, 0, c.width, c.height)
    gl.uniform2f(u('uResolution'), c.width, c.height)
  }

  // The wind carries the camera; a pointer gust adds to it and dies down
  const cam: [number, number, number] = [0, 0, 0]
  const gust: [number, number] = [0, 0]
  let time = 0
  let wobble = 0
  const draw = () => {
    gl.uniform3fv(u('uCam'), cam)
    gl.uniform1f(u('uTime'), time)
    gl.uniform1f(u('uWobble'), wobble)
    gl.clearColor(0, 0, 0, 0)
    gl.clear(gl.COLOR_BUFFER_BIT)
    gl.drawArrays(gl.TRIANGLES, 0, 3)
  }

  resize()
  apply()
  draw()
  useEventListener('resize', () => {
    resize()
    draw()
  })
  watch([season, () => colorMode.value], () => {
    apply()
    draw()
  })
  if (reduced.value === 'reduce') return

  useEventListener(
    'pointermove',
    (e: PointerEvent) => {
      gust[0] = Math.max(-3, Math.min(3, gust[0] - e.movementX * 0.02))
      gust[1] = Math.max(-3, Math.min(3, gust[1] + e.movementY * 0.02))
    },
    { passive: true }
  )

  let frame = 0
  let last = performance.now()
  const tick = (now: number) => {
    frame = requestAnimationFrame(tick)
    // 30 frames a second is plenty for a background
    if (now - last < 1000 / 31) return
    const dt = Math.min(0.1, (now - last) / 1000)
    last = now
    const s = SEASONS[season.value ?? 'winter']
    const angle = (s.wind * Math.PI) / 180
    cam[0] += (Math.cos(angle) * 0.4 * s.speed + gust[0]) * dt
    cam[1] += (Math.sin(angle) * 0.4 * s.speed + gust[1]) * dt
    cam[2] += 0.1 * s.speed * dt
    gust[0] *= 0.94
    gust[1] *= 0.94
    time += dt
    wobble += dt * s.speed * 0.1
    draw()
  }
  frame = requestAnimationFrame(tick)
  onBeforeUnmount(() => cancelAnimationFrame(frame))
})
</script>

<template>
  <canvas
    ref="canvas"
    aria-hidden="true"
    class="pointer-events-none fixed inset-0 -z-10 size-full [image-rendering:pixelated]"
  />
</template>
