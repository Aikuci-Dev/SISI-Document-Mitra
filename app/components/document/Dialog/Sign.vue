<script setup lang="ts">
import { useForwardPropsEmits } from 'radix-vue';
import type { SignEmits } from '@/components/document/form/Sign.vue';

const props = defineProps<{ modelValue: string }>();
const emits = defineEmits<SignEmits & { 'update:modelValue': [value: string] }>();
const forwarded = useForwardPropsEmits(props, emits);
</script>

<template>
  <ShadcnDialog>
    <ShadcnDialogContent class="sm:max-w-[425px]">
      <ShadcnDialogHeader>
        <ShadcnDialogTitle>Please sign the document</ShadcnDialogTitle>
        <ShadcnDialogDescription>
          Upload your signature (as an image) or draw it directly on the canvas.
        </ShadcnDialogDescription>
      </ShadcnDialogHeader>

      <DocumentFormSign v-bind="forwarded" />
    </ShadcnDialogContent>
  </ShadcnDialog>
</template>
