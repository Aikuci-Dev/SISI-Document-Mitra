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
        'tw-aspect-square tw-h-4 tw-w-4 tw-rounded-full tw-border tw-border-primary tw-text-primary tw-ring-offset-background focus:tw-outline-none focus-visible:tw-ring-2 focus-visible:tw-ring-ring focus-visible:tw-ring-offset-2 disabled:tw-cursor-not-allowed disabled:tw-opacity-50',
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
