<script setup lang="ts">
import { cn } from '@/lib/utils'
import { ChevronUp } from 'lucide-vue-next'
import { SelectScrollUpButton, type SelectScrollUpButtonProps, useForwardProps } from 'radix-vue'
import { computed, type HTMLAttributes } from 'vue'

const props = defineProps<SelectScrollUpButtonProps & { class?: HTMLAttributes['class'] }>()

const delegatedProps = computed(() => {
  const { class: _, ...delegated } = props

  return delegated
})

const forwardedProps = useForwardProps(delegatedProps)
</script>

<template>
  <SelectScrollUpButton v-bind="forwardedProps" :class="cn('tw-flex tw-cursor-default tw-items-center tw-justify-center tw-py-1', props.class)">
    <slot>
      <ChevronUp class="tw-h-4 tw-w-4" />
    </slot>
  </SelectScrollUpButton>
</template>
