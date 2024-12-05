<script setup lang="ts">
import { useVueToPrint } from 'vue-to-print';
import type { WorkDocument } from '~~/types/schema/document';

definePageMeta({
  layout: false,
  middleware: 'document-child',
});

const page = 'BAST';

const { work, workKey } = useDocument();
const document = computed<(WorkDocument & { bast: { number: string } }) | undefined>(
  () => {
    if (work.value && work.value.bast && work.value.bast.number)
      return work.value as WorkDocument & { bast: { number: string } };

    return undefined;
  },
);
const form = ref(document);
const formSign = ref();
const showDialogSign = ref(false);
const isLoading = ref(false);
const isDisabledAction = computed(() => isLoading.value && showDialogSign.value);

function handleSign() {
  if (!form.value) return;
  form.value.employee.sign.url = formSign.value;
  handleGenerate();
}

async function handleGenerate(skipStore?: boolean) {
  isLoading.value = true;
  showDialogSign.value = false;

  if (!formSign.value) {
    showDialogSign.value = true;
    return;
  }

  await nextTick();

  if (skipStore) handlePrint();
  else {
    try {
      await $fetch(`/api/documents/mitra/bast/${workKey.value}`, {
        method: 'POST',
        params: { name: form.value!.employee.name },
        body: form.value,
      });
      // TODO: Implement PDF generation on the server (similar to `handlePrint`)

      // Remove when server-side implementation is done
      handlePrint();
    }
    catch (error) {
      // TODO: Error Handling
      console.error(error);
    }
  }

  isLoading.value = false;
}

const documentComponentRef = ref();
const { handlePrint } = useVueToPrint({
  content: documentComponentRef,
  documentTitle: `BAST_${form.value?.bast.number}`,
  removeAfterPrint: true,
});

function handleViewBAPP() {
  navigateTo(`/documents/bapp/${workKey.value}`, { open: { target: '_blank' } });
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
        <DocumentContentBAST
          v-if="form"
          ref="documentComponentRef"
          :data="form"
        />
      </template>
      <template #bodyRight>
        <DocumentAction>
          <ShadcnButton @click="() => handleGenerate(true)">
            Print
          </ShadcnButton>
          <ShadcnButton @click="handleViewBAPP">
            View BAPP
          </ShadcnButton>
        </DocumentAction>
      </template>
    </NuxtLayout>
  </div>
</template>
