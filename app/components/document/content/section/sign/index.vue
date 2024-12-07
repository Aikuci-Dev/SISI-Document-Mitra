<script setup lang="ts">
import type { EmployeeInfo } from '~~/types/schema/document';

const props = defineProps<{ employee: EmployeeInfo }>();

const employeeSignURL = computed(() => props.employee.sign.url);
const supervisorSignURL = computed(() => props.employee.supervisor.sign.url);
</script>

<template>
  <div
    class="flex justify-around text-center font-bold"
  >
    <BaseSign
      v-model:url="supervisorSignURL"
      class="basis-1/2"
      :sign="{
        name: employee.supervisor.name,
        role: employee.supervisor.role,
        alias: 'PIHAK PERTAMA',
        company: 'PT. Sinergi Informatika Semen Indonesia',
      }"
      :sign-pad="{ height: '100px', width: '100px' }"
    >
      <template #alias="{ value }">
        <slot
          name="supervisor-alias"
          :value
        >
          {{ value }}
        </slot>
      </template>
      <template #company="{ value }">
        <slot
          name="supervisor-company"
          :value
        >
          {{ value }}
        </slot>
      </template>
      <template #name="{ value }">
        <slot
          name="supervisor-name"
          :value
        >
          {{ value }}
        </slot>
      </template>
      <template #role="{ value }">
        <slot
          name="supervisor-role"
          :value
        >
          {{ value }}
        </slot>
      </template>
    </BaseSign>
    <BaseSign
      v-model:url="employeeSignURL"
      class="basis-1/2"
      :sign="{
        name: employee.name,
        role: employee.role,
        alias: 'PIHAK KEDUA',
        company: '&nbsp;',
      }"
      :sign-pad="{ height: '100px', width: '100px' }"
    >
      <template #alias="{ value }">
        <slot
          name="employee-alias"
          :value
        >
          {{ value }}
        </slot>
      </template>
      <template #company="{ value }">
        <slot
          name="employee-company"
          :value
        >
          {{ value }}
        </slot>
      </template>
      <template #name="{ value }">
        <slot
          name="employee-name"
          :value
        >
          {{ value }}
        </slot>
      </template>
      <template #role="{ value }">
        <slot
          name="employee-role"
          :value
        >
          {{ value }}
        </slot>
      </template>
    </BaseSign>
  </div>
</template>
