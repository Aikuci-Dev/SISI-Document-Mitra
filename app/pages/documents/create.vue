<script setup lang="ts">
import { useVueToPrint } from 'vue-to-print';
import { catchFetchError, handleResponseError } from '~/lib/exceptions';
import type { BAPPOrBAST } from '~~/types/document';

definePageMeta({
  layout: false,
  middleware: [
    function (to, from) {
      if (from.name !== 'documents') return navigateTo('/documents');

      return;
    },
  ],
});

const { work, workKey } = useDocument();
const form = ref(work);

// VueToPrint
const documentType = ref<BAPPOrBAST>('BAPP');
const documentComponentRef = ref();
const { handlePrint } = useVueToPrint({
  content: documentComponentRef,
  documentTitle: documentType.value === 'BAPP'
    ? `BAPP_${form.value?.bappNumber}`
    : `BAST_${form.value?.bastNumber}`,
  removeAfterPrint: true,
});

const showAlertDialog = ref(false);

// SIGN by User
const formSign = ref(work.value?.employeeSignUrl || '');
const showDialogSign = ref(false);
const isLoading = ref(false);
const isDisabledAction = computed(() => isLoading.value && showDialogSign.value);
function handleSign() {
  form.value!.employeeSignUrl = formSign.value;
  handleGenerate();
}

async function handleGenerate(skipStore?: boolean) {
  showAlertDialog.value = false;
  isLoading.value = true;
  showDialogSign.value = false;

  if (!formSign.value) {
    showDialogSign.value = true;
    return;
  }

  await nextTick();

  if (skipStore) handlePrint();
  else {
    await $fetch(`/api/documents/${workKey.value}`, {
      method: 'PUT',
      params: { name: form.value!.employeeName },
      body: form.value,
      onResponseError: ({ response }) => {
        handleResponseError(response);
      },
    })
      .catch(catchFetchError);
    // TODO: Implement PDF generation on the server (similar to `handlePrint`)

    // Remove when server-side implementation is done
    handlePrint();
  }

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
          v-model="form"
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
                <ShadcnAlertDialogAction @click="() => handleGenerate()">
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
        <DocumentContent
          ref="documentComponentRef"
          :type="documentType"
          :data="form"
        />
      </template>
      <template
        v-if="form"
        #bodyRight
      >
        <DocumentAction>
          <ShadcnButton @click="() => handleGenerate(true)">
            Print
          </ShadcnButton>
        </DocumentAction>
      </template>
    </NuxtLayout>
  </div>
</template>
