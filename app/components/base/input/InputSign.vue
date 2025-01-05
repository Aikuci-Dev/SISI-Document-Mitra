<script setup lang="ts">
export interface SignPad {
  width?: string;
  height?: string;
  penColor?: string;
  backgroundColor?: string;
}
const props = withDefaults(defineProps<SignPad>(), {
  width: '100%',
  height: '100%',
  penColor: 'rgb(0,0,0)',
  backgroundColor: 'rgb(255, 255, 255)',
});

type SignEmits = {
  save: [];
  undo: [];
  clear: [];
};
const emits = defineEmits<SignEmits>();

const signUrl = defineModel<string>('url');

const signatureOptions = reactive({
  penColor: props.penColor,
  backgroundColor: props.backgroundColor,
});
const signature = ref();

function handleSignatureSave() {
  if (signature.value.isCanvasEmpty()) signUrl.value = '';
  else signUrl.value = signature.value.saveSignature();
  emits('save');
}
function handleSignatureUndo() {
  signature.value.undo();
  emits('undo');
  return;
}
function handleSignatureClear() {
  signature.value.clearCanvas();
  emits('clear');
  return;
}
</script>

<template>
  <div class="border-4 bg-white">
    <div class="border-b-2">
      <NuxtSignaturePad
        ref="signature"
        :height
        :width
        :options="signatureOptions"
        :default-url="signUrl"
      />
    </div>
    <div class="flex h-9 justify-around">
      <ShadcnButton
        type="button"
        variant="ghost"
        @click="handleSignatureClear"
      >
        Clear
      </ShadcnButton>
      <ShadcnSeparator orientation="vertical" />
      <ShadcnButton
        type="button"
        variant="ghost"
        @click="handleSignatureUndo"
      >
        Undo
      </ShadcnButton>
      <ShadcnSeparator orientation="vertical" />
      <ShadcnButton
        type="button"
        variant="ghost"
        @click="handleSignatureSave"
      >
        Save
      </ShadcnButton>
    </div>
  </div>
</template>
