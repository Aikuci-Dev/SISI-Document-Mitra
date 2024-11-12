<script setup lang="ts">
import { FormLabel } from '@/components/shadcn/ui/form'

defineProps<{
  required?: boolean
}>()
</script>

<template>
  <FormLabel>
    <slot />
    <span v-if="required" class="tw-text-red-500 dark:tw-text-red-900"> *</span>
  </FormLabel>
</template>
