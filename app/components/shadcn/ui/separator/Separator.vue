<script setup lang="ts">
import { cn } from '@/lib/utils'
import { Separator, type SeparatorProps } from 'radix-vue'
import { computed, type HTMLAttributes } from 'vue'

const props = defineProps<
  SeparatorProps & { class?: HTMLAttributes['class'], label?: string }
>()

const delegatedProps = computed(() => {
  const { class: _, ...delegated } = props

  return delegated
})
</script>

<template>
  <Separator
    v-bind="delegatedProps"
    :class="
      cn(
        'tw-shrink-0 tw-bg-slate-200 tw-relative dark:tw-bg-slate-800',
        props.orientation === 'vertical' ? 'tw-w-px tw-h-full' : 'tw-h-px tw-w-full',
        props.class,
      )
    "
  >
    <span
      v-if="props.label"
      :class="cn('tw-text-xs tw-text-slate-500 tw-bg-white tw-absolute tw-top-1/2 tw-left-1/2 tw--translate-x-1/2 tw--translate-y-1/2 tw-flex tw-justify-center tw-items-center dark:tw-text-slate-400 dark:tw-bg-slate-950',
                 props.orientation === 'vertical' ? 'tw-w-[1px] tw-px-1 tw-py-2' : 'tw-h-[1px] tw-py-1 tw-px-2',
      )"
    >{{ props.label }}</span>
  </Separator>
</template>
