<script setup lang="ts">
import type { EmployeeInfo } from '~~/types/document';

interface Props {
  employee: EmployeeInfo;
}

defineProps<Props>();
</script>

<template>
  <div
    class="tw-flex tw-justify-around tw-text-center tw-font-bold"
  >
    <BaseSign
      class="tw-basis-1/2"
      :sign="{
        name: employee.supervisor.name,
        role: 'Project Manager',
        alias: 'PIHAK PERTAMA',
        company: 'PT. Sinergi Informatika Semen Indonesia',
      }"
    />
    <BaseSign
      class="tw-basis-1/2"
      :sign="{
        name: employee.name,
        role: employee.role,
        alias: 'PIHAK KEDUA',
        company: '&nbsp;',
      }"
    />
  </div>
</template>
