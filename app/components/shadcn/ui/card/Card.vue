<script setup lang="ts">
import type { HTMLAttributes } from "vue";
import { cn } from "@/lib/utils";

const props = defineProps<{
  class?: HTMLAttributes["class"];
}>();
</script>

<template>
  <div
    :class="
      cn(
        'tw-rounded-lg tw-border tw-border-slate-200 tw-bg-white tw-text-slate-950 tw-shadow-sm dark:tw-border-slate-800 dark:tw-bg-slate-950 dark:tw-text-slate-50',
        props.class,
      )
    "
  >
    <slot />
  </div>
</template>
