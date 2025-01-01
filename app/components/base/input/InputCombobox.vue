<script setup lang="ts">
import type { HTMLAttributes } from 'vue';
import { useForwardProps } from 'radix-vue';
import { Check, ChevronsUpDown } from 'lucide-vue-next';
import { cn } from '@/lib/utils';
import type { FieldProps } from '@/components/shadcn/ui/auto-form';

export interface Item { label: string; value: string }

const props = defineProps<FieldProps & { class?: HTMLAttributes['class']; items: Item[] }>();

const delegatedProps = computed(() => {
  const { class: _class, items: _items, ...delegated } = props;

  return delegated;
});

const forwardedProps = useForwardProps(delegatedProps);

const value = defineModel<string>();
const searchTerm = ref<string>('');

const itemsWithCurrent = computed(() =>
  [
    ...props.items,
    value.value?.length ? { label: value.value, value: value.value } : undefined,
    searchTerm.value.length ? { label: searchTerm.value, value: searchTerm.value } : undefined,
  ]
    .filter(Boolean) as Item[],
);

function handleSelectItem(item: Item) {
  searchTerm.value = '';
  value.value = item.value;
}
</script>

<template>
  <ShadcnAutoFormFieldInput
    v-bind="forwardedProps"
    :class="cn('w-full', props.class)"
  >
    <template #default="slotProps">
      <pre>slotProps - {{ slotProps }}</pre>
      <ShadcnPopover>
        <ShadcnPopoverTrigger as-child>
          <ShadcnFormControl>
            <ShadcnButton
              variant="outline"
              role="combobox"
              :class="cn('w-[200px] justify-between', !value && 'text-muted-foreground')"
            >
              {{ value ? itemsWithCurrent.find((item) => item.value === value)?.label : 'Select item...' }}
              <ChevronsUpDown class="ml-2 size-4 shrink-0 opacity-50" />
            </ShadcnButton>
          </ShadcnFormControl>
        </ShadcnPopoverTrigger>
        <ShadcnPopoverContent class="w-[200px] p-0">
          <ShadcnCommand v-model:search-term="searchTerm">
            <ShadcnCommandInput />
            <ShadcnCommandEmpty />
            <ShadcnCommandList>
              <ShadcnCommandGroup>
                <ShadcnCommandItem
                  v-for="item in itemsWithCurrent"
                  :key="item.value"
                  :value="item.label"
                  @select="() => handleSelectItem(item)"
                >
                  <Check :class="cn('mr-2 h-4 w-4', item.value === value ? 'opacity-100' : 'opacity-0')" />
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
