<template>
  <div class="aik-content">
    <slot />
  </div>
</template>

<style scoped>
.aik-content {
  @apply flex flex-col space-y-8 px-16 py-24 text-justify leading-6;
}
</style>
