<script setup lang="ts">
import { useVueToPrint } from 'vue-to-print';
import { DOCUMENTS_TABLE, type DOCUMENTS_TABLE_TYPE, type DocumentTable } from '~~/types/document';
import { catchFetchError, handleResponseError } from '~/lib/exceptions';
import type { CreateOrView } from '~~/types/action';
import { makeWorkDocument } from '~/lib/documents';

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
    );
    return Object.fromEntries(datatables);
  },
);
const columns = computed(() => mitraTableData.value?.[datatableType.value].columns || []);
const rows = computed(() => mitraTableData.value?.[datatableType.value].rows || []);
if (error.value) throw createError({ ...error.value, fatal: true });

const form = ref(makeWorkDocument());
function getFormById(id: string) {
  const row = id
    ? rows.value.find(row => row.key === id)
    : rows.value[0];

  return row!.meta.mapped_work.value;
};

// VueToPrint
const documentComponentRef = ref();
const { handlePrint } = useVueToPrint({
  content: documentComponentRef,
  documentTitle: `document_${form.value.poNumber}`,
  removeAfterPrint: true,
});

const showDialogAutoFill = ref(false);
async function handleGenerateAutoFill() {
  showDialogAutoFill.value = false;

  await nextTick();
  handlePrint();
}
function handleAutoFill(context: { id: string }) {
  form.value = getFormById(context.id);

  showDialogAutoFill.value = true;
}

function handleCreateOrView(context: { type: CreateOrView; id: string }) {
  const { type, id } = context;
  form.value = getFormById(id);

  if (type === 'create') navigateTo(`/documents/${id}/create`);
  else navigateTo(`/documents/${id}`, { open: { target: '_blank' } });
}
async function handlePrePrint(context: { id: string }) {
  const { id } = context;
  form.value = getFormById(id);

  await nextTick();
  handlePrint();
}
async function handleFillForm(context: { id: string }) {
  const { id } = context;
  form.value = getFormById(id);

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
                    @auto-fill="handleAutoFill"
                    @create-or-view="handleCreateOrView"
                    @print="handlePrePrint"
                    @form-fill="handleFillForm"
                  />
                </ShadcnTabsContent>
              </ShadcnTabs>
            </div>

            <div
              ref="documentComponentRef"
              class="hidden print:block"
            >
              <DocumentContent
                type="BAPP"
                :data="form"
              />
              <DocumentContent
                v-if="form.bastNumber?.length"
                type="BAST"
                :data="form"
              />
            </div>

            <DocumentDialogAutoFill
              v-model:open="showDialogAutoFill"
              :model-value="form"
              @generate="handleGenerateAutoFill"
            />
          </ShadcnCardContent>
        </ShadcnCard>
      </template>
    </NuxtLayout>
  </div>
</template>
