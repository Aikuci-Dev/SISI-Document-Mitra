<script setup lang="ts">
useHead({
  link: [
    {
      rel: 'preconnect',
      href: 'https://fonts.googleapis.com',
    },
    {
      rel: 'preconnect',
      href: 'https://fonts.gstatic.com',
      crossorigin: '',
    },
    {
      rel: 'stylesheet',
      href: 'https://fonts.googleapis.com/css2?family=Montserrat:ital,wght@0,100..900;1,100..900&display=swap',
      crossorigin: '',
    },
  ],
});
</script>

<template>
  <BasePageA4 class="tw-font-montserrat">
    <div
      v-if="$slots.header"
      class="aik-header"
    >
      <slot name="header" />
    </div>
    <div
      v-if="$slots.body"
      class="aik-body"
    >
      <slot name="body" />
    </div>
    <template v-else>
      <slot />
    </template>
    <div
      v-if="$slots.footer"
      class="aik-footer"
    >
      <slot name="footer" />
    </div>
  </BasePageA4>
</template>

<style scoped>
.aik-header {
  @apply tw-text-center tw-text-[12pt] tw-font-bold;
}
.aik-body {
  @apply tw-flex tw-flex-col tw-space-y-4 tw-py-4 tw-text-[11pt];
}
.aik-footer {
}
</style>
