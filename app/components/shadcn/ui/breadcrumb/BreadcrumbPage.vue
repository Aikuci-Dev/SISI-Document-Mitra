<script lang="ts" setup>
import type { HTMLAttributes } from "vue";
import { cn } from "@/lib/utils";

const props = defineProps<{
  class?: HTMLAttributes["class"];
}>();
</script>

<template>
  <span
    role="link"
    aria-disabled="true"
    aria-current="page"
    :class="
      cn('tw-font-normal tw-text-slate-950 dark:tw-text-slate-50', props.class)
    "
  >
    <slot />
  </span>
</template>
