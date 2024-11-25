<script setup lang="ts">
import { MoreVertical } from 'lucide-vue-next';

const page = 'Documents';

const { user } = useUserSession();
const { data: mitraTableData } = await useFetch(
  `/api/documents/mitra/${user.value!.name}`,
  { watch: [user], immediate: true },
);

function handleCreateBAPP(data: string[]) {
  console.log('handleCreateBAPP', data);
  navigateTo('/documents/bapp');
}
function handleViewBAPP(data: string[]) {
  console.log('handleViewBAPP', data);
}

function handleCreateBAST(data: string[]) {
  console.log('handleCreateBAST', data);
  navigateTo('/documents/bast');
}
function handleViewBAST(data: string[]) {
  console.log('handleViewBAST', data);
}

function handleMessageSpv(data: string[]) {
  console.log('handleMessageSpv', data);
}
function handleFillForm(data: string[]) {
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
            <div class="tw-h-96 tw-overflow-auto">
              <BaseTable v-if="mitraTableData">
                <ShadcnTableHeader>
                  <ShadcnTableRow class="tw-sticky tw-top-0 tw-z-10 tw-divide-y-4 tw-divide-y-reverse tw-bg-white">
                    <ShadcnTableHead
                      v-if="mitraTableData.headers.length"
                      class="tw-sticky tw-left-0 tw-z-20 tw-bg-white"
                    />
                    <ShadcnTableHead
                      v-for="header in mitraTableData.headers"
                      :key="header"
                      class="tw-text-nowrap tw-border"
                    >
                      {{ header }}
                    </ShadcnTableHead>
                  </ShadcnTableRow>
                </ShadcnTableHeader>
                <ShadcnTableBody v-if="mitraTableData.headers">
                  <template v-if="mitraTableData.values.length">
                    <ShadcnTableRow
                      v-for="row in mitraTableData.values"
                      :key="row[10]"
                    >
                      <ShadcnTableCell class="tw-sticky tw-left-0 tw-border-e-4 tw-bg-white">
                        <ShadcnDropdownMenu>
                          <ShadcnDropdownMenuTrigger as-child>
                            <ShadcnButton
                              variant="ghost"
                              class="tw-size-8 tw-p-0"
                            >
                              <MoreVertical class="tw-size-4" />
                            </ShadcnButton>
                          </ShadcnDropdownMenuTrigger>
                          <ShadcnDropdownMenuContent align="end">
                            <ShadcnDropdownMenuLabel>
                              BAPP
                            </ShadcnDropdownMenuLabel>
                            <ShadcnDropdownMenuItem
                              @click="() => handleCreateBAPP(row)"
                            >
                              Create
                            </ShadcnDropdownMenuItem>
                            <ShadcnDropdownMenuItem
                              @click="() => handleViewBAPP(row)"
                            >
                              View
                            </ShadcnDropdownMenuItem>
                            <ShadcnDropdownMenuSeparator />
                            <ShadcnDropdownMenuLabel>
                              BAST
                            </ShadcnDropdownMenuLabel>
                            <ShadcnDropdownMenuItem
                              @click="() => handleCreateBAST(row)"
                            >
                              Create
                            </ShadcnDropdownMenuItem>
                            <ShadcnDropdownMenuItem
                              @click="() => handleViewBAST(row)"
                            >
                              View
                            </ShadcnDropdownMenuItem>
                            <ShadcnDropdownMenuSeparator />
                            <ShadcnDropdownMenuLabel>
                              Others
                            </ShadcnDropdownMenuLabel>
                            <ShadcnDropdownMenuItem
                              @click="() => handleMessageSpv(row)"
                            >
                              Message Supervisor
                            </ShadcnDropdownMenuItem>
                            <ShadcnDropdownMenuItem
                              @click="() => handleFillForm(row)"
                            >
                              Fill Form
                            </ShadcnDropdownMenuItem>
                          </ShadcnDropdownMenuContent>
                        </ShadcnDropdownMenu>
                      </ShadcnTableCell>
                      <ShadcnTableCell
                        v-for="value in row"
                        :key="value"
                        class="tw-text-nowrap tw-border"
                      >
                        {{ value }}
                      </ShadcnTableCell>
                    </ShadcnTableRow>
                  </template>
                  <ShadcnTableRow v-else>
                    <ShadcnTableCell
                      :colspan="mitraTableData.headers.length"
                      class="tw-h-24 tw-text-center"
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
