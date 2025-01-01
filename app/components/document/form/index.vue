<script setup lang="ts">
import { z } from 'zod';
import { useForm } from 'vee-validate';
import { toTypedSchema } from '@vee-validate/zod';
import { getLocalTimeZone, parseAbsolute, type CalendarDate } from '@internationalized/date';
import { Eye } from 'lucide-vue-next';
import type { WorkDocument } from '~~/types/schema/document';

type FormEmits = {
  generate: [];
};
const emits = defineEmits<FormEmits>();

defineProps<{
  isDisabledAction?: boolean;
  isDisabledInput?: boolean;
}>();

const formValue = defineModel<WorkDocument>();
const showNonEditableFields = defineModel<boolean>('showNonEditableFields', { default: true });

const dateStartTS = formValue.value?.detailsDateTsStart || new Date().getTime();
const dateEndTS = formValue.value?.detailsDateTsEnd || new Date().getTime();

const invoiceNominal = ref(String(formValue.value?.invoiceNominal) || '0');

const schema = z.object({
  number: z.string().min(1, 'Project number is required.'),
  title: z.string().min(1, 'Project title is required.'),
  dateStart: z.any().refine(val => val, 'Invalid Date'),
  dateEnd: z.any().refine(val => val, 'Invalid Date'),

  employeeSeparator: z.string().optional(),
  employeeName: z.string().min(1, 'Employee name is required.'),
  employeeRole: z.string().min(1, 'Employee role is required.'),
  supervisorName: z.string().min(1, 'Supervisor name is required.'),
  supervisorRole: z.string().min(1, 'Supervisor role is required.'),

  detail: z.object({
    po: z.string().min(1, 'PO number is required.'),
    bapp: z.string().min(1, 'BAPP number is required.'),
    invoice: z.string().min(1, 'Invoice number is required.'),
    invoiceNominal: z.string().min(1, 'Invoice nominal is required.').refine(val => +val.replace(/\D+/g, '') > 0, 'Invoice nominal is required.'),
    bast: z.string().optional(),
  }),
});
const form = useForm({
  validationSchema: toTypedSchema(schema),
  initialValues: {
    dateStart: parseAbsolute(new Date(dateStartTS).toISOString(), getLocalTimeZone()),
    dateEnd: parseAbsolute(new Date(dateEndTS).toISOString(), getLocalTimeZone()),
  },
  validateOnMount: true,
});
const isFormValid = computed(() => form.meta.value.valid);

watch(() => form.values.dateStart, (date: CalendarDate | undefined) => {
  if (date) {
    const dateValue = date.toDate(getLocalTimeZone());
    formValue.value!.detailsDateTsStart = dateValue.getTime();
    formValue.value!.detailsDateStart = dateValue.toISOString();
  }
});
watch(() => form.values.dateEnd, (date: CalendarDate | undefined) => {
  if (date) {
    const dateValue = date.toDate(getLocalTimeZone());
    formValue.value!.detailsDateTsEnd = dateValue.getTime();
    formValue.value!.detailsDateEnd = dateValue.toISOString();
  }
});
watch(invoiceNominal, (value) => {
  if (value) formValue.value!.invoiceNominal = +value.replace(/\D+/g, '');
});

async function handleSubmit() {
  emits('generate');
}

defineExpose({ form });
</script>

<template>
  <ShadcnCard v-if="formValue">
    <ShadcnCardHeader>
      <ShadcnCardTitle>
        <div class="flex items-center justify-between">
          Document Form
          <ShadcnToggle v-model:pressed="showNonEditableFields">
            <Eye class="size-4" />
          </ShadcnToggle>
        </div>
      </ShadcnCardTitle>
      <ShadcnCardDescription>
        The input used within the document to replace placeholders.
      </ShadcnCardDescription>
    </ShadcnCardHeader>
    <ShadcnCardContent>
      <ShadcnAutoForm
        :schema
        :form
        class="grid grid-cols-2 gap-x-4"
        @submit="handleSubmit"
      >
        <template #number="slotProps">
          <ShadcnAutoFormFieldInput
            v-model="formValue.detailsNumber"
            v-bind="slotProps"
            disabled
            :class="{ hidden: !showNonEditableFields }"
          />
        </template>
        <template #title="slotProps">
          <BaseInputCombobox
            v-model="formValue.detailsTitle"
            v-bind="slotProps"
            :items="[{ label: 'a', value: 'a' }]"
            placeholder="Project Title"
            :disabled="isDisabledInput"
            :class="{ 'col-span-2': !showNonEditableFields }"
          />
        </template>
        <template #dateStart="slotProps">
          <BaseInputAutoFormFieldDate
            v-bind="slotProps"
            label="Start Date (per period)"
            disabled
            required
            :class="{ hidden: !showNonEditableFields }"
          />
        </template>
        <template #dateEnd="slotProps">
          <BaseInputAutoFormFieldDate
            v-bind="slotProps"
            label="End Date (per period)"
            disabled
            required
            :class="{ hidden: !showNonEditableFields }"
          />
        </template>

        <template #employeeSeparator>
          <section
            class="col-span-2 mt-4"
            :class="{ hidden: !showNonEditableFields }"
          >
            <ShadcnSeparator />
            <ShadcnLabel>
              <span>Employee Info</span>
            </ShadcnLabel>
          </section>
        </template>
        <template #employeeName="slotProps">
          <ShadcnAutoFormFieldInput
            v-model="formValue.employeeName"
            v-bind="slotProps"
            label="Name"
            disabled
            required
            :class="{ hidden: !showNonEditableFields }"
          />
        </template>
        <template #employeeRole="slotProps">
          <ShadcnAutoFormFieldInput
            v-model="formValue.employeeRole"
            v-bind="slotProps"
            label="Role"
            disabled
            required
            :class="{ hidden: !showNonEditableFields }"
          />
        </template>
        <template #supervisorName="slotProps">
          <section class="col-span-2 mt-4">
            <ShadcnSeparator
              label="Supervisor"
              :class="{ hidden: !showNonEditableFields }"
            />
          </section>
          <ShadcnAutoFormFieldInput
            v-model="formValue.supervisorName"
            v-bind="slotProps"
            label="Name"
            disabled
            required
            :class="{ hidden: !showNonEditableFields }"
          />
        </template>
        <template #supervisorRole="slotProps">
          <ShadcnAutoFormFieldInput
            v-model="formValue.supervisorRole"
            v-bind="slotProps"
            label="Role"
            disabled
            required
            :class="{ hidden: !showNonEditableFields }"
          />
        </template>

        <template #detail="slotProps">
          <template v-if="showNonEditableFields">
            <DocumentFormDetailWrapper class="col-span-2 m-4">
              <DocumentFormDetail
                v-model="formValue"
                :show-non-editable-fields
                v-bind="slotProps"
                :is-disabled-input
              />
            </DocumentFormDetailWrapper>
          </template>
          <div
            v-else
            class="col-span-2 p-0"
          >
            <DocumentFormDetail
              v-model="formValue"
              v-model:invoice-nominal="invoiceNominal"
              :show-non-editable-fields
              v-bind="slotProps"
              :is-disabled-input
            />
          </div>
        </template>

        <div class="col-span-2 mt-4 flex justify-end">
          <ShadcnButton
            type="submit"
            :disabled="isDisabledAction || !isFormValid"
          >
            Generate
          </ShadcnButton>
        </div>
      </ShadcnAutoForm>
    </ShadcnCardContent>
  </ShadcnCard>
</template>
