<script lang="ts" setup>
import type { HTMLAttributes } from "vue";
import { cn } from "@/lib/utils";

const props = defineProps<{
  class?: HTMLAttributes["class"];
}>();
</script>

<template>
  <li :class="cn('tw-inline-flex tw-items-center tw-gap-1.5', props.class)">
    <slot />
  </li>
</template>
