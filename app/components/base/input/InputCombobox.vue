<script setup lang="ts">
import type { HTMLAttributes } from 'vue';
import { useForwardProps } from 'radix-vue';
import { Check, ChevronsUpDown } from 'lucide-vue-next';
import { cn } from '@/lib/utils';
import type { FieldProps } from '@/components/shadcn/ui/auto-form';

export interface Item { label: string; value: string }

const props = defineProps<FieldProps & { items: Item[]; class?: HTMLAttributes['class']; placeholder?: string }>();

const delegatedProps = computed(() => {
  const { class: _class, items: _items, ...delegated } = props;

  return delegated;
});

const forwardedProps = useForwardProps(delegatedProps);

const value = defineModel<string>({ default: '' });
const searchTerm = ref<string>('');

const itemsWithCurrent = computed(() => {
  const itemsMap = new Map(props.items.map(item => [item.value, item]));

  if (value.value.length) itemsMap.set(value.value, { label: value.value, value: value.value });
  if (searchTerm.value.length) itemsMap.set(searchTerm.value, { label: searchTerm.value, value: searchTerm.value });

  return Array.from(itemsMap, ([_key, item]) => item);
},
);
</script>

<template>
  <ShadcnAutoFormFieldInput
    v-bind="forwardedProps"
    :class="cn('w-full', props.class)"
  >
    <template #default="slotProps">
      <ShadcnPopover class="flex">
        <ShadcnPopoverTrigger as-child>
          <ShadcnFormControl>
            <ShadcnButton
              variant="outline"
              role="combobox"
              :class="cn('w-full justify-between', !slotProps.componentField.modelValue && 'text-muted-foreground')"
              @click="() => searchTerm = value"
            >
              {{ slotProps.componentField.modelValue.length ? itemsWithCurrent.find((item) => item.value === slotProps.componentField.modelValue)?.label : placeholder || 'Select item...' }}
              <ChevronsUpDown class="ml-2 size-4 shrink-0 opacity-50" />
            </ShadcnButton>
          </ShadcnFormControl>
        </ShadcnPopoverTrigger>
        <ShadcnPopoverContent class="p-0">
          <ShadcnCommand
            v-bind="slotProps.componentField"
            v-model:search-term="searchTerm"
          >
            <ShadcnCommandInput />
            <ShadcnCommandEmpty />
            <ShadcnCommandList>
              <ShadcnCommandGroup>
                <ShadcnCommandItem
                  v-for="item in itemsWithCurrent"
                  :key="item.value"
                  :value="item.label"
                  @select="() => { searchTerm = ''; }"
                >
                  <Check :class="cn('mr-2 size-4', item.value === slotProps.componentField.modelValue ? 'opacity-100' : 'opacity-0')" />
                  {{ item.label }}
                </ShadcnCommandItem>
              </ShadcnCommandGroup>
            </ShadcnCommandList>
          </ShadcnCommand>
        </ShadcnPopoverContent>
      </ShadcnPopover>
    </template>
  </ShadcnAutoFormFieldInput>
</template>
