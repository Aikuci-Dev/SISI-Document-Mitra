<script lang="ts" setup>
import type { HTMLAttributes } from "vue";
import { cn } from "@/lib/utils";
import { MoreHorizontal } from "lucide-vue-next";

const props = defineProps<{
  class?: HTMLAttributes["class"];
}>();
</script>

<template>
  <span
    role="presentation"
    aria-hidden="true"
    :class="
      cn('tw-flex tw-h-9 tw-w-9 tw-items-center tw-justify-center', props.class)
    "
  >
    <slot>
      <MoreHorizontal class="tw-h-4 tw-w-4" />
    </slot>
    <span class="tw-sr-only">More</span>
  </span>
</template>
