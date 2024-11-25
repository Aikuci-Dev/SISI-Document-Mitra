<script setup lang="ts">
type FormEmits = {
  generate: [value: unknown];
};

defineEmits<FormEmits>();

const form = defineModel<unknown>();
</script>

<template>
  <ShadcnCard>
    <ShadcnCardHeader>
      <ShadcnCardTitle>Document Form</ShadcnCardTitle>
      <ShadcnCardDescription>
        The input used within the document to replace placeholders.
      </ShadcnCardDescription>
    </ShadcnCardHeader>
    <ShadcnCardContent>
      <div>TODO: Create Form</div>
      <pre>form - {{ form }}</pre>
    </ShadcnCardContent>
    <ShadcnCardFooter class="tw-justify-end">
      <ShadcnButton @click="$emit('generate', { form })">
        Generate
      </ShadcnButton>
    </ShadcnCardFooter>
  </ShadcnCard>
</template>
