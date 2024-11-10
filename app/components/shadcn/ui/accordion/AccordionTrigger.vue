<script setup lang="ts">
import { cn } from '@/lib/utils'
import { ChevronDown } from 'lucide-vue-next'
import {
  AccordionHeader,
  AccordionTrigger,
  type AccordionTriggerProps,
} from 'radix-vue'
import { computed, type HTMLAttributes } from 'vue'

const props = defineProps<AccordionTriggerProps & { class?: HTMLAttributes['class'] }>()

const delegatedProps = computed(() => {
  const { class: _, ...delegated } = props

  return delegated
})
</script>

<template>
  <AccordionHeader class="tw-flex">
    <AccordionTrigger
      v-bind="delegatedProps"
      :class="
        cn(
          'tw-flex tw-flex-1 tw-items-center tw-justify-between tw-py-4 tw-font-medium tw-transition-all hover:tw-underline [&[data-state=open]>svg]:tw-rotate-180',
          props.class,
        )
      "
    >
      <slot />
      <slot name="icon">
        <ChevronDown
          class="tw-h-4 tw-w-4 tw-shrink-0 tw-transition-transform tw-duration-200"
        />
      </slot>
    </AccordionTrigger>
  </AccordionHeader>
</template>
