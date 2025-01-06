<script setup lang="ts">
import type { EmployeeInfo } from '~~/shared/types/schema/document';

defineProps<{ employee: EmployeeInfo }>();
</script>

<template>
  <DocumentContentSectionParticipant :employee>
    <template #supervisor-name="{ value }">
      {{ value }}
    </template>
    <template #supervisor-role="{ value }">
      {{ value }}
    </template>
    <template #employee-name="{ value }">
      {{ value }}
    </template>
    <template #employee-role="{ value }">
      {{ value }}
    </template>
  </DocumentContentSectionParticipant>
</template>
