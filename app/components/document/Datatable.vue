<script setup lang="ts">
import { MoreVertical, MessageCircleWarning } from 'lucide-vue-next';
import { DOCUMENTS_TABLE, STATUSES, type DOCUMENTS_TABLE_TYPE, type DocumentTable, type WorkWithMeta } from '~~/types/document';
import type { User } from '~~/types/session';

type DatatableEmits = {
  create: [{ data: WorkWithMeta }];
  view: [{ id: string }];
  formFill: [{ id: string }];
};
defineEmits<DatatableEmits>();

type DatatableProps = DocumentTable & {
  type: DOCUMENTS_TABLE_TYPE;
  user: User;
};
defineProps<DatatableProps>();
</script>

<template>
  <BaseTable>
    <ShadcnTableHeader>
      <ShadcnTableRow class="sticky top-0 z-10 divide-y-4 divide-y-reverse bg-white">
        <ShadcnTableHead class="sticky left-0 z-20 bg-white" />
        <ShadcnTableHead class="text-nowrap">
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
            <ShadcnDropdownMenu v-if="row.meta.status !== STATUSES.nil && row.meta.status !== STATUSES.draft">
              <ShadcnDropdownMenuTrigger as-child>
                <ShadcnButton
                  variant="ghost"
                  class="size-8 p-0"
                >
                  <MoreVertical class="size-4" />
                </ShadcnButton>
              </ShadcnDropdownMenuTrigger>
              <ShadcnDropdownMenuContent align="end">
                <ShadcnDropdownMenuLabel>
                  DOCUMENT
                </ShadcnDropdownMenuLabel>
                <ShadcnDropdownMenuItem
                  v-if="type === DOCUMENTS_TABLE.employee"
                  @click="$emit('create', { data: { ...row.meta.mapped_work, meta: row.meta } })"
                >
                  <span v-if="row.meta.status === STATUSES.rejected">Revise</span>
                  <span v-else-if="row.meta.status === STATUSES.initiated">Create</span>
                </ShadcnDropdownMenuItem>
                <ShadcnDropdownMenuItem
                  v-else-if="row.meta.status !== STATUSES.initiated"
                  @click="$emit('view', { id: row.key })"
                >
                  View
                </ShadcnDropdownMenuItem>
                <template v-if="type === DOCUMENTS_TABLE.employee">
                  <ShadcnDropdownMenuSeparator />
                  <ShadcnDropdownMenuLabel>
                    Others
                  </ShadcnDropdownMenuLabel>
                  <ShadcnDropdownMenuItem @click="$emit('formFill', { id: row.key })">
                    Fill Form
                  </ShadcnDropdownMenuItem>
                </template>
              </ShadcnDropdownMenuContent>
            </ShadcnDropdownMenu>
          </ShadcnTableCell>
          <ShadcnTableCell class="flex flex-col space-y-4 text-nowrap text-center">
            <DocumentBadgeStatus :status="row.meta.status" />
          </ShadcnTableCell>
          <ShadcnTableCell
            v-for="(value, index) in row.value"
            :key="`${row.key}-${index}`"
            class="text-nowrap border"
          >
            {{ value }}
          </ShadcnTableCell>
        </ShadcnTableRow>
      </template>
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
