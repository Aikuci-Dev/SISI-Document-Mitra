<script setup lang="ts">
import { Eye } from 'lucide-vue-next';

const showNonEditableFields = defineModel<boolean>('showNonEditableFields', { default: true });
</script>

<template>
  <ShadcnCard>
    <ShadcnCardHeader>
      <ShadcnCardTitle>
        <div class="flex items-center justify-between">
          Document Form
          <ShadcnToggle v-model:pressed="showNonEditableFields">
            <Eye class="size-4" />
          </ShadcnToggle>
        </div>
      </ShadcnCardTitle>
      <ShadcnCardDescription>
        The input used within the document to replace placeholders.
      </ShadcnCardDescription>
    </ShadcnCardHeader>
    <ShadcnCardContent>
      <slot />
    </ShadcnCardContent>
  </ShadcnCard>
</template>
