<script setup lang="ts">
import { cn } from "@/lib/utils";
import {
  DropdownMenuItem,
  type DropdownMenuItemProps,
  useForwardProps,
} from "radix-vue";
import { computed, type HTMLAttributes } from "vue";

const props = defineProps<
  DropdownMenuItemProps & { class?: HTMLAttributes["class"]; inset?: boolean }
>();

const delegatedProps = computed(() => {
  const { class: _, ...delegated } = props;

  return delegated;
});

const forwardedProps = useForwardProps(delegatedProps);
</script>

<template>
  <DropdownMenuItem
    v-bind="forwardedProps"
    :class="
      cn(
        'tw- tw-relative tw-flex tw-cursor-default tw-select-none tw-items-center tw-gap-2 tw-rounded-sm tw-px-2 tw-py-1.5 tw-text-sm tw-outline-none tw-transition-colors focus:tw-bg-slate-100 focus:tw-text-slate-900 data-[disabled]:tw-pointer-events-none data-[disabled]:tw-opacity-50 dark:focus:tw-bg-slate-800 dark:focus:tw-text-slate-50 [&>svg]:tw-size-4 [&>svg]:tw-shrink-0',
        inset && 'tw-pl-8',
        props.class,
      )
    "
  >
    <slot />
  </DropdownMenuItem>
</template>
