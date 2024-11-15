<template>
  <div class="tw-flex tw-max-h-screen tw-flex-col">
    <h1 class="tw-p-8 tw-text-4xl tw-font-bold tw-tracking-tight">
      <slot name="header" />
    </h1>
    <div class="tw-flex tw-min-h-screen tw-w-full tw-bg-slate-100">
      <div
        v-if="$slots.left"
        class="tw-flex-grow"
      >
        <slot name="left" />
      </div>
      <div class="tw-overflow-auto">
        <slot />
      </div>
      <div
        v-if="$slots.right"
        class="tw-flex-grow"
      >
        <slot name="right" />
      </div>
    </div>
  </div>
</template>
