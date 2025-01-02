<script setup lang="ts"  generic="T extends ZodRawShape">
import type { ZodObject, ZodRawShape } from 'zod';
import type { Shape } from '@/components/shadcn/ui/auto-form/interface';
import type { WorkDocument } from '~~/types/schema/document';
import type { Item } from '~/components/base/input/InputCombobox.vue';

const props = withDefaults(defineProps<{
  fieldName: string;
  shape: Shape;
  isDisabledInput?: boolean;
  showNonEditableFields?: boolean;
  items?: Record<'nominal', Item[]>;
}>(), { showNonEditableFields: true, items: () => ({ nominal: [] as Item[] }) });

const formValue = defineModel<WorkDocument>();

const delegatedProps = computed(() => {
  if (props.shape?.type === 'ZodObject')
    return { schema: props.shape?.schema as unknown as ZodObject<T> };
  return undefined;
});
</script>

<template>
  <BaseInputAutoFormFieldObject
    v-if="formValue"
    :field-name
    v-bind="delegatedProps"
  >
    <template #po="slotProps">
      <ShadcnAutoFormFieldInput
        v-model="formValue.poNumber"
        v-bind="slotProps"
        label="PO"
        disabled
        required
        :class="{ hidden: !showNonEditableFields }"
      />
    </template>
    <template #bapp="slotProps">
      <ShadcnAutoFormFieldInput
        v-model="formValue.bappNumber"
        v-bind="slotProps"
        label="BAPP"
        disabled
        required
        :class="{ hidden: !showNonEditableFields }"
      />
    </template>
    <template #invoice="slotProps">
      <ShadcnAutoFormFieldInput
        v-model="formValue.invoiceNumber"
        v-bind="slotProps"
        label="Invoice"
        disabled
        required
        :class="{ hidden: !showNonEditableFields }"
      />
    </template>
    <template #invoiceNominal="slotProps">
      <!-- TODO: Masking using `maska` -->
      <BaseInputCombobox
        v-bind="slotProps"
        :items="items.nominal"
        label="Invoice Nominal"
        placeholder="0"
        :disabled="isDisabledInput"
        required
        :class="{ 'col-span-2': !showNonEditableFields }"
      />
    </template>
    <template #bast="slotProps">
      <ShadcnAutoFormFieldInput
        v-if="formValue.bastNumber?.length"
        v-model="formValue.bastNumber"
        v-bind="slotProps"
        label="BAST"
        disabled
        :class="{ hidden: !showNonEditableFields }"
      />
      <span v-else />
    </template>
  </BaseInputAutoFormFieldObject>
</template>
