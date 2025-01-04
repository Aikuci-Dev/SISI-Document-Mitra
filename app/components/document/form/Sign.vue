<script setup lang="ts">
import { z } from 'zod';

export type SignEmits = {
  sign: [];
};
const emits = defineEmits<SignEmits>();

const signValue = defineModel<string>();

const schema = z.object({
  file: z.string().optional(),
});

function handleSubmit() {
  emits('sign');
};
</script>

<template>
  <ShadcnTabs
    default-value="file"
  >
    <ShadcnTabsList class="grid w-full grid-cols-2">
      <ShadcnTabsTrigger value="file">
        File
      </ShadcnTabsTrigger>
      <ShadcnTabsTrigger value="canvas">
        Canvas
      </ShadcnTabsTrigger>
    </ShadcnTabsList>
    <ShadcnTabsContent value="file">
      <ShadcnAutoForm
        :schema
        @submit="handleSubmit"
      >
        <template #file="slotProps">
          <ShadcnAutoFormFieldFile
            v-model="signValue"
            v-bind="slotProps"
          />
        </template>

        <div class="mt-2 flex justify-end">
          <ShadcnButton type="submit">
            Save
          </ShadcnButton>
        </div>
      </ShadcnAutoForm>
    </ShadcnTabsContent>
    <ShadcnTabsContent value="canvas">
      <BaseInputSign
        v-model:url="signValue"
        @save="handleSubmit"
      />
    </ShadcnTabsContent>
  </ShadcnTabs>
</template>
