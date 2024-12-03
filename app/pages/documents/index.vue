<script setup lang="ts">
import { MoreVertical } from 'lucide-vue-next';
import type { WorkAndKey } from '~~/types/document';
import type { WorkDocument } from '~~/types/schema/document';

const page = 'Documents';

const { user } = useUserSession();

const { data: mitraTableData } = await useFetch(
  `/api/documents/mitra/${user.value!.name}`,
  { watch: [user], immediate: true },
);
const columns = computed(() => mitraTableData.value?.columns);
const rows = computed(() => mitraTableData.value?.rows);

const { setWork } = useDocument();
function handleCreateBAPP(data: WorkAndKey) {
  setWork(data);
  navigateTo('/documents/bapp');
}
function handleViewBAPP(data: WorkDocument) {
  console.log('handleViewBAPP', data);
}
function handleCreateBAST(data: WorkAndKey) {
  setWork(data);
  navigateTo('/documents/bast');
}
function handleViewBAST(data: WorkDocument) {
  console.log('handleViewBAST', data);
}

function handleMessageSpv(data: WorkDocument) {
  console.log('handleMessageSpv', data);
}
function handleFillForm(data: WorkDocument) {
  console.log('handleFillForm', data);
}
</script>

<template>
  <div>
    <NuxtLayout name="documents">
      <template #bodyHeader>
        <DocumentBreadcrumb
          :page
          :items="[]"
        />
      </template>
      <template #bodyContent>
        <ShadcnCard>
          <ShadcnCardHeader>
            <ShadcnCardTitle>Mitra Documents</ShadcnCardTitle>
            <ShadcnCardDescription>
              Manage documents (BAPP, BAST) with automatically pre-filled
              information.
            </ShadcnCardDescription>
          </ShadcnCardHeader>
          <ShadcnCardContent>
            <div class="h-96 overflow-auto">
              <BaseTable v-if="mitraTableData">
                <ShadcnTableHeader>
                  <ShadcnTableRow class="sticky top-0 z-10 divide-y-4 divide-y-reverse bg-white">
                    <ShadcnTableHead
                      v-if="columns"
                      class="sticky left-0 z-20 bg-white"
                    />
                    <ShadcnTableHead
                      v-for="column in columns"
                      :key="column.key"
                      class="text-nowrap border"
                    >
                      {{ column.label }}
                    </ShadcnTableHead>
                  </ShadcnTableRow>
                </ShadcnTableHeader>
                <ShadcnTableBody v-if="columns">
                  <template v-if="rows">
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
                              @click="() => handleCreateBAPP({ ...row.meta.mapped_work, key: row.key })"
                            >
                              Create
                            </ShadcnDropdownMenuItem>
                            <ShadcnDropdownMenuItem
                              @click="() => handleViewBAPP(row.meta.mapped_work)"
                            >
                              View
                            </ShadcnDropdownMenuItem>
                            <ShadcnDropdownMenuSeparator />
                            <ShadcnDropdownMenuLabel>
                              BAST
                            </ShadcnDropdownMenuLabel>
                            <ShadcnDropdownMenuItem
                              @click="() => handleCreateBAST({ ...row.meta.mapped_work, key: row.key })"
                            >
                              Create
                            </ShadcnDropdownMenuItem>
                            <ShadcnDropdownMenuItem
                              @click="() => handleViewBAST(row.meta.mapped_work)"
                            >
                              View
                            </ShadcnDropdownMenuItem>
                            <ShadcnDropdownMenuSeparator />
                            <ShadcnDropdownMenuLabel>
                              Others
                            </ShadcnDropdownMenuLabel>
                            <ShadcnDropdownMenuItem
                              @click="() => handleMessageSpv(row.meta.mapped_work)"
                            >
                              Message Supervisor
                            </ShadcnDropdownMenuItem>
                            <ShadcnDropdownMenuItem
                              @click="() => handleFillForm(row.meta.mapped_work)"
                            >
                              Fill Form
                            </ShadcnDropdownMenuItem>
                          </ShadcnDropdownMenuContent>
                        </ShadcnDropdownMenu>
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
                    <ShadcnTableCell
                      :colspan="columns.length"
                      class="h-24 text-center"
                    >
                      Data Record Not Found
                    </ShadcnTableCell>
                  </ShadcnTableRow>
                </ShadcnTableBody>
              </BaseTable>
            </div>
          </ShadcnCardContent>
        </ShadcnCard>
      </template>
    </NuxtLayout>
  </div>
</template>
