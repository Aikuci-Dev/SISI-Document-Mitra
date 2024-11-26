<script setup lang="ts">
import type { HTMLAttributes } from 'vue';

export interface Sign {
  name: string;
  alias: string;
  role: string;
  company: string;
}

interface Props {
  sign: Sign;
  class?: HTMLAttributes['class'];
}

const props = defineProps<Props>();
</script>

<template>
  <div :class="props.class">
    <div>{{ sign.alias }}</div>
    <div>{{ sign.company }}</div>
    <!-- TODO: Implement Input Sign -->
    <div class="h-[140px]" />
    <div class="underline decoration-2">
      {{ sign.name }}
    </div>
    <div class="font-normal italic">
      {{ sign.role }}
    </div>
  </div>
</template>
