<script setup lang="ts">
import type { FieldProps } from "./interface";
import { Button } from "@/components/shadcn/ui/button";
import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/shadcn/ui/form";
import { Input } from "@/components/shadcn/ui/input";
import { TrashIcon } from "lucide-vue-next";
import { ref } from "vue";
import AutoFormLabel from "./AutoFormLabel.vue";
import { beautifyObjectName } from "./utils";

defineProps<FieldProps>();

const inputFile = ref<File>();
async function parseFileAsString(file: File | undefined): Promise<string> {
  return new Promise((resolve, reject) => {
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        resolve(reader.result as string);
      };
      reader.onerror = (err) => {
        reject(err);
      };
      reader.readAsDataURL(file);
    }
  });
}
</script>

<template>
  <FormField v-slot="slotProps" :name="fieldName">
    <FormItem v-bind="$attrs">
      <AutoFormLabel v-if="!config?.hideLabel" :required="required">
        {{ config?.label || beautifyObjectName(label ?? fieldName) }}
      </AutoFormLabel>
      <FormControl>
        <slot v-bind="slotProps">
          <Input
            v-if="!inputFile"
            type="file"
            v-bind="{ ...config?.inputProps }"
            :disabled="disabled"
            @change="
              async (ev: InputEvent) => {
                const file = (ev.target as HTMLInputElement).files?.[0];
                inputFile = file;
                const parsed = await parseFileAsString(file);
                slotProps.componentField.onInput(parsed);
              }
            "
          />
          <div
            v-else
            class="tw-flex tw-h-10 tw-w-full tw-items-center tw-justify-between tw-rounded-md tw-border tw-border-slate-200 tw-bg-transparent tw-py-1 tw-pl-3 tw-pr-1 tw-text-sm tw-shadow-sm tw-transition-colors dark:tw-border-slate-800"
          >
            <p>{{ inputFile?.name }}</p>
            <Button
              :size="'icon'"
              :variant="'ghost'"
              class="tw-h-[26px] tw-w-[26px]"
              aria-label="Remove file"
              type="button"
              @click="
                () => {
                  inputFile = undefined;
                  slotProps.componentField.onInput(undefined);
                }
              "
            >
              <TrashIcon :size="16" />
            </Button>
          </div>
        </slot>
      </FormControl>
      <FormDescription v-if="config?.description">
        {{ config.description }}
      </FormDescription>
      <FormMessage />
    </FormItem>
  </FormField>
</template>
