<script setup lang="ts">
import type { HTMLAttributes } from 'vue';
import type { SignPad } from './input/InputSign.vue';

export interface Sign {
  name: string;
  alias: string;
  role: string;
  company: string;
  isSignPad?: boolean;
}

interface Props {
  sign: Sign;
  signPad?: SignPad;
  class?: HTMLAttributes['class'];
}

const props = defineProps<Props>();

const signUrl = defineModel<string>('url');
</script>

<template>
  <div :class="props.class">
    <div>{{ sign.alias }}</div>
    <div>{{ sign.company }}</div>
    <div class="flex justify-center">
      <NuxtSignaturePad
        v-if="sign.isSignPad"
        :height="signPad?.height || '100%'"
        :width="signPad?.width || '100%'"
        :options="{ penColor: signPad?.penColor || 'rgb(0,0,0)', backgroundColor: signPad?.backgroundColor || 'rgb(255, 255, 255)' }"
        :default-url="signUrl"
      />
      <img
        v-else-if="signUrl"
        :src="signUrl"
        class="size-[140px]"
      >
      <div
        v-else
        class="h-[140px]"
      />
    </div>
    <div class="underline decoration-2">
      {{ sign.name }}
    </div>
    <div class="font-normal italic">
      {{ sign.role }}
    </div>
  </div>
</template>
