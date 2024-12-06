<script setup lang="ts">
import { toast } from '~/components/shadcn/ui/toast';

definePageMeta({
  layout: false,
});

const route = useRoute();
const routeId = computed(() => route.params.id);

const { data, error, refresh } = await useFetch(
  `/api/documents/mitra/bapp/${routeId.value}`,
);

if (error.value) {
  throw createError({ ...error.value, fatal: true });
}

const formSign = ref();
const showDialogSign = ref(false);

async function handleSign() {
  await $fetch(`/api/documents/mitra/bapp/${routeId.value}/sign`, {
    method: 'PATCH',
    body: { sign: formSign.value, name: data.value?.value.employee.supervisor.name },
    onResponseError: ({ response }) => {
      const messages = response.statusText.split('>>');
      toast({
        title: messages[0]?.trim(),
        description: messages[1]?.trim(),
        variant: 'destructive',
      });
    },
  });

  refresh();

  showDialogSign.value = false;
}
</script>

<template>
  <div>
    <NuxtLayout name="documents">
      <template #body>
        <div class="h-screen overflow-auto bg-slate-100 print:h-full print:overflow-hidden">
          <!-- TODO-Last: Test this -->
          <DocumentAction class="absolute right-5 top-5">
            <ShadcnTooltipProvider :disabled="!data?.isValidated && !data?.isApproved">
              <ShadcnTooltip
                :open="!data?.isValidated || !data?.isApproved"
                :disable-closing-trigger="!data?.isValidated || !data?.isApproved"
              >
                <ShadcnTooltipTrigger as-child>
                  <ShadcnButton
                    :disabled="!data?.isValidated || !data?.isApproved"
                    @click="() => showDialogSign = true"
                  >
                    Sign
                  </ShadcnButton>
                </ShadcnTooltipTrigger>
                <ShadcnTooltipContent>
                  <div v-if="!data?.isValidated">
                    <p class="text-red-500">
                      The admin hasn't reviewed this document yet.
                    </p>
                    <p class="font-bold">
                      This document is awaiting admin review before you can sign it.
                    </p>
                  </div>
                  <div v-else-if="!data?.isApproved">
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
          <div class="grid place-content-center">
            <DocumentDialogSign
              v-model:open="showDialogSign"
              v-model="formSign"
              @sign="handleSign"
            />

            <DocumentContentBAPP
              v-if="data?.value"
              :data="data?.value"
            />
          </div>
        </div>
      </template>
    </NuxtLayout>
  </div>
</template>
