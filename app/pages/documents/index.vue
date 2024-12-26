<script setup lang="ts">
import { DOCUMENTS_TABLE, type DOCUMENTS_TABLE_TYPE, type DocumentTable } from '~~/types/document';
import { catchFetchError, handleResponseError } from '~/lib/exceptions';
import type { CreateOrView } from '~~/types/action';

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

const { data: mitraTableData, error } = await useAsyncData<Record<DOCUMENTS_TABLE_TYPE, DocumentTable>>(
  'datatable',
  async () => {
    const datatables = await Promise.all(
      tabs.map(async tab => [
        tab.key,
        await useRequestFetch()(`/api/documents/datatable/${user.value!.name}`, { params: { type: tab.key } },
        ),
      ]),
    ).catch((err) => {
      // BUG: Why sometime error occurred?
      console.error('err', err);
      return [];
    });
    return Object.fromEntries(datatables);
  },
);
const columns = computed(() => mitraTableData.value?.[datatableType.value].columns || []);
const rows = computed(() => mitraTableData.value?.[datatableType.value].rows || []);
if (error.value) throw createError({ ...error.value, fatal: true });

function handleCreateOrView(context: { type: CreateOrView; id: string }) {
  const { id, type } = context;

  if (type === 'create') navigateTo(`/documents/${id}/create`);
  else navigateTo(`/documents/${id}`, { open: { target: '_blank' } });
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
                    @create-or-view="handleCreateOrView"
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
