<script setup lang="ts"  generic="T extends ZodRawShape">
import type { ZodObject, ZodRawShape } from 'zod';
import type { Shape } from '../shadcn/ui/auto-form/interface';
import type { WorkDocument } from '~~/types/schema/document';

const props = withDefaults(defineProps<{
  fieldName: string;
  shape: Shape;
  showNonEditableFields?: boolean;
  isDisabledInput?: boolean;
}>(), { showNonEditableFields: true });

const formValue = defineModel<WorkDocument>();

const delegatedProps = computed(() => {
  if (props.shape?.type === 'ZodObject')
    return { schema: props.shape?.schema as unknown as ZodObject<T> };
  return undefined;
});
</script>

<template>
  <ShadcnCard>
    <ShadcnCardHeader>
      <ShadcnCardTitle>Details</ShadcnCardTitle>
      <ShadcnCardDescription>
        The transaction details.
      </ShadcnCardDescription>
    </ShadcnCardHeader>
    <ShadcnCardContent>
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
          <ShadcnAutoFormFieldInput
            v-bind="slotProps"
            label="Invoice Nominal"
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
    </ShadcnCardContent>
  </ShadcnCard>
</template>
