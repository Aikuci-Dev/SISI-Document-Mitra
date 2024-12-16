<script setup lang="ts">
import { DOCUMENTS, STATUSES, type DOCUMENTS_TYPE, type RelatedWork, type WorkWithMeta } from '~~/types/document';
import { catchFetchError, handleResponseError } from '~/lib/exceptions';

definePageMeta({
  layout: false,
  middleware: ['redirect'],
});

const page = 'Documents';

const { user } = useUserSession();
// TODO: Decide whether to include related works.
// Current research is available but requires further investigation.
// If included: Avoid manual checks, reducing API requests.
// If not included: Smaller payload and faster response due to simpler logic.
const { data: mitraTableData, error } = await useFetch(
  `/api/documents/mitra/${user.value!.name}`,
);
const columns = computed(() => mitraTableData.value?.columns || []);
const rows = computed(() => mitraTableData.value?.rows || []);
if (error.value) throw createError({ ...error.value, fatal: true });

const storedDocuments = new Map(
  rows.value?.flatMap(
    ({ meta }) => meta.statuses
      .filter(({ status }) => status !== STATUSES.initiated)
      .map(status => [`${status.type}-${meta.key}`, status]),
  ),
);

const { setWork, setWorkKey, setWorkRelated } = useDocument();
async function handleCreateDocument(context: { type: DOCUMENTS_TYPE; data: WorkWithMeta }) {
  const { type, data } = context;

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
function handleViewDocument(context: { type: DOCUMENTS_TYPE; id: string }) {
  const { type, id } = context;

  navigateTo(`/documents/${type}/${id}`, { open: { target: '_blank' } });
}
async function handleFillForm(context: { id: string }) {
  const { id } = context;

  const formUrl = await $fetch('/api/documents/form/generate-url', {
    params: { id, name: user.value!.name },
    onResponseError: ({ response }) => handleResponseError(response),
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
        <WidgetBreadcrumb
          :items="[]"
          :page
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
              <ShadcnTabs
                default-value="employee"
                class="w-[400px]"
              >
                <ShadcnTabsList>
                  <ShadcnTabsTrigger value="employee">
                    As Employee
                  </ShadcnTabsTrigger>
                  <ShadcnTabsTrigger value="supervisor">
                    As Supervisor
                  </ShadcnTabsTrigger>
                </ShadcnTabsList>
                <ShadcnTabsContent value="employee">
                  <DocumentDatatable
                    :columns
                    :rows
                    :user="user!"
                    :stored-documents
                    can-create
                    can-fill-form
                    @create="handleCreateDocument"
                    @view="handleViewDocument"
                    @form-fill="handleFillForm"
                  />
                </ShadcnTabsContent>
                <ShadcnTabsContent value="supervisor">
                  <DocumentDatatable
                    :columns
                    :rows
                    :user="user!"
                    :stored-documents
                    @view="handleViewDocument"
                  />
                </ShadcnTabsContent>
              </ShadcnTabs>
            </div>
          </ShadcnCardContent>
        </ShadcnCard>
      </template>
    </NuxtLayout>
  </div>
</template>
