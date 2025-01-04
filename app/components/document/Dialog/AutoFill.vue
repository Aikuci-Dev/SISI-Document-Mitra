<script setup lang="ts">
import { z } from 'zod';
import { useForwardProps } from 'radix-vue';
import type { FormProps } from '../form/index.vue';
import type { WorkDocument } from '~~/types/schema/document';

const props = defineProps<FormProps>();
const forwardedProps = useForwardProps(props);

const form = defineModel<WorkDocument>();

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
    const worker = await Tesseract.createWorker();

    const { data: { text } } = await worker.recognize(imageUrl);
    convertedText.value = text;

    await worker.terminate();
  });
}

function handleUploadedPO() {
  triggerTesseract.value = true;
  convertToText(file.value);
}

watch(convertedText, (val) => {
  if (val.length) {
    form.value!.detailsTitle = val.match(/Jasa Pekerjaan\s+([^\n]+)/)?.[1] ?? 'FAILED to extract `title`';
    form.value!.invoiceNominal = val.match(/Rp\.\s*([\d,]+\.\d{2})/)?.[0] ?? 'FAILED to extract `price`';
    showForm.value = true;
  }
});

function handleGenerate() {
  console.log('generate');
}
</script>

<template>
  <ShadcnDialog>
    <ShadcnDialogContent class="sm:max-w-[425px]">
      <ShadcnDialogTitle>Upload Your PO</ShadcnDialogTitle>
      <ShadcnDialogDescription>
        Take a screenshot of your PO and upload it here to automatically fill out the form and generate your document.
      </ShadcnDialogDescription>

      <DocumentForm
        v-if="showForm"
        v-model="form"
        v-bind="forwardedProps"
        :show-non-editable-fields="false"
        @generate="handleGenerate"
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
            class="w-full"
            type="submit"
          >
            Next
          </ShadcnButton>
        </div>
      </ShadcnAutoForm>
    </ShadcnDialogContent>
  </ShadcnDialog>
</template>
