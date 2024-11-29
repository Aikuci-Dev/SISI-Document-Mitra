<script setup lang="ts">
import type { EmployeeInfo } from '~~/types/document';

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
      :sign-pad="{ height: '140px', width: '140px' }"
    />
    <BaseSign
      v-model:url="employeeSignURL"
      class="basis-1/2"
      :sign="{
        name: employee.name,
        role: employee.role,
        alias: 'PIHAK KEDUA',
        company: '&nbsp;',
      }"
      :sign-pad="{ height: '140px', width: '140px' }"
    />
  </div>
</template>
