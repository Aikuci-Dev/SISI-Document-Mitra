<script lang="ts" setup>
import { buttonVariants } from '@/components/shadcn/ui/button'
import { cn } from '@/lib/utils'
import { CalendarCellTrigger, type CalendarCellTriggerProps, useForwardProps } from 'radix-vue'
import { computed, type HTMLAttributes } from 'vue'

const props = defineProps<CalendarCellTriggerProps & { class?: HTMLAttributes['class'] }>()

const delegatedProps = computed(() => {
  const { class: _, ...delegated } = props

  return delegated
})

const forwardedProps = useForwardProps(delegatedProps)
</script>

<template>
  <CalendarCellTrigger
    :class="cn(
      buttonVariants({ variant: 'ghost' }),
      'tw-h-9 tw-w-9 tw-p-0 tw-font-normal',
      '[&[data-today]:not([data-selected])]:tw-bg-slate-100 [&[data-today]:not([data-selected])]:tw-text-slate-900 dark:[&[data-today]:not([data-selected])]:tw-bg-slate-800 dark:[&[data-today]:not([data-selected])]:tw-text-slate-50',
      // Selected
      'data-[selected]:tw-bg-slate-900 data-[selected]:tw-text-slate-50 data-[selected]:tw-opacity-100 data-[selected]:hover:tw-bg-slate-900 data-[selected]:hover:tw-text-slate-50 data-[selected]:focus:tw-bg-slate-900 data-[selected]:focus:tw-text-slate-50 dark:data-[selected]:tw-bg-slate-50 dark:data-[selected]:tw-text-slate-900 dark:data-[selected]:hover:tw-bg-slate-50 dark:data-[selected]:hover:tw-text-slate-900 dark:data-[selected]:focus:tw-bg-slate-50 dark:data-[selected]:focus:tw-text-slate-900',
      // Disabled
      'data-[disabled]:tw-text-slate-500 data-[disabled]:tw-opacity-50 dark:data-[disabled]:tw-text-slate-400',
      // Unavailable
      'data-[unavailable]:tw-text-slate-50 data-[unavailable]:tw-line-through dark:data-[unavailable]:tw-text-slate-50',
      // Outside months
      'data-[outside-view]:tw-text-slate-500 data-[outside-view]:tw-opacity-50 [&[data-outside-view][data-selected]]:tw-bg-slate-100/50 [&[data-outside-view][data-selected]]:tw-text-slate-500 [&[data-outside-view][data-selected]]:tw-opacity-30 dark:data-[outside-view]:tw-text-slate-400 dark:[&[data-outside-view][data-selected]]:tw-bg-slate-800/50 dark:[&[data-outside-view][data-selected]]:tw-text-slate-400',
      props.class,
    )"
    v-bind="forwardedProps"
  >
    <slot />
  </CalendarCellTrigger>
</template>
