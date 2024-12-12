<script setup lang="ts">
import { highlightLevel } from '~/components/base/field/const';
import type { EmployeeInfo } from '~~/types/schema/document';

defineProps<{ original: EmployeeInfo; employee: EmployeeInfo }>();
</script>

<template>
  <DocumentContentSectionSign :employee>
    <template #supervisor-name="{ value }">
      <BaseFieldHighlight
        :value
        :class="[highlightLevel(original.supervisorName, employee.supervisorName)]"
      />
    </template>
    <template #supervisor-role="{ value }">
      <BaseFieldHighlight
        :value
        :class="[highlightLevel(original.supervisorRole, employee.supervisorRole)]"
      />
    </template>
    <template #employee-name="{ value }">
      <BaseFieldHighlight
        :value
        :class="[highlightLevel(original.employeeName, employee.employeeName)]"
      />
    </template>
    <template #employee-role="{ value }">
      <BaseFieldHighlight
        :value
        :class="[highlightLevel(original.employeeRole, employee.employeeRole)]"
      />
    </template>
  </DocumentContentSectionSign>
</template>
