<script setup lang="ts">
import type { HTMLAttributes } from 'vue';
import { cn } from '@/lib/utils';

const props = defineProps<{
  class?: HTMLAttributes['class'];
}>();
</script>

<template>
  <ShadcnCard :class="cn('sticky right-0 top-0', props.class)">
    <ShadcnCardContent class="p-4">
      <div class="flex flex-col gap-4">
        <slot />
      </div>
    </ShadcnCardContent>
  </ShadcnCard>
</template>
