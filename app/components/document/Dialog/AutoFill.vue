<script setup lang="ts">
import { z } from 'zod';
import { useForwardProps } from 'radix-vue';
import { Loader2 } from 'lucide-vue-next';
import type { FormEmits, FormProps } from '@/components/document/form/index.vue';
import type { WorkDocument } from '~~/types/schema/document';
import type { Item } from '~/components/base/input/InputCombobox.vue';

const file = ref('');
const showForm = ref(false);

const schema = z.object({
  file: z.string(),
});

// Tesseract
export interface TesseractWorker {
  recognize: (image: string) => Promise<{ data: { text: string } }>;
  terminate: () => Promise<void>;
}
export interface TesseractApi {
  Tesseract: {
    createWorker: () => Promise<TesseractWorker>;
  };
}
declare global {
  interface Window {
    Tesseract: TesseractApi['Tesseract'];
  }
}

const triggerTesseract = ref(false);
const convertedText = ref('');
const isConverting = ref(false);
const { onLoaded } = useScript<TesseractApi>(
  'https://cdn.jsdelivr.net/npm/tesseract.js@5/dist/tesseract.min.js',
  {
    trigger: triggerTesseract,
    use() {
      return { Tesseract: window.Tesseract };
    },
  },
);
function convertToText(imageUrl: string) {
  onLoaded(async ({ Tesseract }) => {
    isConverting.value = true;
    const worker = await Tesseract.createWorker();

    const { data: { text } } = await worker.recognize(imageUrl);
    convertedText.value = text;

    await worker.terminate();
    isConverting.value = false;
  });
}

function handleUploadedPO() {
  triggerTesseract.value = true;
  convertToText(file.value);
}

const open = defineModel<boolean>('open');
const form = defineModel<WorkDocument>();
const formItems = ref({ title: [] as Item[], nominal: [] as Item[] });
const MESSAGE = {
  FAILED_EXTRACT_TITLE: 'FAILED to extract `title`',
  FAILED_EXTRACT_PRICE: 'FAILED to extract `price`',
};
watch(convertedText, (val) => {
  if (val.length) {
    const title = val.match(/Jasa Pekerjaan\s+([^\n]+)/)?.[1] ?? MESSAGE.FAILED_EXTRACT_TITLE;
    const nominal = val.match(/Rp\.\s*([\d,]+)/)?.[0] ?? MESSAGE.FAILED_EXTRACT_PRICE;
    formItems.value.title[0] = { label: title, value: title };
    formItems.value.nominal[0] = { label: nominal, value: nominal };
    showForm.value = true;
  }
});
watch(open, () => {
  convertedText.value = '';
  showForm.value = false;
});

defineEmits<FormEmits>();
const props = defineProps<Omit<FormProps, 'items'>>();
const delegatedProps = computed(() => ({ props, items: formItems }));
const forwardedProps = useForwardProps(delegatedProps);
</script>

<template>
  <ShadcnDialog v-model:open="open">
    <ShadcnDialogContent class="sm:max-w-[425px]">
      <ShadcnDialogTitle>Upload Your PO</ShadcnDialogTitle>
      <ShadcnDialogDescription>
        Take a screenshot of your PO and upload it here to automatically fill out the form and generate your document.
      </ShadcnDialogDescription>

      <DocumentForm
        v-if="showForm"
        v-model="form"
        v-bind="forwardedProps"
        :items="formItems"
        :removed-items="{ title: [MESSAGE.FAILED_EXTRACT_TITLE], nominal: [MESSAGE.FAILED_EXTRACT_PRICE] }"
        :show-non-editable-fields="false"
        @generate="$emit('generate')"
      />

      <ShadcnAutoForm
        v-else
        :schema
        @submit="handleUploadedPO"
      >
        <template #file="slotProps">
          <ShadcnAutoFormFieldFile
            v-model="file"
            v-bind="slotProps"
          />
        </template>

        <div class="mt-2 flex justify-end">
          <ShadcnButton
            type="submit"
            :disabled="isConverting"
          >
            <Loader2
              v-if="isConverting"
              class="mr-2 size-4 animate-spin"
            />
            {{ isConverting ? 'Converting' : 'Next' }}
          </ShadcnButton>
        </div>
      </ShadcnAutoForm>
    </ShadcnDialogContent>
  </ShadcnDialog>
</template>
