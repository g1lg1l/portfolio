<script setup lang="ts">
import type { ProjectsCollectionItem } from '@nuxt/content'

const props = defineProps<{
  project: ProjectsCollectionItem
}>()

const href = computed(() => props.project.link || props.project.url)
const repoUrl = computed(() =>
  props.project.stars ? `https://github.com/${props.project.stars}` : ''
)
const isRepo = computed(() => href.value === repoUrl.value)
const phone = computed(() => props.project.category === 'iOS')
const shots = computed(() => {
  const list = props.project.screenshots ?? []
  // Offset from the middle shot: drives the fan's spread, tilt and stacking
  return list.map((src, i) => {
    const o = i - (list.length - 1) / 2
    return { src, style: { '--o': o, '--a': Math.abs(o) } }
  })
})
</script>

<template>
  <article :id="project.slug" class="group scroll-mt-24">
    <ULink
      :to="href"
      target="_blank"
      tabindex="-1"
      aria-hidden="true"
      class="stage relative block overflow-hidden rounded-3xl bg-elevated/60 ring ring-default aspect-[4/3] sm:aspect-[2/1]"
      :class="phone ? 'stage-phone' : 'stage-browser'"
    >
      <NuxtImg
        v-for="shot in shots"
        :key="shot.src"
        :src="shot.src"
        alt=""
        :width="phone ? 240 : 680"
        densities="x1 x2"
        format="webp"
        loading="lazy"
        class="shot"
        :style="shot.style"
      />
    </ULink>

    <div
      class="mt-6 flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between"
    >
      <div>
        <div class="flex items-center gap-2 text-sm text-muted">
          <NuxtImg
            v-if="project.logo"
            :src="project.logo"
            alt=""
            width="20"
            height="20"
            densities="x1 x2"
            class="size-5 rounded-md object-contain"
          />
          <Icon
            v-else-if="project.icon"
            :name="project.icon"
            mode="svg"
            class="size-5"
          />
          <h2 class="font-medium text-highlighted">{{ project.title }}</h2>
          <span>{{ new Date(project.date).getFullYear() }}</span>
          <span
            v-if="project.ongoing"
            class="flex items-center gap-1.5 text-success"
          >
            <span class="size-1.5 rounded-full bg-success" />
            Active
          </span>
        </div>
        <p
          class="mt-3 font-serif text-3xl sm:text-4xl leading-tight text-highlighted text-pretty"
        >
          {{ project.tagline || project.title }}
        </p>
        <p class="mt-3 max-w-prose text-muted text-pretty">
          {{ project.description }}
        </p>
        <div class="mt-4 flex flex-wrap gap-1">
          <UBadge
            v-for="tag in project.tags"
            :key="tag"
            :label="tag"
            color="neutral"
            variant="outline"
            size="sm"
          />
        </div>
      </div>

      <div class="flex shrink-0 gap-2">
        <UButton
          :to="href"
          target="_blank"
          color="neutral"
          :icon="isRepo ? 'i-simple-icons-github' : undefined"
          :label="isRepo ? 'View on GitHub' : `Open ${project.title}`"
          trailing-icon="i-lucide-arrow-up-right"
        />
        <UButton
          v-if="repoUrl && !isRepo"
          :to="repoUrl"
          target="_blank"
          color="neutral"
          variant="ghost"
          icon="i-simple-icons-github"
          label="Source"
        />
      </div>
    </div>
  </article>
</template>

<style scoped>
/* Screenshots rise from the bottom edge and fan out from the middle one.
   Hovering or focusing the project spreads the fan with a springy overshoot. */
.shot {
  position: absolute;
  left: 50%;
  bottom: 0;
  width: var(--w);
  max-width: none;
  transform: translate(
      calc(-50% + var(--o) * var(--spread)),
      calc(var(--drop) + var(--a) * var(--sink) + var(--o) * var(--lift))
    )
    rotate(calc(var(--o) * var(--tilt)));
  transition: transform 0.55s cubic-bezier(0.34, 1.56, 0.64, 1);
  transition-delay: calc(var(--a) * 40ms);
  box-shadow: 0 24px 48px -16px rgb(0 0 0 / 0.45);
}

.stage-phone {
  --w: 32%;
  --spread: 62%;
  --tilt: 7deg;
  --drop: 20%;
  --sink: 6%;
  --lift: 0%;
}

.stage-phone .shot {
  z-index: calc(10 - var(--a) * 2);
  border: 4px solid #171717;
  border-radius: 14% / 6.5%;
}

.stage-browser {
  --w: 84%;
  --spread: 22%;
  --tilt: 2deg;
  --drop: 14%;
  --sink: 0%;
  --lift: 16%;
}

.stage-browser .shot {
  border-radius: 0.75rem;
  border: 1px solid var(--ui-border-accented);
}

@media (min-width: 640px) {
  .stage-phone {
    --w: 24%;
  }

  .stage-browser {
    --w: 70%;
    --drop: 10%;
  }
}

.group:hover .stage-phone,
.group:focus-within .stage-phone {
  --spread: 86%;
  --tilt: 11deg;
  --drop: 14%;
  --sink: 4%;
}

.group:hover .stage-browser,
.group:focus-within .stage-browser {
  --spread: 30%;
  --tilt: 3.5deg;
  --drop: 8%;
  --lift: 22%;
}

@media (prefers-reduced-motion: reduce) {
  .shot {
    transition: none;
  }
}
</style>
