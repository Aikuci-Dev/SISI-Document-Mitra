<script setup lang="ts">
import type { FetchResponse } from 'ofetch';
import { catchFetchError, handleResponseError } from '~/lib/exceptions';
import type { ApproveOrReject } from '~~/types/action';
import type { BAPPOrBAST, DOCUMENTS_TABLE_TYPE, DocumentTable, MappedWork } from '~~/types/document';

definePageMeta({
  layout: false,
});

const { id } = useRoute().params;

const { data: datatable } = useNuxtData<Record<DOCUMENTS_TABLE_TYPE, DocumentTable>>('datatable');
const { data, error } = useLazyFetch(`/api/documents/${id}`, {
  key: `datatable-${id}`,
  default() {
    if (!id || !datatable.value) return;

    const row = Object.values(datatable.value).flatMap(item => item.rows).find(row => row.key === id);
    if (row) {
      const { mapped_work, status } = row.meta;
      return { ...mapped_work, status };
    }
  },
});
if (error.value) throw createError({ ...error.value, fatal: true });

const { user } = useUserSession();
const hasAdminRole = computed(() => user.value?.role?.includes('admin'));
const supervisorName = computed(() => data.value?.value.supervisorName);
const isSupervisor = computed(() => user.value?.name === supervisorName.value);

const tabs = computed<{ key: BAPPOrBAST }[]>(() => [
  { key: 'BAPP' },
  data.value?.value.bastNumber?.length ? { key: 'BAST' } : undefined,
].filter(Boolean) as { key: BAPPOrBAST }[]);
const type = ref<BAPPOrBAST>('BAPP');

async function handleResponse(response: FetchResponse<unknown>) {
  if (response.ok) {
    const { isValidated, isApproved, revisedAt, signedAt } = response._data as MappedWork;
    data.value!.isValidated = isValidated;
    data.value!.isApproved = isApproved;
    data.value!.revisedAt = revisedAt;
    data.value!.signedAt = signedAt;
  }
  await refreshNuxtData('datatable');
}

// REVIEW by Admin
const isLoading = ref(false);
const showAlertDialog = ref(false);
const approveOrReject = ref<ApproveOrReject>('approve');
function showAlertDialogApproveOrReject(type: ApproveOrReject) {
  showAlertDialog.value = true;
  approveOrReject.value = type;
}
async function handleApproveOrReject() {
  showAlertDialog.value = false;
  isLoading.value = true;

  await $fetch(`/api/documents/${id}/${approveOrReject.value}`, {
    method: 'PATCH',
    onResponseError: ({ response }) => {
      handleResponseError(response);

      isLoading.value = false;
    },
    onResponse: async ({ response }) => await handleResponse(response),
  })
    .catch(catchFetchError);

  isLoading.value = false;
}

// SIGN by SPV
const formSign = ref();
const showDialogSign = ref(false);
async function handleSign() {
  await $fetch(`/api/documents/${id}/sign`, {
    method: 'PATCH',
    body: { sign: formSign.value, name: supervisorName.value },
    onResponseError: ({ response }) => handleResponseError(response),
    onResponse: async ({ response }) => await handleResponse(response),
  })
    .catch(catchFetchError);

  showDialogSign.value = false;
}
</script>

<template>
  <div>
    <NuxtLayout name="documents">
      <template #body>
        <div
          v-if="data"
          class="h-screen overflow-auto bg-slate-100 print:h-full print:overflow-hidden"
        >
          <DocumentAction class="absolute right-5 top-40">
            <div
              v-if="hasAdminRole && !data.isValidated"
              class="flex justify-between space-x-4"
            >
              <ShadcnButton
                :disabled="isLoading"
                @click="() => showAlertDialogApproveOrReject('approve')"
              >
                Approve
              </ShadcnButton>
              <ShadcnButton
                variant="destructive"
                :disabled="isLoading"
                @click="() => showAlertDialogApproveOrReject('reject')"
              >
                Reject
              </ShadcnButton>
            </div>

            <ShadcnTooltipProvider
              v-if="isSupervisor && !data.signedAt"
              :disabled="!data.isValidated && !data.isApproved"
            >
              <ShadcnTooltip
                :open="!data.isValidated || !data.isApproved"
                :disable-closing-trigger="!data.isValidated || !data.isApproved"
              >
                <ShadcnTooltipTrigger as-child>
                  <ShadcnButton
                    :disabled="!data.isValidated || !data.isApproved"
                    @click="() => showDialogSign = true"
                  >
                    Sign
                  </ShadcnButton>
                </ShadcnTooltipTrigger>
                <ShadcnTooltipContent>
                  <div v-if="!data.isValidated">
                    <p class="text-red-500">
                      The admin hasn't reviewed this document yet.
                    </p>
                    <p class="font-bold">
                      This document is awaiting admin review before you can sign it.
                    </p>
                  </div>
                  <div v-else-if="!data.isApproved">
                    <p class="text-red-500">
                      The admin has rejected this document.
                    </p>
                    <p class="font-bold">
                      This document needs to be revised by the employee before you can sign it.
                    </p>
                  </div>
                </ShadcnTooltipContent>
              </ShadcnTooltip>
            </ShadcnTooltipProvider>
          </DocumentAction>

          <ShadcnAlertDialog v-model:open="showAlertDialog">
            <ShadcnAlertDialogContent>
              <ShadcnAlertDialogHeader>
                <ShadcnAlertDialogTitle>Final Confirmation</ShadcnAlertDialogTitle>
                <ShadcnAlertDialogDescription>
                  This action will permanently <span class="font-bold uppercase">{{ approveOrReject }}</span> the document. Please confirm before proceeding.
                </ShadcnAlertDialogDescription>
              </ShadcnAlertDialogHeader>
              <ShadcnAlertDialogFooter>
                <ShadcnAlertDialogCancel>Cancel</ShadcnAlertDialogCancel>
                <ShadcnAlertDialogAction @click="handleApproveOrReject">
                  Confirm
                </ShadcnAlertDialogAction>
              </ShadcnAlertDialogFooter>
            </ShadcnAlertDialogContent>
          </ShadcnAlertDialog>

          <DocumentDialogSign
            v-model:open="showDialogSign"
            v-model="formSign"
            @sign="handleSign"
          />

          <div class="container">
            <DocumentAlertStatus :status="data.status" />
          </div>
          <div class="grid place-content-center">
            <ShadcnTabs v-model="type">
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
                <DocumentContentHighlighted
                  v-if="hasAdminRole"
                  :type
                  :original="data.original"
                  :data="data.value"
                />
                <DocumentContent
                  v-else
                  :type
                  :data="data.value"
                />
              </ShadcnTabsContent>
            </ShadcnTabs>
          </div>
        </div>
      </template>
    </NuxtLayout>
  </div>
</template>
