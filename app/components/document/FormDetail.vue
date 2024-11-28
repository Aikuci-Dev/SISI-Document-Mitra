<script setup lang="ts"  generic="T extends ZodRawShape">
import type { ZodObject, ZodRawShape } from 'zod';
import type { Shape } from '~/components/shadcn/ui/auto-form/interface';
import type { WorkDocument } from '~~/types/document';

const props = defineProps<{
  fieldName: string;
  shape: Shape;
}>();

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
        :field-name="fieldName"
        v-bind="delegatedProps"
      >
        <template #po="slotProps">
          <ShadcnAutoFormFieldInput
            v-model="formValue.po.number"
            v-bind="slotProps"
            label="PO"
            required
          />
        </template>
        <template #bapp="slotProps">
          <ShadcnAutoFormFieldInput
            v-model="formValue.bapp.number"
            v-bind="slotProps"
            label="BAPP"
            required
          />
        </template>
        <template #invoice="slotProps">
          <ShadcnAutoFormFieldInput
            v-model="formValue.invoice.number"
            v-bind="slotProps"
            label="Invoice"
            required
          />
        </template>
        <template #invoiceNominal="slotProps">
          <ShadcnAutoFormFieldInput
            v-bind="slotProps"
            label="Invoice Nominal"
            required
          />
        </template>
        <template
          v-if="formValue.bast"
          #bast="slotProps"
        >
          <ShadcnAutoFormFieldInput
            v-model="formValue.bast.number"
            v-bind="slotProps"
            label="BAST"
          />
        </template>
      </BaseInputAutoFormFieldObject>
    </ShadcnCardContent>
  </ShadcnCard>
</template>
