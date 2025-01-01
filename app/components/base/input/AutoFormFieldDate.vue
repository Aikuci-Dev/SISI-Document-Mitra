<script setup lang="ts">
import type { HTMLAttributes } from 'vue';
import { CalendarIcon } from 'lucide-vue-next';
import { DateFormatter, getLocalTimeZone } from '@internationalized/date';
import { cn } from '@/lib/utils';
import type { FieldProps } from '@/components/shadcn/ui/auto-form/interface';
import { beautifyObjectName } from '@/components/shadcn/ui/auto-form/utils';

const props = defineProps<FieldProps & { class?: HTMLAttributes['class'] }>();

const df = new DateFormatter('en-US', {
  dateStyle: 'long',
});
</script>

<template>
  <ShadcnFormField
    v-slot="slotProps"
    :name="fieldName"
  >
    <ShadcnFormItem :class="cn('w-full', props.class)">
      <ShadcnAutoFormLabel
        v-if="!config?.hideLabel"
        :required="required"
      >
        {{ config?.label || beautifyObjectName(label ?? fieldName) }}
      </ShadcnAutoFormLabel>
      <ShadcnFormControl>
        <slot v-bind="slotProps">
          <div>
            <ShadcnPopover>
              <ShadcnPopoverTrigger
                as-child
                :disabled="disabled"
              >
                <ShadcnButton
                  variant="outline"
                  :class="cn(
                    'w-full justify-start text-left font-normal',
                    !slotProps.componentField.modelValue && 'text-slate-500 dark:text-slate-400',
                  )"
                >
                  <CalendarIcon
                    class="mr-2 size-4"
                    :size="16"
                  />
                  {{ slotProps.componentField.modelValue ? df.format(slotProps.componentField.modelValue.toDate(getLocalTimeZone())) : "Pick a date" }}
                </ShadcnButton>
              </ShadcnPopoverTrigger>
              <ShadcnPopoverContent class="w-auto p-0">
                <ShadcnCalendar
                  initial-focus
                  v-bind="slotProps.componentField"
                />
              </ShadcnPopoverContent>
            </ShadcnPopover>
          </div>
        </slot>
      </ShadcnFormControl>

      <ShadcnFormDescription v-if="config?.description">
        {{ config.description }}
      </ShadcnFormDescription>
      <ShadcnFormMessage />
    </ShadcnFormItem>
  </ShadcnFormField>
</template>
