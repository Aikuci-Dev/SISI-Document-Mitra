<script setup lang="ts" generic="T extends ZodRawShape">
import type { ZodAny, ZodObject, ZodRawShape } from 'zod';
import { FieldContextKey, useField } from 'vee-validate';
import { computed, provide } from 'vue';
import type { Shape } from '~/components/shadcn/ui/auto-form/interface';
import { getBaseSchema, getBaseType, getDefaultValueInZodStack } from '~/components/shadcn/ui/auto-form/utils';

const props = defineProps<{
  fieldName: string;
  required?: boolean;
  schema?: ZodObject<T>;
  disabled?: boolean;
}>();

const shapes = computed(() => {
  // @ts-expect-error ignore {} not assignable to object
  const val: { [key in keyof T]: Shape } = {};

  if (!props.schema)
    return;
  const shape = getBaseSchema(props.schema)?.shape;
  if (!shape)
    return;
  Object.keys(shape).forEach((name) => {
    const item = shape[name] as ZodAny;
    const baseItem = getBaseSchema(item) as ZodAny;
    let options = (baseItem && 'values' in baseItem._def) ? baseItem._def.values as string[] : undefined;
    if (!Array.isArray(options) && typeof options === 'object')
      options = Object.values(options);

    val[name as keyof T] = {
      type: getBaseType(item),
      default: getDefaultValueInZodStack(item),
      options,
      required: !['ZodOptional', 'ZodNullable'].includes(item._def.typeName),
      schema: item,
    };
  });
  return val;
});

const fieldContext = useField(props.fieldName);
// @ts-expect-error ignore missing `id`
provide(FieldContextKey, fieldContext);
</script>

<template>
  <section>
    <slot v-bind="props">
      <template
        v-for="(shape, key) in shapes"
        :key="key"
      >
        <slot
          :shape
          :name="key.toString()"
          :field-name="`${fieldName}.${key.toString()}`"
        >
          <ShadcnAutoFormField
            :field-name="`${fieldName}.${key.toString()}`"
            :label="shape.schema?.description || key.toString()"
            :shape="shape"
          />
        </slot>
      </template>
    </slot>
  </section>
</template>
