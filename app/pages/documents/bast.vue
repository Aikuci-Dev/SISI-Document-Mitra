<script setup lang="ts">
import type { WorkDocument } from '~~/types/document';

definePageMeta({
  middleware: 'document-child',
});

const page = 'BAST';

const { work } = useDocument();
const document = computed<(WorkDocument & { bast: { number: string } }) | undefined>(
  () => {
    if (work.value && work.value.bast && work.value.bast.number)
      return work.value as WorkDocument & { bast: { number: string } };

    return undefined;
  },
);
const form = ref(document);

function handleGenerate() {
  console.log('handleGenerate');
}
function handleExport() {
  // TODO: Implement export functionality
  // Similar to handleGenerate, but process it on server-side.
  console.log('handleExport');
}
function handleViewBAPP() {
  console.log('handleViewBAPP');
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
        <DocumentContentBAST
          v-if="form"
          :data="form"
        />
      </template>
      <template #bodyRight>
        <DocumentAction>
          <ShadcnButton @click="handleExport">
            Export
          </ShadcnButton>
          <ShadcnButton @click="handleViewBAPP">
            View BAPP
          </ShadcnButton>
        </DocumentAction>
      </template>
    </NuxtLayout>
  </div>
</template>
