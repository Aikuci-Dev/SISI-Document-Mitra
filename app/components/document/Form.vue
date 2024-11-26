<script setup lang="ts">
import type { WorkDocument } from '~~/types/document';

type FormEmits = {
  generate: [value: { form: WorkDocument }];
};

defineEmits<FormEmits>();

const form = defineModel<WorkDocument>();
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
    <ShadcnCardFooter class="justify-end">
      <ShadcnButton
        v-if="form"
        @click="$emit('generate', { form })"
      >
        Generate
      </ShadcnButton>
    </ShadcnCardFooter>
  </ShadcnCard>
</template>
