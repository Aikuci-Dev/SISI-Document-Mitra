<script setup lang="ts">
definePageMeta({
  layout: false,
});

const route = useRoute();

const { data, error } = await useFetch(
  `/api/documents/mitra/bapp/${route.params.id}`,
);

if (error.value) {
  throw createError({ ...error.value, fatal: true });
}
</script>

<template>
  <div>
    <NuxtLayout name="documents">
      <template #body>
        <div class="h-screen overflow-auto bg-slate-100 print:h-full print:overflow-hidden">
          <div class="grid place-content-center">
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
