<script setup lang="ts">
import type { HTMLAttributes } from 'vue'
import { cn } from '@/lib/utils'

const props = defineProps<{
  class?: HTMLAttributes['class']
}>()
</script>

<template>
  <tr :class="cn('tw-border-b tw-transition-colors hover:tw-bg-slate-100/50 data-[state=selected]:tw-bg-slate-100 dark:hover:tw-bg-slate-800/50 dark:data-[state=selected]:tw-bg-slate-800', props.class)">
    <slot />
  </tr>
</template>
