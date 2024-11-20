<template>
  <div class="aik-page">
    <BasePageContent>
      <slot />
    </BasePageContent>
  </div>
</template>

<style scoped>
@page {
  size: A4;
  margin: 0;
}

.aik-page {
  @apply tw-m-0 tw-h-[297mm] tw-w-[210mm] tw-border tw-border-black tw-bg-white tw-p-0 print:tw-border-none;
}
</style>
