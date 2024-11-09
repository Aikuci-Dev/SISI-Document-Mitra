<script setup lang="ts">
const { user } = useUserSession();
</script>

<template>
  <div>DOCUMENT</div>
  <div>user - {{ user }}</div>
</template>
