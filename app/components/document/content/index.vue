<script setup lang="ts">
import type { BAPPOrBAST } from '~~/types/document';
import type { WorkDocument } from '~~/types/schema/document';

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
