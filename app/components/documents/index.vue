<script setup lang="ts">
// https://nuxt.com/docs/getting-started/seo-meta#external-css
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
    <BasePageContent>
      <div
        v-if="$slots.header"
        class="header"
      >
        <slot name="header" />
      </div>
      <div
        v-if="$slots.default"
        class="body"
      >
        <slot />
      </div>
      <div
        v-if="$slots.footer"
        class="footer"
      >
        <slot name="footer" />
      </div>
    </BasePageContent>
  </BasePageA4>
</template>

<style scoped>
.header {
  @apply tw-text-center tw-text-[12pt] tw-font-bold;
}
.body {
  @apply tw-flex tw-flex-col tw-gap-4 tw-py-4 tw-text-[11pt];
}
.footer {
}

ul {
  @apply tw-list-disc;
}
</style>
