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
        :class="[highlightLevel(original.details.title, data.details.title)]"
      />
    </template>
    <template #details-date-end="{ value }">
      <BaseFieldHighlight
        :value
        :class="[highlightLevel(original.details.date.ts.end, data.details.date.ts.end)]"
      >
        {{ formatDate(new Date(value), 'DD MMMM YYYY', { locales: 'id-ID' }) }}
      </BaseFieldHighlight>
    </template>
    <template #details-day-end="{ value }">
      <BaseFieldHighlight
        :value
        :class="[highlightLevel(original.details.date.ts.end, data.details.date.ts.end)]"
      >
        {{ formatDate(new Date(value), 'dddd', { locales: 'id-ID' }) }}
      </BaseFieldHighlight>
    </template>

    <template #bapp-number="{ value }">
      <BaseFieldHighlight
        :value
        :class="[highlightLevel(original.bapp.number, data.bapp.number)]"
      />
    </template>
    <template #bast-number="{ value }">
      <BaseFieldHighlight
        :value
        :class="[highlightLevel(original.bast!.number, data.bast!.number)]"
      />
    </template>
    <template #po-number="{ value }">
      <BaseFieldHighlight
        :value
        :class="[highlightLevel(original.po.number, data.po.number)]"
      />
    </template>

    <template #section-sign>
      <DocumentContentSectionSignHighlighted
        :original="original.employee"
        :employee="data.employee"
      />
    </template>
    <template #section-participant>
      <DocumentContentSectionParticipantHighlighted
        :original="original.employee"
        :employee="data.employee"
      />
    </template>
  </DocumentContentBAST>
</template>
