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
        :class="[highlightLevel(original.supervisor.name, employee.supervisor.name)]"
      />
    </template>
    <template #supervisor-role="{ value }">
      <BaseFieldHighlight
        :value
        :class="[highlightLevel(original.supervisor.role, employee.supervisor.role)]"
      />
    </template>
    <template #employee-name="{ value }">
      <BaseFieldHighlight
        :value
        :class="[highlightLevel(original.name, employee.name)]"
      />
    </template>
    <template #employee-role="{ value }">
      <BaseFieldHighlight
        :value
        :class="[highlightLevel(original.role, employee.role)]"
      />
    </template>
  </DocumentContentSectionSign>
</template>
