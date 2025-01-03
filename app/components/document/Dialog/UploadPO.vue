<script setup lang="ts">
import { z } from 'zod';

type Emits = {
  submit: [];
};
defineEmits<Emits>();

const file = defineModel<string>();

const schema = z.object({
  file: z.string(),
});
</script>

<template>
  <ShadcnDialog>
    <ShadcnDialogContent class="sm:max-w-[425px]">
      <ShadcnDialogTitle>Upload Your PO</ShadcnDialogTitle>
      <ShadcnDialogDescription>
        Take a screenshot of your PO and upload it here to automatically fill out the form and generate your document.
      </ShadcnDialogDescription>

      <ShadcnAutoForm
        :schema
        @submit="$emit('submit')"
      >
        <template #file="slotProps">
          <ShadcnAutoFormFieldFile
            v-model="file"
            v-bind="slotProps"
          />
        </template>

        <div class="mt-2 flex justify-end">
          <ShadcnButton
            class="w-full"
            type="submit"
          >
            Generate
          </ShadcnButton>
        </div>
      </ShadcnAutoForm>
    </ShadcnDialogContent>
  </ShadcnDialog>
</template>
