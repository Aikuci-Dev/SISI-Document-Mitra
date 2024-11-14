<script setup lang="ts">
import type { HTMLAttributes } from "vue";
import { cn } from "@/lib/utils";

const props = defineProps<{
  class?: HTMLAttributes["class"];
}>();
</script>

<template>
  <p
    :class="
      cn('tw-text-sm tw-text-slate-500 dark:tw-text-slate-400', props.class)
    "
  >
    <slot />
  </p>
</template>
