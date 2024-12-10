<script setup lang="ts">
import { isValidDocumentType } from '~/lib/documents';
import { isString } from '~/lib/utils';

definePageMeta({
  layout: false,
  name: '[public] Mitra Document',
});

const route = useRoute();
const routeType = computed<string>(() => isString(route.params.type) ? route.params.type.toLowerCase() : '');
if (!isValidDocumentType(routeType.value)) throw createError({ statusCode: 404, fatal: true });

const { data, error } = await useFetch(
  `/api/documents/type/${routeType.value}/${route.params.id}`,
);
if (error.value) throw createError({ ...error.value, fatal: true });
const { data: dataOriginal, error: errorOriginal } = await useFetch(
  `/api/documents/type/original/${route.params.id}`,
);
if (errorOriginal.value) {
  console.error('unexpected error', errorOriginal.value);
  throw createError({ ...errorOriginal.value, fatal: true });
}

function gotoValidatePage() {
  navigateTo(`/documents/${routeType.value}/${route.params.id}`);
}
</script>

<template>
  <div>
    <NuxtLayout name="documents">
      <template #body>
        <div
          v-if="data && dataOriginal"
          class="h-screen overflow-auto bg-slate-100 print:h-full print:overflow-hidden"
        >
          <DocumentAction class="absolute right-5 top-5">
            <ShadcnTooltipProvider>
              <ShadcnTooltip
                open
                disable-closing-trigger
              >
                <ShadcnTooltipTrigger as-child>
                  <ShadcnButton
                    @click="gotoValidatePage"
                  >
                    Validate
                  </ShadcnButton>
                </ShadcnTooltipTrigger>
                <ShadcnTooltipContent>
                  <p class="font-bold">
                    This action is restricted to admins only.
                  </p>
                </ShadcnTooltipContent>
              </ShadcnTooltip>
            </ShadcnTooltipProvider>
          </DocumentAction>
          <div class="grid place-content-center">
            <DocumentContentBAPPHighlighted
              v-if="routeType === 'bapp'"
              :original="dataOriginal.value"
              :data="data.value"
            />
            <DocumentContentBASTHighlighted
              v-else
              :original="dataOriginal.value"
              :data="data.value"
            />
          </div>
        </div>
      </template>
    </NuxtLayout>
  </div>
</template>
