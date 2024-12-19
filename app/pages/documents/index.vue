<script setup lang="ts">
import { DOCUMENTS_TABLE, type DOCUMENTS_TABLE_TYPE, type WorkWithMeta } from '~~/types/document';
import { catchFetchError, handleResponseError } from '~/lib/exceptions';

definePageMeta({
  layout: false,
  middleware: ['redirect'],
});

const page = 'Documents';

const { user } = useUserSession();
const hasAdminRole = computed(() => user.value?.role?.includes('admin'));

const tabs = [
  { key: DOCUMENTS_TABLE.employee, title: 'As Employee' },
  { key: DOCUMENTS_TABLE.supervisor, title: 'As Supervisor' },
  hasAdminRole.value ? { key: DOCUMENTS_TABLE.admin, title: 'As Admin' } : undefined,
].filter(Boolean) as { key: DOCUMENTS_TABLE_TYPE; title: string }[];
const datatableType = ref<DOCUMENTS_TABLE_TYPE>('employee');

const { data: mitraTableData, error } = await useFetch(
  `/api/documents/datatable/${user.value!.name}`,
  {
    params: { type: datatableType },
    watch: [datatableType],
  },
);
const columns = computed(() => mitraTableData.value?.columns || []);
const rows = computed(() => mitraTableData.value?.rows || []);
if (error.value) throw createError({ ...error.value, fatal: true });

const { setWork, setWorkKey } = useDocument();
async function handleCreateDocument(context: { data: WorkWithMeta }) {
  const { data } = context;

  const { meta, ...rest } = data;
  setWorkKey(meta.key);
  setWork(rest);

  navigateTo(`/documents/create`);
}
function handleViewDocument(context: { id: string }) {
  const { id } = context;

  navigateTo(`/documents/${id}`, { open: { target: '_blank' } });
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
            <div>
              <ShadcnTabs
                v-model="datatableType"
              >
                <ShadcnTabsList>
                  <ShadcnTabsTrigger
                    v-for="tab in tabs"
                    :key="tab.key"
                    :value="tab.key"
                  >
                    {{ tab.title }}
                  </ShadcnTabsTrigger>
                </ShadcnTabsList>
                <ShadcnTabsContent
                  v-for="tab in tabs"
                  :key="tab.key"
                  :value="tab.key"
                  class="h-[480px] overflow-auto"
                >
                  <DocumentDatatable
                    :columns
                    :rows
                    :user="user!"
                    :type="datatableType"
                    @create="handleCreateDocument"
                    @view="handleViewDocument"
                    @form-fill="handleFillForm"
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
