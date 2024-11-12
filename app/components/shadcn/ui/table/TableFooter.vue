<script setup lang="ts">
import type { HTMLAttributes } from 'vue'
import { cn } from '@/lib/utils'

const props = defineProps<{
  class?: HTMLAttributes['class']
}>()
</script>

<template>
  <tfoot :class="cn('tw-border-t tw-bg-slate-100/50 tw-font-medium [&>tr]:last:tw-border-b-0 dark:tw-bg-slate-800/50', props.class)">
    <slot />
  </tfoot>
</template>
