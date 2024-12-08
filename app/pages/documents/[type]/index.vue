<script setup lang="ts">
import { useVueToPrint } from 'vue-to-print';
import { toast } from '~/components/shadcn/ui/toast';
import { catchFetchError } from '~/lib/exceptions';
import { isString } from '~/lib/utils';

definePageMeta({
  layout: false,
});

const route = useRoute();
const routeType = computed<string>(() => {
  if (isString(route.params.type)) return route.params.type.toLowerCase();
  return '';
});
if (!['bapp', 'bast'].includes(routeType.value)) {
  navigateTo('/documents');
}

const { work, workKey } = useDocument();
const form = ref(work);

// VueToPrint
const documentComponentRef = ref();
const { handlePrint } = useVueToPrint({
  content: documentComponentRef,
  documentTitle: routeType.value === 'bapp'
    ? `BAPP_${form.value?.bapp.number}`
    : `BAST_${form.value?.bast.number}`,
  removeAfterPrint: true,
});

// SIGN by User
const formSign = ref();
const showDialogSign = ref(false);
const isLoading = ref(false);
const isDisabledAction = computed(() => isLoading.value && showDialogSign.value);
function handleSign() {
  form.value!.employee.sign.url = formSign.value;
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
    await $fetch(`/api/documents/type-${routeType.value}`, {
      method: 'POST',
      params: { name: form.value!.employee.name },
      body: form.value,
      onResponseError: ({ response }) => {
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
        <DocumentBreadcrumb :page="routeType.toUpperCase()" />
      </template>
      <template
        v-if="form"
        #bodyLeft
      >
        <DocumentForm
          v-model="form"
          :is-disabled-action="isDisabledAction"
          @generate="handleGenerate"
        />
      </template>
      <template
        v-if="form"
        #bodyContent
      >
        <div>
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
            v-if="routeType === 'bast'"
            @click="handleViewBAPP"
          >
            View BAPP
          </ShadcnButton>
          <ShadcnButton
            v-else-if="form.bast.number"
            @click="handleCreateBAST"
          >
            Create BAST
          </ShadcnButton>
        </DocumentAction>
      </template>
    </NuxtLayout>
  </div>
</template>
