<script setup lang="ts">
import { toast } from '~/components/shadcn/ui/toast';

definePageMeta({
  layout: false,
});

const route = useRoute();
const routeId = computed(() => route.params.id);

const { data, error, refresh } = await useFetch(
  `/api/documents/mitra/bast/${routeId.value}`,
);

if (error.value) {
  throw createError({ ...error.value, fatal: true });
}

const formSign = ref();
const showDialogSign = ref(false);

async function handleSign() {
  await $fetch(`/api/documents/mitra/bast/${routeId.value}/sign`, {
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
          <DocumentAction class="absolute right-5 top-5">
            <ShadcnTooltipProvider :disabled="!!data?.isValid">
              <ShadcnTooltip
                :open="!data?.isValid"
                :disable-closing-trigger="!data?.isValid"
              >
                <ShadcnTooltipTrigger as-child>
                  <ShadcnButton
                    :disabled="!data?.isValid"
                    @click="() => showDialogSign = true"
                  >
                    Sign
                  </ShadcnButton>
                </ShadcnTooltipTrigger>
                <ShadcnTooltipContent>
                  <p class="font-bold">
                    Please contact an admin to check if the document is valid.
                  </p>
                  <p class="text-red-500">
                    You can't sign this document because it hasn't been validated by an admin.
                  </p>
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

            <!-- @vue-expect-error 'bast' is defined and not undefined. -->
            <DocumentContentBAST
              v-if="data?.value"
              :data="data?.value"
            />
          </div>
        </div>
      </template>
    </NuxtLayout>
  </div>
</template>
