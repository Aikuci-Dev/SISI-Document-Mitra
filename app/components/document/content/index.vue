<script setup lang="ts">
import type { WorkDocument } from '~~/shared/types/schema/document';

defineProps<{ type: BAPPOrBAST; data: WorkDocument }>();
</script>

<template>
  <DocumentContentBAPP
    v-if="type === 'BAPP'"
    :data
  />
  <DocumentContentBAST
    v-else
    :data
  />
</template>
