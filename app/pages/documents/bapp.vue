<script setup lang="ts">
definePageMeta({
  middleware: 'document-child',
});

const page = 'BAPP';

const { work } = useDocument();
const form = ref(work);

function handleGenerate() {
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
          @generate="handleGenerate"
        />
      </template>
      <template #bodyContent>
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
