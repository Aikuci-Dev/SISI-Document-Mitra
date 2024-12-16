<script setup lang="ts">
import { MoreVertical, MessageCircleWarning } from 'lucide-vue-next';
import { DOCUMENTS, DOCUMENTS_TABLE, STATUSES, type DOCUMENTS_TABLE_TYPE, type DOCUMENTS_TYPE, type DocumentTable, type WorkMetaStatus, type WorkWithMeta } from '~~/types/document';
import type { User } from '~~/types/session';

type DatatableEmits = {
  create: [{ type: DOCUMENTS_TYPE; data: WorkWithMeta }];
  view: [{ type: DOCUMENTS_TYPE; id: string }];
  formFill: [{ id: string }];
};
defineEmits<DatatableEmits>();

type DatatableProps = DocumentTable & {
  type: DOCUMENTS_TABLE_TYPE;
  user: User; storedDocuments: Map<string, WorkMetaStatus>;
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
            <ShadcnDropdownMenu>
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
                  BAPP
                </ShadcnDropdownMenuLabel>
                <ShadcnDropdownMenuItem
                  v-if="type === DOCUMENTS_TABLE.employee && row.meta.statuses.find(status => status.type === DOCUMENTS.bapp && status.status === STATUSES.rejected)"
                  @click="$emit('create', { type: DOCUMENTS.bapp, data: { ...row.meta.mapped_work, meta: row.meta } })"
                >
                  Revise
                </ShadcnDropdownMenuItem>
                <ShadcnDropdownMenuItem
                  v-else-if="storedDocuments.has(`${DOCUMENTS.bapp}-${row.key}`)"
                  @click="$emit('view', { type: DOCUMENTS.bapp, id: row.key })"
                >
                  View
                </ShadcnDropdownMenuItem>
                <ShadcnDropdownMenuItem
                  v-else-if="type === DOCUMENTS_TABLE.employee"
                  @click="$emit('create', { type: DOCUMENTS.bapp, data: { ...row.meta.mapped_work, meta: row.meta } })"
                >
                  Create
                </ShadcnDropdownMenuItem>
                <div v-if="row.meta.mapped_work.bastNumber">
                  <ShadcnDropdownMenuSeparator />
                  <ShadcnDropdownMenuLabel>
                    BAST
                  </ShadcnDropdownMenuLabel>
                  <ShadcnDropdownMenuItem
                    v-if="type === DOCUMENTS_TABLE.employee && row.meta.statuses.find(status => status.type === DOCUMENTS.bast && status.status === STATUSES.rejected)"
                    @click="$emit('create', { type: DOCUMENTS.bapp, data: { ...row.meta.mapped_work, meta: row.meta } })"
                  >
                    Revise
                  </ShadcnDropdownMenuItem>
                  <ShadcnDropdownMenuItem
                    v-else-if="storedDocuments.has(`${DOCUMENTS.bast}-${row.key}`)"
                    @click="$emit('view', { type: DOCUMENTS.bast, id: row.key })"
                  >
                    View
                  </ShadcnDropdownMenuItem>
                  <ShadcnDropdownMenuItem
                    v-else-if="type === DOCUMENTS_TABLE.employee"
                    @click="$emit('create', { type: DOCUMENTS.bast, data: { ...row.meta.mapped_work, meta: row.meta } })"
                  >
                    Create
                  </ShadcnDropdownMenuItem>
                </div>
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
            <DocumentBadgeStatus
              v-for="status in row.meta.statuses"
              :key="status.type"
              :type="status.type"
              :status="status.status"
            />
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
            <ShadcnAlertTitle>No document found associated with your name '{{ user.name }}'</ShadcnAlertTitle>
            <ShadcnAlertDescription>
              Please contact admin to create a new one for you.
            </ShadcnAlertDescription>
          </ShadcnAlert>
        </ShadcnTableCell>
      </ShadcnTableRow>
    </ShadcnTableBody>
  </BaseTable>
</template>
