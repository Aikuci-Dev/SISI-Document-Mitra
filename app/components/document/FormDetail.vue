<script setup lang="ts"  generic="T extends ZodRawShape">
import type { ZodObject, ZodRawShape } from 'zod';
import type { Shape } from '~/components/shadcn/ui/auto-form/interface';

const props = defineProps<{
  fieldName: string;
  shape: Shape;
}>();

const delegatedProps = computed(() => {
  if (props.shape?.type === 'ZodObject')
    return { schema: props.shape?.schema as unknown as ZodObject<T> };
  return undefined;
});
</script>

<template>
  <ShadcnCard>
    <ShadcnCardHeader>
      <ShadcnCardTitle>Details</ShadcnCardTitle>
      <ShadcnCardDescription>
        The transaction details.
      </ShadcnCardDescription>
    </ShadcnCardHeader>
    <ShadcnCardContent>
      <BaseInputAutoFormFieldObject
        :field-name="fieldName"
        v-bind="delegatedProps"
      />
    </ShadcnCardContent>
  </ShadcnCard>
</template>
