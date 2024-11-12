<script setup lang="ts">
import { cn } from '@/lib/utils'
import {
  SwitchRoot,
  type SwitchRootEmits,
  type SwitchRootProps,
  SwitchThumb,
  useForwardPropsEmits,
} from 'radix-vue'
import { computed, type HTMLAttributes } from 'vue'

const props = defineProps<SwitchRootProps & { class?: HTMLAttributes['class'] }>()

const emits = defineEmits<SwitchRootEmits>()

const delegatedProps = computed(() => {
  const { class: _, ...delegated } = props

  return delegated
})

const forwarded = useForwardPropsEmits(delegatedProps, emits)
</script>

<template>
  <SwitchRoot
    v-bind="forwarded"
    :class="cn(
      'tw-peer tw-inline-flex tw-h-6 tw-w-11 tw-shrink-0 tw-cursor-pointer tw-items-center tw-rounded-full tw-border-2 tw-border-transparent tw-transition-colors focus-visible:tw-outline-none focus-visible:tw-ring-2 focus-visible:tw-ring-slate-950 focus-visible:tw-ring-offset-2 focus-visible:tw-ring-offset-white disabled:tw-cursor-not-allowed disabled:tw-opacity-50 data-[state=checked]:tw-bg-slate-900 data-[state=unchecked]:tw-bg-slate-200 dark:focus-visible:tw-ring-slate-300 dark:focus-visible:tw-ring-offset-slate-950 dark:data-[state=checked]:tw-bg-slate-50 dark:data-[state=unchecked]:tw-bg-slate-800',
      props.class,
    )"
  >
    <SwitchThumb
      :class="cn('tw-pointer-events-none tw-block tw-h-5 tw-w-5 tw-rounded-full tw-bg-white tw-shadow-lg tw-ring-0 tw-transition-transform data-[state=checked]:tw-translate-x-5 dark:tw-bg-slate-950')"
    >
      <slot name="thumb" />
    </SwitchThumb>
  </SwitchRoot>
</template>
