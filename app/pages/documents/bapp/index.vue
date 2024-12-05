<script setup lang="ts">
import { useVueToPrint } from 'vue-to-print';

definePageMeta({
  layout: false,
  middleware: 'document-child',
});

const page = 'BAPP';

const { work, workKey } = useDocument();
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
      await $fetch(`/api/documents/mitra/bapp/${workKey.value}`, {
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
          <ShadcnButton @click="() => handleGenerate(true)">
            Print
          </ShadcnButton>
          <ShadcnButton
            v-if="form?.bast?.number"
            @click="handleCreateBAST"
          >
            Create BAST
          </ShadcnButton>
        </DocumentAction>
      </template>
    </NuxtLayout>
  </div>
</template>
