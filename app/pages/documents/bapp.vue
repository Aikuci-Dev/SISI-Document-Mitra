<script setup lang="ts">
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
function handleGenerate() {
  showDialogSign.value = false;
  isLoading.value = true;

  if (!formSign.value) {
    showDialogSign.value = true;
    return;
  }

  isLoading.value = false;
  console.log('handleGenerate');
}
function handleExport() {
  // TODO: Implement export functionality
  // Similar to handleGenerate, but process it on server-side.
  console.log('handleExport');
}
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
          :data="form"
        />
      </template>
      <template #bodyRight>
        <DocumentAction>
          <ShadcnButton @click="handleExport">
            Export
          </ShadcnButton>
          <ShadcnButton @click="handleCreateBAST">
            Create BAST
          </ShadcnButton>
        </DocumentAction>
      </template>
    </NuxtLayout>
  </div>
</template>
