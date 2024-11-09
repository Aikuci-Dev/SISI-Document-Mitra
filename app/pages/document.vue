<script setup lang="ts">
definePageMeta({
  middleware: "auth",
});

const { user } = useUserSession();
</script>

<template>
  <div>DOCUMENT</div>
  <div>user - {{ user }}</div>
</template>
