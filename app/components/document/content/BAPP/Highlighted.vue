<script setup lang="ts">
import { formatDate } from '@vueuse/core';
import { highlightLevel } from '~/components/base/field/const';
import { formatCurrency } from '~/lib/utils';
import type { WorkDocument } from '~~/types/schema/document';

defineProps<{ original: WorkDocument; data: WorkDocument }>();
</script>

<template>
  <DocumentContentBAPP :data>
    <template #details-title="{ value }">
      <BaseFieldHighlight
        :value
        :class="[highlightLevel(original.detailsTitle, data.detailsTitle)]"
      />
    </template>
    <template #details-date-start="{ value }">
      <BaseFieldHighlight
        :value
        :class="[highlightLevel(original.detailsDateTsStart, data.detailsDateTsStart)]"
      >
        {{ formatDate(new Date(value), 'DD MMMM YYYY', { locales: 'id-ID' }) }}
      </BaseFieldHighlight>
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
    <template #po-number="{ value }">
      <BaseFieldHighlight
        :value
        :class="[highlightLevel(original.poNumber, data.poNumber)]"
      />
    </template>
    <template #invoice-number="{ value }">
      <BaseFieldHighlight
        :value
        :class="[highlightLevel(original.invoiceNumber, data.invoiceNumber)]"
      />
    </template>
    <template #invoice-nominal="{ value }">
      <BaseFieldHighlight
        :value
        :class="[highlightLevel(original.invoiceNominal, data.invoiceNominal)]"
      >
        {{ formatCurrency(value) }}
      </BaseFieldHighlight>
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
  </DocumentContentBAPP>
</template>
