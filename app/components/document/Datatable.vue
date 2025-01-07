<script setup lang="ts">
import { MoreVertical, MessageCircleWarning } from 'lucide-vue-next';
import { DateFormatter } from '@internationalized/date';
import type { DocumentTable } from '~~/shared/types/document';

type DatatableEmits = {
  createOrView: [{ type: CreateOrView; id: string }];
  autoFill: [{ id: string }];
  print: [{ id: string }];
  formFill: [{ id: string }];
};
defineEmits<DatatableEmits>();

type DatatableProps = DocumentTable & {
  type: DOCUMENTS_TABLE_TYPE;
  user: User;
};
defineProps<DatatableProps>();

const df = new DateFormatter('en-US', { dateStyle: 'long' });
</script>

<template>
  <BaseTable>
    <ShadcnTableHeader>
      <ShadcnTableRow class="sticky top-0 z-10 divide-y-4 divide-y-reverse bg-white">
        <ShadcnTableHead class="sticky left-0 z-20 bg-white" />
        <ShadcnTableHead
          v-if="rows.length"
          class="text-nowrap"
        >
          STATUS
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
      <template v-if="rows.length">
        <ShadcnTableRow
          v-for="row in rows"
          :key="row.key"
        >
          <ShadcnTableCell class="sticky left-0 border-e-4 bg-white">
            <ShadcnDropdownMenu v-if="isStatusNotNilOrDraft(row.meta.status)">
              <ShadcnDropdownMenuTrigger as-child>
                <ShadcnButton
                  variant="ghost"
                  class="size-8 p-0"
                >
                  <MoreVertical class="size-4" />
                </ShadcnButton>
              </ShadcnDropdownMenuTrigger>
              <ShadcnDropdownMenuContent align="end">
                <ShadcnDropdownMenuLabel>DOCUMENT</ShadcnDropdownMenuLabel>

                <template v-if="type === DOCUMENTS_TABLE.employee && isStatusInitiatedOrRejected(row.meta.status)">
                  <ShadcnDropdownMenuItem @click="$emit('createOrView', { type: 'create', id: row.key })">
                    <span v-if="isStatusNotInitiated(row.meta.status)">Revise</span>
                    <span v-else>Create</span>
                  </ShadcnDropdownMenuItem>
                  <ShadcnDropdownMenuItem @click="$emit('autoFill', { id: row.key })">
                    Auto Fill
                  </ShadcnDropdownMenuItem>
                </template>

                <!-- View option -->
                <ShadcnDropdownMenuItem
                  v-if="isStatusNotInitiated(row.meta.status)"
                  @click="$emit('createOrView', { type: 'view', id: row.key })"
                >
                  View
                </ShadcnDropdownMenuItem>

                <!-- Other options for employee type -->
                <template v-if="type === DOCUMENTS_TABLE.employee">
                  <ShadcnDropdownMenuSeparator />
                  <ShadcnDropdownMenuLabel>Others</ShadcnDropdownMenuLabel>
                  <ShadcnDropdownMenuItem
                    v-if="isStatusNotInitiated(row.meta.status)"
                    @click="$emit('print', { id: row.key })"
                  >
                    Print
                  </ShadcnDropdownMenuItem>
                  <ShadcnDropdownMenuItem @click="$emit('formFill', { id: row.key })">
                    Fill Form
                  </ShadcnDropdownMenuItem>
                </template>
              </ShadcnDropdownMenuContent>
            </ShadcnDropdownMenu>
          </ShadcnTableCell>

          <!-- Document Status -->
          <ShadcnTableCell class="flex flex-col space-y-4 text-nowrap text-center">
            <DocumentBadgeStatus :status="row.meta.status" />
          </ShadcnTableCell>

          <!-- Row Values -->
          <ShadcnTableCell
            v-for="(value, index) in row.value"
            :key="`${row.key}-${index}`"
            class="text-nowrap border"
          >
            {{
              columns?.[index]?.meta.type === 'date'
                ? df.format(new Date(+value))
                : value
            }}
          </ShadcnTableCell>
        </ShadcnTableRow>
      </template>

      <!-- No rows available -->
      <ShadcnTableRow v-else>
        <ShadcnTableCell />
        <ShadcnTableCell
          :colspan="columns.length"
          class="h-24 text-center"
        >
          <ShadcnAlert>
            <MessageCircleWarning class="size-4" />
            <ShadcnAlertTitle>
              <span v-if="DOCUMENTS_TABLE.admin">No documents available</span>
              <span v-else>No documents available for '{{ user.name }}'</span>
            </ShadcnAlertTitle>
            <ShadcnAlertDescription>
              <span v-if="DOCUMENTS_TABLE.admin">
                Ask your employee to create a document first.
              </span>
              <span v-else>
                Please contact your admin to initiate a document.
              </span>
            </ShadcnAlertDescription>
          </ShadcnAlert>
        </ShadcnTableCell>
      </ShadcnTableRow>
    </ShadcnTableBody>
  </BaseTable>
</template>
