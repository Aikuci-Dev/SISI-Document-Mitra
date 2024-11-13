<template>
  <div class="content">
    <slot />
  </div>
</template>

<style scoped>
.content {
  @apply tw-flex tw-flex-col tw-gap-8 tw-px-16 tw-py-24 tw-text-justify tw-leading-6;
}
</style>
