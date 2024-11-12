<script setup lang="ts">
import type { CheckboxRootEmits, CheckboxRootProps } from 'radix-vue'
import { cn } from '@/lib/utils'
import { Check } from 'lucide-vue-next'
import { CheckboxIndicator, CheckboxRoot, useForwardPropsEmits } from 'radix-vue'
import { computed, type HTMLAttributes } from 'vue'

const props = defineProps<CheckboxRootProps & { class?: HTMLAttributes['class'] }>()
const emits = defineEmits<CheckboxRootEmits>()

const delegatedProps = computed(() => {
  const { class: _, ...delegated } = props

  return delegated
})

const forwarded = useForwardPropsEmits(delegatedProps, emits)
</script>

<template>
  <CheckboxRoot
    v-bind="forwarded"
    :class="
      cn('tw-peer tw-h-4 tw-w-4 tw-shrink-0 tw-rounded-sm tw-border tw-border-slate-200 tw-border-slate-900 tw-ring-offset-white focus-visible:tw-outline-none focus-visible:tw-ring-2 focus-visible:tw-ring-slate-950 focus-visible:tw-ring-offset-2 disabled:tw-cursor-not-allowed disabled:tw-opacity-50 data-[state=checked]:tw-bg-slate-900 data-[state=checked]:tw-text-slate-50 dark:tw-border-slate-800 dark:tw-border-slate-50 dark:tw-ring-offset-slate-950 dark:focus-visible:tw-ring-slate-300 dark:data-[state=checked]:tw-bg-slate-50 dark:data-[state=checked]:tw-text-slate-900',
         props.class)"
  >
    <CheckboxIndicator class="tw-flex tw-h-full tw-w-full tw-items-center tw-justify-center tw-text-current">
      <slot>
        <Check class="tw-h-4 tw-w-4" />
      </slot>
    </CheckboxIndicator>
  </CheckboxRoot>
</template>
