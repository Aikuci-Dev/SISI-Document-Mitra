<script setup lang="ts">
import { z } from 'zod';
import { useForm } from 'vee-validate';
import { toTypedSchema } from '@vee-validate/zod';
import { getLocalTimeZone, parseAbsolute, type CalendarDate } from '@internationalized/date';
import type { WorkDocument } from '~~/types/schema/document';

type FormEmits = {
  generate: [];
};
const emits = defineEmits<FormEmits>();

defineProps<{
  isDisabledAction?: boolean;
}>();

const formValue = defineModel<WorkDocument>();

const dateStartTS = formValue.value?.details.date.ts.start || new Date().getTime();
const dateEndTS = formValue.value?.details.date.ts.end || new Date().getTime();

const schema = z.object({
  title: z.string().min(1, 'Project title is required.'),
  dateStart: z.any().refine(val => val, 'Invalid Date'),
  dateEnd: z.any().refine(val => val, 'Invalid Date'),

  employeeSeparator: z.string().optional(),
  employeeName: z.string().min(1, 'Employee name is required.'),
  employeeRole: z.string().min(1, 'Employee role is required.'),
  supervisorName: z.string().min(1, 'Supervisor name is required.'),
  supervisorRole: z.string().min(1, 'Supervisor role is required.'),
  supervisorPhone: z.string().optional(),

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

    supervisorPhone: formValue.value?.employee.supervisor.phone?.toString(),
    detail: {
      invoiceNominal: formValue.value?.invoice.nominal?.toString(),
    },
  },
});

watch(() => form.values.dateStart, (date: CalendarDate | undefined) => {
  if (date) {
    const dateValue = date.toDate(getLocalTimeZone());
    formValue.value!.details.date.ts.start = dateValue.getTime();
    formValue.value!.details.date.date.start = dateValue.toISOString();
  }
});
watch(() => form.values.dateEnd, (date: CalendarDate | undefined) => {
  if (date) {
    const dateValue = date.toDate(getLocalTimeZone());
    formValue.value!.details.date.ts.end = dateValue.getTime();
    formValue.value!.details.date.date.end = dateValue.toISOString();
  }
});
watch(() => form.values.supervisorPhone, (phone) => {
  if (phone) formValue.value!.employee.supervisor.phone = +phone.replace(/\D+/g, '');
});
watch(() => form.values.detail?.invoiceNominal, (invoice) => {
  if (invoice) formValue.value!.invoice.nominal = +invoice.replace(/\D+/g, '');
});

async function handleSubmit() {
  emits('generate');
}
</script>

<template>
  <ShadcnCard v-if="formValue">
    <ShadcnCardHeader>
      <ShadcnCardTitle>Document Form</ShadcnCardTitle>
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
        <template #title="slotProps">
          <ShadcnAutoFormFieldInput
            v-model="formValue.details.title"
            v-bind="slotProps"
            class="col-span-2"
          />
        </template>
        <template #dateStart="slotProps">
          <ShadcnAutoFormFieldDate
            v-bind="slotProps"
            label="Start Date (per period)"
            required
          />
        </template>
        <template #dateEnd="slotProps">
          <ShadcnAutoFormFieldDate
            v-bind="slotProps"
            label="End Date (per period)"
            required
          />
        </template>

        <template #employeeSeparator>
          <section class="col-span-2 mt-4">
            <ShadcnSeparator />
            <ShadcnLabel>
              <span>Employee Info</span>
            </ShadcnLabel>
          </section>
        </template>
        <template #employeeName="slotProps">
          <ShadcnAutoFormFieldInput
            v-model="formValue.employee.name"
            v-bind="slotProps"
            label="Name"
            required
          />
        </template>
        <template #employeeRole="slotProps">
          <ShadcnAutoFormFieldInput
            v-model="formValue.employee.role"
            v-bind="slotProps"
            label="Role"
            required
          />
        </template>
        <template #supervisorName="slotProps">
          <section class="col-span-2 mt-4">
            <ShadcnSeparator
              label="Supervisor"
            />
          </section>
          <ShadcnAutoFormFieldInput
            v-model="formValue.employee.supervisor.name"
            v-bind="slotProps"
            label="Name"
            required
          />
        </template>
        <template #supervisorRole="slotProps">
          <ShadcnAutoFormFieldInput
            v-model="formValue.employee.supervisor.role"
            v-bind="slotProps"
            label="Role"
            required
          />
        </template>
        <template #supervisorPhone="slotProps">
          <!-- TODO: Masking using `maska` -->
          <ShadcnAutoFormFieldInput
            v-bind="slotProps"
            label="Phone"
          />
        </template>

        <template #detail="slotProps">
          <DocumentFormDetail
            v-model="formValue"
            v-bind="slotProps"
            class="col-span-2 m-4"
          />
        </template>

        <div class="col-span-2 mt-4 flex justify-end">
          <ShadcnButton
            type="submit"
            :disabled="isDisabledAction"
          >
            Generate
          </ShadcnButton>
        </div>
      </ShadcnAutoForm>
    </ShadcnCardContent>
  </ShadcnCard>
</template>
