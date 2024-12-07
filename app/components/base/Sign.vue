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
const props = defineProps<{
  sign: Sign;
  signPad?: SignPad;
  class?: HTMLAttributes['class'];
}>();

const signUrl = defineModel<string>('url');
</script>

<template>
  <div :class="props.class">
    <div>
      <slot
        name="alias"
        :value="sign.alias"
      >
        {{ sign.alias }}
      </slot>
    </div>
    <div>
      <slot
        name="company"
        :value="sign.company"
      >
        {{ sign.company }}
      </slot>
    </div>
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
        class="size-[100px]"
      >
      <div
        v-else
        class="h-[100px]"
      />
    </div>
    <div class="underline decoration-2">
      <slot
        name="name"
        :value="sign.name"
      >
        {{ sign.name }}
      </slot>
    </div>
    <div class="font-normal italic">
      <slot
        name="role"
        :value="sign.role"
      >
        {{ sign.role }}
      </slot>
    </div>
  </div>
</template>
