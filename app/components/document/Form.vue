<script setup lang="ts">
import * as z from 'zod';
import { useForm } from 'vee-validate';
import { toTypedSchema } from '@vee-validate/zod';
import { getLocalTimeZone, parseAbsolute } from '@internationalized/date';
import type { WorkDocument } from '~~/types/document';

type FormEmits = {
  generate: [value: { payload: WorkDocument }];
};

const emits = defineEmits<FormEmits>();

const loading = ref(false);

const formValue = defineModel<WorkDocument>();

const dateStartTS = formValue.value?.details.date.ts.start || new Date().getTime();
const dateEndTS = formValue.value?.details.date.ts.end || new Date().getTime();

const schema = z.object({
  title: z.string().min(1, 'Project title is required.'),
  dateStart: z.any().refine(val => val, 'Invalid Date'),
  dateEnd: z.any().refine(val => val, 'Invalid Date'),

  employeeSeparator: z.string().optional(),
  employeeName: z.string().min(1, 'Employee name is required.').describe('Name'), // define with `describe` method
  employeeRole: z.string({ description: 'Role' }).min(1, 'Employee role is required.'), // define using `description` option
  supervisorName: z.string().min(1, 'Supervisor name is required.'), // define using `label` props
  supervisorPhone: z.string({ description: 'Phone Number' }).optional(),

  detail: z.object({
    po: z.string().min(1, 'PO number is required.'),
    bapp: z.string().min(1, 'BAPP number is required.'),
    invoiceNumber: z.string({ description: 'Invoice' }).min(1, 'Invoice number is required.'),
    invoiceNominal: z.number().min(1, 'Invoice nominal is required.').describe('Invoice Nominal'),
    bast: z.string().optional(),
  }),
});
type Form = z.infer<typeof schema>;

const form = useForm({
  validationSchema: toTypedSchema(schema),
  initialValues: {
    title: formValue.value?.details.title,
    dateStart: parseAbsolute(new Date(dateStartTS).toISOString(), getLocalTimeZone()),
    dateEnd: parseAbsolute(new Date(dateEndTS).toISOString(), getLocalTimeZone()),

    employeeName: formValue.value?.employee.name,
    employeeRole: formValue.value?.employee.role,
    supervisorName: formValue.value?.employee.supervisor.name,
    supervisorPhone: formValue.value?.employee.supervisor.phone?.toString(),

    detail: {
      po: formValue.value?.po.number,
      bapp: formValue.value?.bapp.number,
      invoiceNumber: formValue.value?.invoice.number,
      invoiceNominal: formValue.value?.invoice.nominal,
      bast: formValue.value?.bast?.number,
    },
  },
});

async function onSubmit(values: Form) {
  loading.value = true;

  console.log('values', values);
  if (formValue.value)
    emits('generate', { payload: formValue.value });

  loading.value = false;
}
</script>

<template>
  <ShadcnCard>
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
        @submit="onSubmit"
      >
        <template #title="slotProps">
          <ShadcnAutoFormFieldInput
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
        <template #supervisorName="slotProps">
          <section class="col-span-2 mt-4">
            <ShadcnSeparator
              label="Supervisor"
            />
          </section>
          <ShadcnAutoFormFieldInput
            label="Name"
            v-bind="slotProps"
            required
          />
        </template>

        <template #detail="slotProps">
          <DocumentFormDetail
            v-bind="slotProps"
            class="col-span-2 m-4"
          />
        </template>

        <div class="col-span-2 mt-4 flex justify-end">
          <ShadcnButton
            type="submit"
            :disabled="loading"
          >
            Generate
          </ShadcnButton>
        </div>
      </ShadcnAutoForm>
    </ShadcnCardContent>
  </ShadcnCard>
</template>
