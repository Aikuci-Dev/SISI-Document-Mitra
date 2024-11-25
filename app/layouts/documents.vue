<script setup lang="ts">
const header = ref<HTMLElement>();
const bodyHeader = ref<HTMLElement>();
const footer = ref<HTMLElement>();

const getHeaderOffsetHeight = computed(() => header.value?.offsetHeight || 0);
const getBodyHeaderOffsetHeight = computed(
  () => bodyHeader.value?.offsetHeight || 0,
);
const getFooterOffsetHeight = computed(() => footer.value?.offsetHeight || 0);
</script>

<template>
  <div>
    <div
      v-if="$slots.header"
      ref="header"
      class="tw-bg-white tw-p-8"
    >
      <h1 class="tw-text-4xl tw-font-bold tw-tracking-tight">
        <slot name="header" />
      </h1>
    </div>
    <div>
      <div
        v-if="$slots.bodyHeader"
        ref="bodyHeader"
      >
        <slot name="bodyHeader" />
      </div>
      <div
        class="tw-overflow-auto tw-bg-slate-100"
        :style="{
          height: `calc(100vh - ${getBodyHeaderOffsetHeight}px - ${getHeaderOffsetHeight}px - ${getFooterOffsetHeight}px)`,
        }"
      >
        <div class="tw-flex">
          <div
            v-if="$slots.bodyLeft"
            class="tw-m-5 tw-ml-0"
          >
            <slot name="bodyLeft" />
          </div>
          <div
            v-if="$slots.bodyContent"
            class="tw-max-w-[100vw] tw-grow"
          >
            <slot name="bodyContent" />
          </div>
          <template v-else>
            <slot />
          </template>
          <div
            v-if="$slots.bodyRight"
            class="tw-m-5 tw-mr-0"
          >
            <slot name="bodyRight" />
          </div>
        </div>
      </div>
      <template v-if="$slots.bodyFooter">
        <slot name="bodyFooter" />
      </template>
    </div>
    <div
      v-if="$slots.footer"
      ref="footer"
      class="tw-sticky tw-bottom-0 tw-bg-white"
    >
      <slot name="footer" />
    </div>
  </div>
</template>
