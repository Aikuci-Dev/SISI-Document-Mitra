<script setup lang="ts">
import { toast } from '~/components/shadcn/ui/toast';
import { catchFetchError } from '~/lib/exceptions';
import { isString } from '~/lib/utils';

definePageMeta({
  layout: false,
});

const route = useRoute();
const routeType = computed<string>(() => isString(route.params.type) ? route.params.type.toLowerCase() : '');
if (!['bapp', 'bast'].includes(routeType.value)) navigateTo('/documents');

const { user } = useUserSession();
const { data, error, refresh } = await useFetch(
  `/api/documents/type/${routeType.value}/${route.params.id}`,
);
if (error.value) throw createError({ ...error.value, fatal: true });
const hasAdmin = computed(() => user.value?.role?.includes('admin'));
const supervisorName = computed(() => data.value?.value.employee.supervisor.name);

// REVIEW by Admin
const isLoading = ref(false);
async function handleApproveOrReject(type: 'approve' | 'reject') {
  isLoading.value = true;

  await $fetch(`/api/documents/type/${routeType.value}/${route.params.id}/${type}`, {
    method: 'PATCH',
    onResponseError: ({ response }) => {
      const messages = response.statusText.split('>>');
      toast({
        title: messages[0]?.trim(),
        description: messages[1]?.trim(),
        variant: 'destructive',
      });

      isLoading.value = false;
    },
  })
    .catch(catchFetchError);

  refresh();

  isLoading.value = false;
}
async function handleApprove() {
  handleApproveOrReject('approve');
}
async function handleReject() {
  handleApproveOrReject('reject');
}

// SIGN by SPV
const formSign = ref();
const showDialogSign = ref(false);
async function handleSign() {
  await $fetch(`/api/documents/type/${routeType.value}/${route.params.id}/sign`, {
    method: 'PATCH',
    body: { sign: formSign.value, name: supervisorName.value },
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

  refresh();

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
          <DocumentAction class="absolute right-5 top-5">
            <div
              v-if="hasAdmin && !data.isValidated"
              class="flex justify-between space-x-4"
            >
              <ShadcnButton
                :disabled="isLoading"
                @click="handleApprove"
              >
                Approve
              </ShadcnButton>
              <ShadcnButton
                variant="destructive"
                :disabled="isLoading"
                @click="handleReject"
              >
                Reject
              </ShadcnButton>
            </div>

            <ShadcnTooltipProvider
              v-if="user?.name === supervisorName"
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

          <DocumentDialogSign
            v-model:open="showDialogSign"
            v-model="formSign"
            @sign="handleSign"
          />

          <div class="grid place-content-center">
            <template v-if="routeType === 'bapp'">
              <DocumentContentBAPPHighlighted
                v-if="hasAdmin"
                :original="data.original"
                :data="data.value"
              />
              <DocumentContentBAPP
                v-else
                :data="data.value"
              />
            </template>
            <template v-else>
              <DocumentContentBASTHighlighted
                v-if="hasAdmin"
                :original="data.original"
                :data="data.value"
              />
              <DocumentContentBAST
                v-else
                :data="data.value"
              />
            </template>
          </div>
        </div>
      </template>
    </NuxtLayout>
  </div>
</template>
