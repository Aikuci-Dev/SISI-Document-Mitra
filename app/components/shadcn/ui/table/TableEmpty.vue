<script setup lang="ts">
import { cn } from "@/lib/utils";
import { computed, type HTMLAttributes } from "vue";
import TableCell from "./TableCell.vue";
import TableRow from "./TableRow.vue";

const props = withDefaults(
  defineProps<{
    class?: HTMLAttributes["class"];
    colspan?: number;
  }>(),
  {
    colspan: 1,
  },
);

const delegatedProps = computed(() => {
  const { class: _, ...delegated } = props;

  return delegated;
});
</script>

<template>
  <TableRow>
    <TableCell
      :class="
        cn(
          'tw-whitespace-nowrap tw-p-4 tw-align-middle tw-text-sm tw-text-slate-950 dark:tw-text-slate-50',
          props.class,
        )
      "
      v-bind="delegatedProps"
    >
      <div class="tw-flex tw-items-center tw-justify-center tw-py-10">
        <slot />
      </div>
    </TableCell>
  </TableRow>
</template>
