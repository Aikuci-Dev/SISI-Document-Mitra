<script setup lang="ts">
import { MoreVertical, MessageCircleWarning } from 'lucide-vue-next';
import { DOCUMENTS, STATUSES, type DOCUMENTS_TYPE, type RelatedWork, type WorkWithMeta } from '~~/types/document';
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

const storedDocuments = new Map(
  rows.value?.flatMap(
    ({ meta }) => meta.statuses
      .filter(({ status }) => status !== STATUSES.initiated)
      .map(status => [`${status.type}-${meta.key}`, status]),
  ),
);

const { setWork, setWorkKey, setWorkRelated } = useDocument();
async function handleCreateDocument(type: DOCUMENTS_TYPE, data: WorkWithMeta) {
  const { meta, ...rest } = data;
  setWorkKey(meta.key);
  setWork(rest); // Set original data

  if (storedDocuments.size) {
    const relatedWork: RelatedWork[] = [];

    if (storedDocuments.has(`${type}-${meta.key}`)) {
      const document = await $fetch(`/api/documents/type/${type}/${meta.key}`).catch(catchFetchError);
      if (document) setWork(document.value); // Use stored data
    }

    // Fetch related 'bapp' document if type is 'bast'
    if (type === DOCUMENTS.bast && storedDocuments.has(`${DOCUMENTS.bapp}-${meta.key}`)) {
      const document = await $fetch(`/api/documents/type/${DOCUMENTS.bapp}/${meta.key}`).catch(catchFetchError);
      if (document) {
        setWork(document.value); // Use 'bapp' data for 'bast' type

        relatedWork.push({ type: DOCUMENTS.bapp, value: document.value });
        setWorkRelated(relatedWork);
      }
    }
  }

  navigateTo(`/documents/${type}`);
}
function handleViewDocument(type: DOCUMENTS_TYPE, id: string) {
  navigateTo(`/documents/${type}/${id}`, { open: { target: '_blank' } });
}
async function handleFillForm(id: string) {
  const formUrl = await $fetch('/api/documents/form/generate-url', {
    params: { id, name: user.value!.name },
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
              Manage documents (BAPP, BAST) with automatically pre-filled information.
            </ShadcnCardDescription>
          </ShadcnCardHeader>
          <ShadcnCardContent>
            <div class="h-[480px] overflow-auto">
              <BaseTable v-if="mitraTableData">
                <ShadcnTableHeader>
                  <ShadcnTableRow class="sticky top-0 z-10 divide-y-4 divide-y-reverse bg-white">
                    <ShadcnTableHead
                      v-if="columns"
                      class="sticky left-0 z-20 bg-white"
                    />
                    <ShadcnTableHead
                      v-if="columns"
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
                <ShadcnTableBody v-if="columns && rows">
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
                              v-if="storedDocuments.has(`${DOCUMENTS.bapp}-${row.key}`)"
                              @click="() => handleViewDocument(DOCUMENTS.bapp, row.key)"
                            >
                              View
                            </ShadcnDropdownMenuItem>
                            <ShadcnDropdownMenuItem
                              v-else
                              @click="() => handleCreateDocument(DOCUMENTS.bapp, { ...row.meta.mapped_work, meta: row.meta })"
                            >
                              Create
                            </ShadcnDropdownMenuItem>
                            <div v-if="row.meta.mapped_work.bast.number">
                              <ShadcnDropdownMenuSeparator />
                              <ShadcnDropdownMenuLabel>
                                BAST
                              </ShadcnDropdownMenuLabel>
                              <ShadcnDropdownMenuItem
                                v-if="storedDocuments.has(`${DOCUMENTS.bast}-${row.key}`)"
                                @click="() => handleViewDocument(DOCUMENTS.bast, row.key)"
                              >
                                View
                              </ShadcnDropdownMenuItem>
                              <ShadcnDropdownMenuItem
                                v-else
                                @click="() => handleCreateDocument(DOCUMENTS.bast, { ...row.meta.mapped_work, meta: row.meta })"
                              >
                                Create
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
                      <ShadcnTableCell class="flex flex-col space-y-4 text-nowrap text-center">
                        <DocumentBadgeStatus
                          v-for="{ type, status } in row.meta.statuses"
                          :key="type"
                          :type
                          :status
                        />
                      </ShadcnTableCell>
                      <ShadcnTableCell
                        v-for="(value, index) in row.value"
                        :key="`${row.key}-${index}`"
                        class="text-nowrap"
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
                        <ShadcnAlertTitle>No document found associated with your name '{{ user!.name }}'</ShadcnAlertTitle>
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
