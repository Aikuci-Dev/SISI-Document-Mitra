<script setup lang="ts">
import type { EmployeeInfo } from '~~/types/document';

interface Props {
  employee: EmployeeInfo;
}

defineProps<Props>();
</script>

<template>
  <div
    class="flex justify-around text-center font-bold"
  >
    <BaseSign
      class="basis-1/2"
      :sign="{
        name: employee.supervisor.name,
        role: 'Project Manager',
        alias: 'PIHAK PERTAMA',
        company: 'PT. Sinergi Informatika Semen Indonesia',
      }"
    />
    <BaseSign
      class="basis-1/2"
      :sign="{
        name: employee.name,
        role: employee.role,
        alias: 'PIHAK KEDUA',
        company: '&nbsp;',
      }"
    />
  </div>
</template>
