<script setup lang="ts">
import { formatDate } from '@vueuse/core';
import { highlightLevel } from '~/components/base/field/const';
import type { WorkDocument } from '~~/types/schema/document';

defineProps<{ original: WorkDocument; data: WorkDocument }>();
</script>

<template>
  <DocumentContentBAST :data>
    <template #details-title="{ value }">
      <BaseFieldHighlight
        :value
        :class="[highlightLevel(original.detailsTitle, data.detailsTitle)]"
      />
    </template>
    <template #details-date-end="{ value }">
      <BaseFieldHighlight
        :value
        :class="[highlightLevel(original.detailsDateTsEnd, data.detailsDateTsEnd)]"
      >
        {{ formatDate(new Date(value), 'DD MMMM YYYY', { locales: 'id-ID' }) }}
      </BaseFieldHighlight>
    </template>
    <template #details-day-end="{ value }">
      <BaseFieldHighlight
        :value
        :class="[highlightLevel(original.detailsDateTsEnd, data.detailsDateTsEnd)]"
      >
        {{ formatDate(new Date(value), 'dddd', { locales: 'id-ID' }) }}
      </BaseFieldHighlight>
    </template>

    <template #bapp-number="{ value }">
      <BaseFieldHighlight
        :value
        :class="[highlightLevel(original.bappNumber, data.bappNumber)]"
      />
    </template>
    <template #bast-number="{ value }">
      <BaseFieldHighlight
        :value
        :class="[highlightLevel(original.bastNumber, data.bastNumber)]"
      />
    </template>
    <template #po-number="{ value }">
      <BaseFieldHighlight
        :value
        :class="[highlightLevel(original.poNumber, data.poNumber)]"
      />
    </template>

    <template #section-sign>
      <DocumentContentSectionSignHighlighted
        :original
        :employee="data"
      />
    </template>
    <template #section-participant>
      <DocumentContentSectionParticipantHighlighted
        :original
        :employee="data"
      />
    </template>
  </DocumentContentBAST>
</template>
