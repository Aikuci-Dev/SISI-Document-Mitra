<script setup lang="ts">
import type { HTMLAttributes } from 'vue'
import { cn } from '@/lib/utils'

const props = defineProps<{
  class?: HTMLAttributes['class']
}>()
</script>

<template>
  <caption :class="cn('tw-mt-4 tw-text-sm tw-text-slate-500 dark:tw-text-slate-400', props.class)">
    <slot />
  </caption>
</template>
