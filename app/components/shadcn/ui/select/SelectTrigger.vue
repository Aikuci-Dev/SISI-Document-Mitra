<script setup lang="ts">
import { cn } from "@/lib/utils";
import { ChevronDown } from "lucide-vue-next";
import {
  SelectIcon,
  SelectTrigger,
  type SelectTriggerProps,
  useForwardProps,
} from "radix-vue";
import { computed, type HTMLAttributes } from "vue";

const props = defineProps<
  SelectTriggerProps & { class?: HTMLAttributes["class"] }
>();

const delegatedProps = computed(() => {
  const { class: _, ...delegated } = props;

  return delegated;
});

const forwardedProps = useForwardProps(delegatedProps);
</script>

<template>
  <SelectTrigger
    v-bind="forwardedProps"
    :class="
      cn(
        'tw-flex tw-h-10 tw-w-full tw-items-center tw-justify-between tw-rounded-md tw-border tw-border-slate-200 tw-bg-white tw-px-3 tw-py-2 tw-text-start tw-text-sm tw-ring-offset-white focus:tw-outline-none focus:tw-ring-2 focus:tw-ring-slate-950 focus:tw-ring-offset-2 disabled:tw-cursor-not-allowed disabled:tw-opacity-50 data-[placeholder]:tw-text-slate-500 dark:tw-border-slate-800 dark:tw-bg-slate-950 dark:tw-ring-offset-slate-950 dark:focus:tw-ring-slate-300 dark:data-[placeholder]:tw-text-slate-400 [&>span]:tw-truncate',
        props.class,
      )
    "
  >
    <slot />
    <SelectIcon as-child>
      <ChevronDown class="tw-h-4 tw-w-4 tw-shrink-0 tw-opacity-50" />
    </SelectIcon>
  </SelectTrigger>
</template>
