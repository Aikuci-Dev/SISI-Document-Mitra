<script setup lang="ts">
import { MoreVertical, MessageCircleWarning } from 'lucide-vue-next';
import type { WorkAndKey } from '~~/types/document';
import { toast } from '~/components/shadcn/ui/toast';
import { catchFetchError } from '~/lib/exceptions';

definePageMeta({
  layout: false,
  middleware: ['redirect'],
});

const page = 'Documents';

const { user } = useUserSession();
const { data: mitraTableData, error } = await useFetch(
  `/api/documents/mitra/${user.value!.name}`,
);
const columns = computed(() => mitraTableData.value?.columns);
const rows = computed(() => mitraTableData.value?.rows);
if (error.value) throw createError({ ...error.value, fatal: true });

const { setWork } = useDocument();
async function handleCreateBAPP(data: WorkAndKey) {
  const bapp = await $fetch(
    `/api/documents/type/bapp/${data.key}`,
  )
    .catch(catchFetchError);

  if (bapp) setWork({ ...bapp.value, key: data.key });
  else setWork(data);

  navigateTo('/documents/bapp');
}
function handleViewBAPP(id: string) {
  navigateTo(`/documents/bapp/${id}`, { open: { target: '_blank' } });
}
async function handleCreateBAST(data: WorkAndKey) {
  const bast = await $fetch(
    `/api/documents/type/bast/${data.key}`,
  )
    .catch(catchFetchError);

  if (bast) setWork({ ...bast.value, key: data.key });
  else setWork(data);

  navigateTo('/documents/bast');
}
function handleViewBAST(id: string) {
  navigateTo(`/documents/bast/${id}`, { open: { target: '_blank' } });
}
async function handleFillForm(id: string) {
  const formUrl = await $fetch('/api/documents/form/generate-url', {
    params: { id, name: user.value?.name },
    onResponseError: ({ response }) => {
      const messages = response.statusText.split('>>');
      toast({
        title: messages[0]?.trim(),
        description: messages[1]?.trim(),
        variant: 'destructive',
      });
    },
  })
    .catch(catchFetchError);

  if (formUrl)
    navigateTo(formUrl, { open: { target: '_blank' } });
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
                  <template v-if="rows?.length">
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
                              @click="() => handleViewBAPP(row.key)"
                            >
                              View
                            </ShadcnDropdownMenuItem>
                            <div v-if="row.meta.mapped_work.bast?.number">
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
                                @click="() => handleViewBAST(row.key)"
                              >
                                View
                              </ShadcnDropdownMenuItem>
                            </div>
                            <ShadcnDropdownMenuSeparator />
                            <ShadcnDropdownMenuLabel>
                              Others
                            </ShadcnDropdownMenuLabel>
                            <ShadcnDropdownMenuItem
                              @click="() => handleFillForm(row.key)"
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
                    <ShadcnTableCell />
                    <ShadcnTableCell
                      :colspan="columns.length"
                      class="h-24 border text-center"
                    >
                      <ShadcnAlert>
                        <MessageCircleWarning class="size-4" />
                        <ShadcnAlertTitle>No document found associated with your name '{{ user?.name }}'</ShadcnAlertTitle>
                        <ShadcnAlertDescription>
                          Please contact admin to create a new one for you.
                        </ShadcnAlertDescription>
                      </ShadcnAlert>
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
