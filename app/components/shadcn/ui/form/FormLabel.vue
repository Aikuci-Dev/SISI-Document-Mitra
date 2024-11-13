<script lang="ts" setup>
import type { LabelProps } from "radix-vue";
import type { HTMLAttributes } from "vue";
import { Label } from "@/components/shadcn/ui/label";
import { cn } from "@/lib/utils";
import { useFormField } from "./useFormField";

const props = defineProps<LabelProps & { class?: HTMLAttributes["class"] }>();

const { error, formItemId } = useFormField();
</script>

<template>
  <Label
    :class="cn(error && 'tw-text-red-500 dark:tw-text-red-900', props.class)"
    :for="formItemId"
  >
    <slot />
  </Label>
</template>
