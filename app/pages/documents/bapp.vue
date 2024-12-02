<script setup lang="ts">
import { useVueToPrint } from 'vue-to-print';

definePageMeta({
  middleware: 'document-child',
});

const page = 'BAPP';

const { work } = useDocument();
const form = ref(work);
const formSign = ref();
const showDialogSign = ref(false);
const isLoading = ref(false);
const isDisabledAction = computed(() => isLoading.value && showDialogSign.value);

function handleSign() {
  if (!form.value) return;
  form.value.employee.sign.url = formSign.value;
  handleGenerate();
}
async function handleGenerate() {
  showDialogSign.value = false;
  isLoading.value = true;

  if (!formSign.value) {
    showDialogSign.value = true;
    return;
  }

  await nextTick();
  isLoading.value = false;

  // console.log('handleGenerate');
  // // TODO: Implement generate PDF functionality
  // // Similar to `handlePrint`, but process it on server-side.

  handlePrint();
}

const documentComponentRef = ref();
const { handlePrint } = useVueToPrint({
  content: documentComponentRef,
  documentTitle: `BAPP_${form.value?.bapp.number}`,
  removeAfterPrint: true,
});

function handleCreateBAST() {
  navigateTo('/documents/bast');
}
</script>

<template>
  <div>
    <NuxtLayout name="documents">
      <template #bodyHeader>
        <DocumentBreadcrumb :page />
      </template>
      <template #bodyLeft>
        <DocumentForm
          v-model="form"
          :is-disabled-action="isDisabledAction"
          @generate="handleGenerate"
        />
      </template>
      <template #bodyContent>
        <div>
          <DocumentDialogSign
            v-model:open="showDialogSign"
            v-model="formSign"
            @sign="handleSign"
          />
        </div>
        <DocumentContentBAPP
          v-if="form"
          ref="documentComponentRef"
          :data="form"
        />
      </template>
      <template #bodyRight>
        <DocumentAction>
          <ShadcnButton @click="handlePrint">
            Print
          </ShadcnButton>
          <ShadcnButton @click="handleCreateBAST">
            Create BAST
          </ShadcnButton>
        </DocumentAction>
      </template>
    </NuxtLayout>
  </div>
</template>
