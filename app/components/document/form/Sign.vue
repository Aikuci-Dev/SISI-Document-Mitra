<script setup lang="ts">
import { useVModel } from '@vueuse/core';
import { z } from 'zod';

export type SignProps = {
  modelValue: string;
};
const props = defineProps<SignProps>();
export type SignEmits = {
  'update:modelValue': [value: string];
  'sign': [];
};
const emits = defineEmits<SignEmits>();

const signValue = useVModel(props, 'modelValue', emits);

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
