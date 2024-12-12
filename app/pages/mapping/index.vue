<script setup lang="ts">
import { isDatatable } from '~/lib/utils';

const page = 'Mapping';

const { data } = useFetch('/api/mapping', { params: { format: 'datatable' } });

const columns = computed(() => {
  if (data.value && isDatatable(data.value)) return data.value.columns;
  return [];
});
const rows = computed(() => {
  if (data.value && isDatatable(data.value)) return data.value.rows;
  return [];
});
</script>

<template>
  <div>
    <WidgetBreadcrumb
      :items="[]"
      :page
    />

    <div class="h-screen overflow-y-auto p-10">
      <BaseTable>
        <ShadcnTableHeader>
          <ShadcnTableRow class="divide-y-4 divide-y-reverse">
            <ShadcnTableHead class="w-8">
              No
            </ShadcnTableHead>
            <ShadcnTableHead
              v-for="column in columns"
              :key="column.key"
              class="text-nowrap"
            >
              {{ column.label }}
            </ShadcnTableHead>
          </ShadcnTableRow>
        </ShadcnTableHeader>
        <ShadcnTableBody>
          <ShadcnTableRow
            v-for="(row, indexRow) in rows"
            :key="row.key"
          >
            <ShadcnTableCell class="border-e-4">
              {{ indexRow + 1 }}
            </ShadcnTableCell>
            <ShadcnTableCell
              v-for="(value, index) in row.value"
              :key="`${row.key}-${index}`"
              class="text-nowrap border"
            >
              {{ value }}
            </ShadcnTableCell>
          </ShadcnTableRow>
        </ShadcnTableBody>
      </BaseTable>
    </div>
  </div>
</template>
