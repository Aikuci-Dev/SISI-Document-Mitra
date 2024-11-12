<script setup lang="ts">
import type { FieldProps } from './interface'
import { Button } from '@/components/shadcn/ui/button'
import { Calendar } from '@/components/shadcn/ui/calendar'
import { FormControl, FormDescription, FormField, FormItem, FormMessage } from '@/components/shadcn/ui/form'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/shadcn/ui/popover'
import { cn } from '@/lib/utils'

import { DateFormatter, getLocalTimeZone } from '@internationalized/date'
import { CalendarIcon } from 'lucide-vue-next'
import AutoFormLabel from './AutoFormLabel.vue'
import { beautifyObjectName } from './utils'

defineProps<FieldProps>()

const df = new DateFormatter('en-US', {
  dateStyle: 'long',
})
</script>

<template>
  <FormField v-slot="slotProps" :name="fieldName">
    <FormItem>
      <AutoFormLabel v-if="!config?.hideLabel" :required="required">
        {{ config?.label || beautifyObjectName(label ?? fieldName) }}
      </AutoFormLabel>
      <FormControl>
        <slot v-bind="slotProps">
          <div>
            <Popover>
              <PopoverTrigger as-child :disabled="disabled">
                <Button
                  variant="outline"
                  :class="cn(
                    'tw-w-full tw-justify-start tw-text-left tw-font-normal',
                    !slotProps.componentField.modelValue && 'tw-text-slate-500 dark:tw-text-slate-400',
                  )"
                >
                  <CalendarIcon class="tw-mr-2 tw-h-4 tw-w-4" :size="16" />
                  {{ slotProps.componentField.modelValue ? df.format(slotProps.componentField.modelValue.toDate(getLocalTimeZone())) : "Pick a date" }}
                </Button>
              </PopoverTrigger>
              <PopoverContent class="tw-w-auto tw-p-0">
                <Calendar initial-focus v-bind="slotProps.componentField" />
              </PopoverContent>
            </Popover>
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
