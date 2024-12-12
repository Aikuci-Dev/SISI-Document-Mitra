<script setup lang="ts">
import { useVueToPrint } from 'vue-to-print';
import { toast } from '~/components/shadcn/ui/toast';
import { catchFetchError } from '~/lib/exceptions';
import { isValidDocumentType } from '~/lib/documents';
import { isString } from '~/lib/utils';
import { DOCUMENTS, type DOCUMENTS_TYPE } from '~~/types/document';

definePageMeta({
  layout: false,
  middleware: [
    function (to, from) {
      if (from.name === to.name && from.params !== to.params) return;
      if (from.name !== 'documents') return navigateTo('/documents');

      return;
    },
  ],
});

const route = useRoute();
const routeType = computed<string>(() => {
  if (isString(route.params.type)) return route.params.type.toLowerCase();
  return '';
});
if (!isValidDocumentType(routeType.value)) navigateTo('/documents');

const { work, workKey, workRelated, setWorkRelated } = useDocument();
const form = ref(work);
const relatedWork = toValue(workRelated) || [];

// VueToPrint
const documentComponentRef = ref();
const { handlePrint } = useVueToPrint({
  content: documentComponentRef,
  documentTitle: routeType.value === 'bapp'
    ? `BAPP_${form.value?.bappNumber}`
    : `BAST_${form.value?.bastNumber}`,
  removeAfterPrint: true,
});

const showAlertDialog = ref(false);

// SIGN by User
const formSign = ref(work.value?.employeeSignUrl || '');
const showDialogSign = ref(false);
const isLoading = ref(false);
const isAnyStoredBAPP = computed(() => workRelated.value?.some(work => work.type === DOCUMENTS.bapp));
const isDisabledAction = computed(() => {
  switch (routeType.value) {
    case DOCUMENTS.bast:
      if (!isAnyStoredBAPP.value) return true;
      break;

    default:
      break;
  }

  return isLoading.value && showDialogSign.value;
});
const isDisabledInput = routeType.value === DOCUMENTS.bast && isAnyStoredBAPP.value;
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
    await $fetch(`/api/documents/type/${routeType.value}/${workKey.value}`, {
      method: 'POST',
      params: { name: form.value!.employeeName },
      body: form.value,
      onRequest() {
        // Ref: https://nuxt.com/docs/api/composables/use-nuxt-data#optimistic-updates
        setWorkRelated([...relatedWork, { type: routeType.value as DOCUMENTS_TYPE, value: form.value! }]);
      },
      onRequestError() {
        setWorkRelated(relatedWork);
      },
      onResponseError: ({ response }) => {
        setWorkRelated(relatedWork);

        const messages = response.statusText.split('>>');
        toast({
          title: messages[0]?.trim(),
          description: messages[1]?.trim(),
          variant: 'destructive',
        });
      },
    })
      .catch(catchFetchError);
    // TODO: Implement PDF generation on the server (similar to `handlePrint`)

    // Remove when server-side implementation is done
    handlePrint();
  }

  isLoading.value = false;
}
function handleCreateBAST() {
  navigateTo('/documents/bast');
}
function handleViewBAPP() {
  navigateTo(`/documents/bapp/${workKey.value}`, { open: { target: '_blank' } });
}
</script>

<template>
  <div>
    <NuxtLayout name="documents">
      <template #bodyHeader>
        <WidgetBreadcrumb
          :items="[{ label: 'Documents', href: '/documents' }]"
          :page="routeType.toUpperCase()"
        />
      </template>
      <template
        v-if="form"
        #bodyLeft
      >
        <DocumentForm
          v-model="form"
          :is-disabled-action="isDisabledAction"
          :is-disabled-input="isDisabledInput"
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
        <DocumentContentBAPP
          v-if="routeType === 'bapp'"
          ref="documentComponentRef"
          :data="form"
        />
        <DocumentContentBAST
          v-else
          ref="documentComponentRef"
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
          <ShadcnButton
            v-if="routeType === 'bast' && isAnyStoredBAPP"
            @click="handleViewBAPP"
          >
            View BAPP
          </ShadcnButton>
          <ShadcnButton
            v-if="routeType === 'bapp' && isAnyStoredBAPP && form.bastNumber"
            @click="handleCreateBAST"
          >
            Create BAST
          </ShadcnButton>
        </DocumentAction>
      </template>
    </NuxtLayout>
  </div>
</template>
