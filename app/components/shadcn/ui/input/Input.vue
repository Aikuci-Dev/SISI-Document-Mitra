<script setup lang="ts">
import type { HTMLAttributes } from 'vue'
import { cn } from '@/lib/utils'
import { useVModel } from '@vueuse/core'

const props = defineProps<{
  defaultValue?: string | number
  modelValue?: string | number
  class?: HTMLAttributes['class']
}>()

const emits = defineEmits<{
  (e: 'update:modelValue', payload: string | number): void
}>()

const modelValue = useVModel(props, 'modelValue', emits, {
  passive: true,
  defaultValue: props.defaultValue,
})
</script>

<template>
  <input v-model="modelValue" :class="cn('tw-flex tw-h-10 tw-w-full tw-rounded-md tw-border tw-border-slate-200 tw-bg-white tw-px-3 tw-py-2 tw-text-sm tw-ring-offset-white file:tw-border-0 file:tw-bg-transparent file:tw-text-sm file:tw-font-medium placeholder:tw-text-slate-500 focus-visible:tw-outline-none focus-visible:tw-ring-2 focus-visible:tw-ring-slate-950 focus-visible:tw-ring-offset-2 disabled:tw-cursor-not-allowed disabled:tw-opacity-50 dark:tw-border-slate-800 dark:tw-bg-slate-950 dark:tw-ring-offset-slate-950 dark:placeholder:tw-text-slate-400 dark:focus-visible:tw-ring-slate-300', props.class)">
</template>
