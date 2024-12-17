<script setup lang="ts">
definePageMeta({
  layout: false,
  name: '[public] Mitra Document',
});

const route = useRoute();

const { data, error } = await useFetch(
  `/api/documents/${route.params.id}`,
);
if (error.value) throw createError({ ...error.value, fatal: true });

function gotoValidatePage() {
  navigateTo(`/documents/${route.params.id}`);
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
              :original="data.original"
              :data="data.value"
            />
          </div>
        </div>
      </template>
    </NuxtLayout>
  </div>
</template>
