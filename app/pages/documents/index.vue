<script setup lang="ts">
definePageMeta({
  middleware: ["auth", "dashboard"],
});

// `user` is guaranteed to exist, as it's handled by middleware.
const { user } = useUserSession();

const { data: mitra } = await useFetch(
  `/api/documents/mitra/${user.value!.name}`,
  { watch: [user], immediate: true }
);
</script>

<template>
  <div>Document Mitra</div>
  <div>user - {{ user }}</div>
  <div>mitra - {{ mitra || { headers: [], values: [] } }}</div>

  <!-- TODO: Create `DataTable` Reusable Component -->
</template>
