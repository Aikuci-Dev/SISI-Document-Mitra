<script setup lang="ts">
import { cn } from '@/lib/utils'
import { Circle } from 'lucide-vue-next'
import {
  RadioGroupIndicator,
  RadioGroupItem,
  type RadioGroupItemProps,
  useForwardProps,
} from 'radix-vue'
import { computed, type HTMLAttributes } from 'vue'

const props = defineProps<RadioGroupItemProps & { class?: HTMLAttributes['class'] }>()

const delegatedProps = computed(() => {
  const { class: _, ...delegated } = props

  return delegated
})

const forwardedProps = useForwardProps(delegatedProps)
</script>

<template>
  <RadioGroupItem
    v-bind="forwardedProps"
    :class="
      cn(
        'tw-aspect-square tw-h-4 tw-w-4 tw-rounded-full tw-border tw-border-slate-200 tw-border-slate-900 tw-text-slate-900 tw-ring-offset-white focus:tw-outline-none focus-visible:tw-ring-2 focus-visible:tw-ring-slate-950 focus-visible:tw-ring-offset-2 disabled:tw-cursor-not-allowed disabled:tw-opacity-50 dark:tw-border-slate-800 dark:tw-border-slate-50 dark:tw-text-slate-50 dark:tw-ring-offset-slate-950 dark:focus-visible:tw-ring-slate-300',
        props.class,
      )
    "
  >
    <RadioGroupIndicator
      class="tw-flex tw-items-center tw-justify-center"
    >
      <Circle class="tw-h-2.5 tw-w-2.5 tw-fill-current tw-text-current" />
    </RadioGroupIndicator>
  </RadioGroupItem>
</template>
