<!-- From Vue Bits (https://vue-bits.dev), MIT + Commons Clause, (c) 2025 David Haz. Changed: theme colours (violet and cyan split), size and font left to the caller, still with reduced motion. -->
<template>
  <div :class="computedClasses" :style="inlineStyles" :data-text="children">
    {{ children }}
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import type { CSSProperties } from 'vue'

interface GlitchTextProps {
  children: string
  speed?: number
  enableShadows?: boolean
  enableOnHover?: boolean
  className?: string
}

interface CustomCSSProperties extends CSSProperties {
  '--after-duration': string
  '--before-duration': string
  '--after-shadow': string
  '--before-shadow': string
}

const props = withDefaults(defineProps<GlitchTextProps>(), {
  speed: 0.5,
  enableShadows: true,
  enableOnHover: false,
  className: ''
})

const inlineStyles = computed((): CustomCSSProperties => ({
  '--after-duration': `${props.speed * 3}s`,
  '--before-duration': `${props.speed * 2}s`,
  '--after-shadow': props.enableShadows ? '-5px 0 var(--ui-color-primary-500)' : 'none',
  '--before-shadow': props.enableShadows ? '5px 0 #22d3ee' : 'none'
}))

const baseClasses = [
  'text-highlighted',
  'whitespace-nowrap',
  'relative',
  'mx-auto',
  'select-none',

  'before:content-[attr(data-text)]',
  'before:absolute',
  'before:top-0',
  'before:text-highlighted',
  'before:bg-(--ui-bg)',
  'before:overflow-hidden',
  'before:[clip-path:inset(0_0_0_0)]',

  'after:content-[attr(data-text)]',
  'after:absolute',
  'after:top-0',
  'after:text-highlighted',
  'after:bg-(--ui-bg)',
  'after:overflow-hidden',
  'after:[clip-path:inset(0_0_0_0)]'
]

const normalGlitchClasses = [
  'after:left-[10px]',
  'after:[text-shadow:var(--after-shadow,-10px_0_red)]',
  'after:[animation:animate-glitch_var(--after-duration,3s)_infinite_linear_alternate-reverse]',

  'before:left-[-10px]',
  'before:[text-shadow:var(--before-shadow,10px_0_cyan)]',
  'before:[animation:animate-glitch_var(--before-duration,2s)_infinite_linear_alternate-reverse]',
  'motion-reduce:after:[animation:none]',
  'motion-reduce:before:[animation:none]'
]

const hoverOnlyClasses = [
  'before:content-[""]',
  'before:opacity-0',
  'before:[animation:none]',
  'after:content-[""]',
  'after:opacity-0',
  'after:[animation:none]',

  'hover:before:content-[attr(data-text)]',
  'hover:before:opacity-100',
  'hover:before:left-[-10px]',
  'hover:before:[text-shadow:var(--before-shadow,10px_0_cyan)]',
  'hover:before:[animation:animate-glitch_var(--before-duration,2s)_infinite_linear_alternate-reverse]',

  'hover:after:content-[attr(data-text)]',
  'hover:after:opacity-100',
  'hover:after:left-[10px]',
  'hover:after:[text-shadow:var(--after-shadow,-10px_0_red)]',
  'hover:after:[animation:animate-glitch_var(--after-duration,3s)_infinite_linear_alternate-reverse]'
]

const computedClasses = computed(() => {
  const classes = [...baseClasses]

  if (props.enableOnHover) {
    classes.push(...hoverOnlyClasses)
  } else {
    classes.push(...normalGlitchClasses)
  }

  if (props.className) {
    classes.push(props.className)
  }

  return classes.join(' ')
})
</script>

<style>
@keyframes animate-glitch {
  0% {
    clip-path: inset(20% 0 50% 0);
  }
  5% {
    clip-path: inset(10% 0 60% 0);
  }
  10% {
    clip-path: inset(15% 0 55% 0);
  }
  15% {
    clip-path: inset(25% 0 35% 0);
  }
  20% {
    clip-path: inset(30% 0 40% 0);
  }
  25% {
    clip-path: inset(40% 0 20% 0);
  }
  30% {
    clip-path: inset(10% 0 60% 0);
  }
  35% {
    clip-path: inset(15% 0 55% 0);
  }
  40% {
    clip-path: inset(25% 0 35% 0);
  }
  45% {
    clip-path: inset(30% 0 40% 0);
  }
  50% {
    clip-path: inset(20% 0 50% 0);
  }
  55% {
    clip-path: inset(10% 0 60% 0);
  }
  60% {
    clip-path: inset(15% 0 55% 0);
  }
  65% {
    clip-path: inset(25% 0 35% 0);
  }
  70% {
    clip-path: inset(30% 0 40% 0);
  }
  75% {
    clip-path: inset(40% 0 20% 0);
  }
  80% {
    clip-path: inset(20% 0 50% 0);
  }
  85% {
    clip-path: inset(10% 0 60% 0);
  }
  90% {
    clip-path: inset(15% 0 55% 0);
  }
  95% {
    clip-path: inset(25% 0 35% 0);
  }
  100% {
    clip-path: inset(30% 0 40% 0);
  }
}
</style>
