<script setup lang="ts">
import { useVueToPrint } from 'vue-to-print';
import { isStatusInitiatedOrRejected } from '~/lib/documents';
import { catchFetchError, handleResponseError } from '~/lib/exceptions';
import { STATUSES, type BAPPOrBAST, type DOCUMENTS_TABLE_TYPE, type DocumentTable } from '~~/types/document';

definePageMeta({
  layout: false,
});

const { id } = useRoute().params;

const { data: datatable } = useNuxtData<Record<DOCUMENTS_TABLE_TYPE, DocumentTable>>('datatable');
function getWorkAndStatus() {
  if (!datatable.value) {
    navigateTo('/documents');
    return;
  }

  if (!id) throw createError({ statusCode: 404, fatal: true });

  const row = datatable.value.employee.rows.find(row => row.key === id);
  if (!row) throw createError({ statusCode: 404, fatal: true });
  if (!isStatusInitiatedOrRejected(row.meta.status)) throw createError({ statusCode: 404, fatal: true });

  return { work: row.meta.mapped_work.value, status: row.meta.status };
};
const form = ref(getWorkAndStatus()?.work);
const formStatus = getWorkAndStatus()?.status || STATUSES.initiated;
const documentFormRef = ref();
const isDocumentFormValid = computed(() => documentFormRef.value?.form.meta.value.valid);
const showNonEditableFields = ref(false);
const { data: formItemsTitle } = useLazyFetch('/api/documents/form/items/recommendations', { params: { id, type: 'title' } });
const formItems = computed(() => {
  if (!form.value || !datatable.value) return { title: [], nominal: [] };

  const filteredRows = Object.values(datatable.value).flatMap(item => item.rows).filter(row => row.key !== id);
  const datatableMap = new Map(filteredRows.map(row => [row.key, row.meta.mapped_work.value]));

  let titles = Array.from(datatableMap.values()).filter(item => item.detailsTitle !== '').map(item => ({ key: item.detailsNumber, value: item.detailsTitle }));
  if (formItemsTitle.value?.length) titles = [...formItemsTitle.value, ...titles];
  const nominals = Array.from(datatableMap.values()).map(item => ({ key: item.poNumber, value: item.invoiceNominal || 0 }));

  return {
    title: createRecommendations<string>(titles, form.value.detailsNumber),
    nominal: createRecommendations<number>(nominals, form.value.poNumber),
  };
});

const tabs = computed<{ key: BAPPOrBAST }[]>(() => [
  { key: 'BAPP' },
  form.value?.bastNumber?.length ? { key: 'BAST' } : undefined,
].filter(Boolean) as { key: BAPPOrBAST }[]);
const documentType = ref<BAPPOrBAST>('BAPP');

// VueToPrint
const documentComponentRef = ref();
const { handlePrint } = useVueToPrint({
  content: computed(() => documentComponentRef.value[0]),
  documentTitle: documentType.value === 'BAPP'
    ? `BAPP_${form.value?.bappNumber}`
    : `BAST_${form.value?.bastNumber}`,
  removeAfterPrint: true,
});

// SIGN by User
const formSign = ref(form.value?.employeeSignUrl || '');
const showDialogSign = ref(false);
const isLoading = ref(false);
const isDisabledAction = computed(() => isLoading.value && showDialogSign.value);
const showAlertDialog = ref(false);
const skipStore = ref(false);

function handleSign() {
  form.value!.employeeSignUrl = formSign.value;
  handleGenerate();
}

function handleSaveAndPrint() {
  showAlertDialog.value = false;
  skipStore.value = false;
  handleGenerate();
}

function handlePrintOnly() {
  skipStore.value = true;
  handleGenerate();
}

async function handleGenerate() {
  isLoading.value = true;
  showDialogSign.value = false;

  if (!formSign.value) {
    showDialogSign.value = true;
    isLoading.value = false;
    return;
  }

  await nextTick();

  if (!skipStore.value)
    await $fetch(`/api/documents/${id}`, {
      method: 'PUT',
      params: { name: form.value!.employeeName },
      body: form.value,
      onResponseError: ({ response }) => {
        handleResponseError(response);
      },
      async onResponse() {
        await refreshNuxtData('datatable');
      },
    })
      .catch(catchFetchError);

  handlePrint();

  isLoading.value = false;
}
</script>

<template>
  <div>
    <NuxtLayout name="documents">
      <template #bodyHeader>
        <WidgetBreadcrumb
          :items="[{ label: 'Documents', href: '/documents' }]"
          page="Document"
        />
      </template>
      <template
        v-if="form"
        #bodyLeft
      >
        <DocumentForm
          ref="documentFormRef"
          v-model="form"
          v-model:show-non-editable-fields="showNonEditableFields"
          :status="formStatus"
          :items="formItems"
          :is-disabled-action="isDisabledAction"
          @generate="() => showAlertDialog = true"
        />
      </template>
      <template
        v-if="form"
        #bodyContent
      >
        <div>
          <ShadcnAlertDialog v-model:open="showAlertDialog">
            <ShadcnAlertDialogContent>
              <ShadcnAlertDialogHeader>
                <ShadcnAlertDialogTitle>Warning</ShadcnAlertDialogTitle>
                <ShadcnAlertDialogDescription>
                  This action will save your data to the database.
                  <p>If you only wish to generate a document without saving, please use the "Print" button instead.</p>
                </ShadcnAlertDialogDescription>
              </ShadcnAlertDialogHeader>
              <ShadcnAlertDialogFooter>
                <ShadcnAlertDialogCancel>Cancel</ShadcnAlertDialogCancel>
                <ShadcnAlertDialogAction @click="handleSaveAndPrint">
                  Continue
                </ShadcnAlertDialogAction>
              </ShadcnAlertDialogFooter>
            </ShadcnAlertDialogContent>
          </ShadcnAlertDialog>

          <DocumentDialogSign
            v-model:open="showDialogSign"
            v-model="formSign"
            @sign="handleSign"
          />
        </div>

        <ShadcnTabs v-model="documentType">
          <ShadcnTabsList>
            <ShadcnTabsTrigger
              v-for="tab in tabs"
              :key="tab.key"
              :value="tab.key"
            >
              {{ tab.key }}
            </ShadcnTabsTrigger>
          </ShadcnTabsList>
          <ShadcnTabsContent
            v-for="tab in tabs"
            :key="tab.key"
            :value="tab.key"
          >
            <DocumentContent
              ref="documentComponentRef"
              :type="documentType"
              :data="form"
            />
          </ShadcnTabsContent>
        </ShadcnTabs>
      </template>
      <template
        v-if="form"
        #bodyRight
      >
        <DocumentAction>
          <ShadcnButton
            :disabled="!isDocumentFormValid"
            @click="handlePrintOnly"
          >
            Print
          </ShadcnButton>
        </DocumentAction>
      </template>
    </NuxtLayout>
  </div>
</template>
