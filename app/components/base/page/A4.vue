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
  @apply m-0 h-[297mm] w-[210mm] border border-black bg-white p-0 print:border-none;
}
</style>
