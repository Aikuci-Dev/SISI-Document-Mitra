<script setup lang="ts">
import type { HTMLAttributes } from 'vue';

const props = defineProps<{ value: unknown; class: HTMLAttributes['class'] }>();
</script>

<template>
  <span
    class="print:bg-white print:text-black"
    :class="props.class"
  >
    <slot>
      {{ value }}
    </slot>
  </span>
</template>
