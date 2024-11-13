<script setup lang="ts">
import { cn } from "@/lib/utils";
import { Separator, type SeparatorProps } from "radix-vue";
import { computed, type HTMLAttributes } from "vue";

const props = defineProps<
  SeparatorProps & { class?: HTMLAttributes["class"]; label?: string }
>();

const delegatedProps = computed(() => {
  const { class: _, ...delegated } = props;

  return delegated;
});
</script>

<template>
  <Separator
    v-bind="delegatedProps"
    :class="
      cn(
        'tw-relative tw-shrink-0 tw-bg-slate-200 dark:tw-bg-slate-800',
        props.orientation === 'vertical'
          ? 'tw-h-full tw-w-px'
          : 'tw-h-px tw-w-full',
        props.class,
      )
    "
  >
    <span
      v-if="props.label"
      :class="
        cn(
          'tw-absolute tw-left-1/2 tw-top-1/2 tw-flex tw--translate-x-1/2 tw--translate-y-1/2 tw-items-center tw-justify-center tw-bg-white tw-text-xs tw-text-slate-500 dark:tw-bg-slate-950 dark:tw-text-slate-400',
          props.orientation === 'vertical'
            ? 'tw-w-[1px] tw-px-1 tw-py-2'
            : 'tw-h-[1px] tw-px-2 tw-py-1',
        )
      "
      >{{ props.label }}</span
    >
  </Separator>
</template>
