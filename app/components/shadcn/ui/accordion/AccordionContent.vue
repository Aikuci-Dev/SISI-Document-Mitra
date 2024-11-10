<script setup lang="ts">
import { cn } from '@/lib/utils'
import { AccordionContent, type AccordionContentProps } from 'radix-vue'
import { computed, type HTMLAttributes } from 'vue'

const props = defineProps<AccordionContentProps & { class?: HTMLAttributes['class'] }>()

const delegatedProps = computed(() => {
  const { class: _, ...delegated } = props

  return delegated
})
</script>

<template>
  <AccordionContent
    v-bind="delegatedProps"
    class="tw-overflow-hidden tw-text-sm tw-transition-all data-[state=closed]:tw-animate-accordion-up data-[state=open]:tw-animate-accordion-down"
  >
    <div :class="cn('tw-pb-4 tw-pt-0', props.class)">
      <slot />
    </div>
  </AccordionContent>
</template>
