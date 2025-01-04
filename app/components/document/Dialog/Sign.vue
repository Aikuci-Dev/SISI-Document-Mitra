<script setup lang="ts">
import { useForwardPropsEmits } from 'radix-vue';
import type { SignEmits, SignProps } from '@/components/document/form/Sign.vue';

const props = defineProps<SignProps>();
const emits = defineEmits<SignEmits>();
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
