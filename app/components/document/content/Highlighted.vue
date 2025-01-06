<script setup lang="ts">
import { formatDate } from '@vueuse/core';
import { highlightLevel } from '~/components/base/field/const';
import { formatCurrency } from '~/lib/utils';
import type { BAPPOrBAST } from '~~/types/document';
import type { WorkDocument } from '~~/types/schema/document';

defineProps<{ type: BAPPOrBAST; original: WorkDocument; data: WorkDocument }>();
</script>

<template>
  <DocumentContentBAPP
    v-if="type === 'BAPP'"
    :data
  >
    <template #details-title="{ value }">
      <BaseFieldHighlight
        :value
        :class="[highlightLevel(original.detailsTitle, data.detailsTitle)]"
      />
    </template>
    <template #details-date-start="{ value }">
      <BaseFieldHighlight
        :value
        :class="[highlightLevel(original.detailsDateStart, data.detailsDateStart)]"
      >
        {{ formatDate(new Date(value), 'DD MMMM YYYY', { locales: 'id-ID' }) }}
      </BaseFieldHighlight>
    </template>
    <template #details-date-end="{ value }">
      <BaseFieldHighlight
        :value
        :class="[highlightLevel(original.detailsDateEnd, data.detailsDateEnd)]"
      >
        {{ formatDate(new Date(value), 'DD MMMM YYYY', { locales: 'id-ID' }) }}
      </BaseFieldHighlight>
    </template>
    <template #details-day-end="{ value }">
      <BaseFieldHighlight
        :value
        :class="[highlightLevel(original.detailsDateEnd, data.detailsDateEnd)]"
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

  <DocumentContentBAST
    v-else
    :data
  >
    <template #details-title="{ value }">
      <BaseFieldHighlight
        :value
        :class="[highlightLevel(original.detailsTitle, data.detailsTitle)]"
      />
    </template>
    <template #details-date-end="{ value }">
      <BaseFieldHighlight
        :value
        :class="[highlightLevel(original.detailsDateEnd, data.detailsDateEnd)]"
      >
        {{ formatDate(new Date(value), 'DD MMMM YYYY', { locales: 'id-ID' }) }}
      </BaseFieldHighlight>
    </template>
    <template #details-day-end="{ value }">
      <BaseFieldHighlight
        :value
        :class="[highlightLevel(original.detailsDateEnd, data.detailsDateEnd)]"
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
