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

const signUrl = defineModel<string>('url');

const signatureOptions = reactive({
  penColor: props.penColor,
  backgroundColor: props.backgroundColor,
});
const signature = ref();

const handleLoadFromDataURL = (url: string) => {
  return signature.value.fromDataURL(url);
};
function handleSignatureSave() {
  console.log(signature.value.saveSignature());
  console.log(signature.value.isCanvasEmpty());
}
function handleSignatureUndo() {
  return signature.value.undo();
}
function handleSignatureClear() {
  return signature.value.clearCanvas();
}
</script>

<template>
  <div class="border-4 bg-white">
    <div class="relative border-b-2">
      <NuxtSignaturePad
        ref="signature"
        :height
        :width
        :options="signatureOptions"
        :default-url="signUrl"
      />

      <div class="absolute right-0 top-0">
        <ShadcnButton
          variant="ghost"
          @click="handleLoadFromDataURL(signUrl!)"
        >
          Load
        </ShadcnButton>
      </div>
    </div>
    <div class="flex h-9 justify-around">
      <ShadcnButton
        variant="ghost"
        @click="handleSignatureClear"
      >
        Clear
      </ShadcnButton>
      <ShadcnSeparator orientation="vertical" />
      <ShadcnButton
        variant="ghost"
        @click="handleSignatureUndo"
      >
        Undo
      </ShadcnButton>
      <ShadcnSeparator orientation="vertical" />
      <ShadcnButton
        variant="ghost"
        @click="handleSignatureSave"
      >
        Save
      </ShadcnButton>
    </div>
  </div>
</template>
