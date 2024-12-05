<script setup lang="ts">
import { formatDate } from '@vueuse/core';
import { highlightLevel } from '~/components/base/field/const';
import { formatCurrency } from '~/lib/utils';

definePageMeta({
  layout: false,
});

const route = useRoute();

const { data, error } = await useFetch(
  `/api/documents/mitra/bapp/${route.params.id}`,
);

if (error.value) {
  throw createError({ ...error.value, fatal: true });
}
</script>

<template>
  <div>
    <NuxtLayout name="documents">
      <template #body>
        <div class="h-screen overflow-auto bg-slate-100 print:h-full print:overflow-hidden">
          <div class="grid place-content-center">
            <DocumentContentBAPP
              v-if="data?.value"
              :data="data?.value"
            >
              <template #details-title="{ value }">
                <BaseFieldHighlight
                  :value
                  :class="[highlightLevel(data.original.details.title, data.value.details.title)]"
                />
              </template>
              <template #details-date-start="{ value }">
                <BaseFieldHighlight
                  :value
                  :class="[highlightLevel(data.original.details.date.ts.start, data.value.details.date.ts.start)]"
                >
                  {{ formatDate(new Date(value), 'DD MMMM YYYY', { locales: 'id-ID' }) }}
                </BaseFieldHighlight>
              </template>
              <template #details-date-end="{ value }">
                <BaseFieldHighlight
                  :value
                  :class="[highlightLevel(data.original.details.date.ts.end, data.value.details.date.ts.end)]"
                >
                  {{ formatDate(new Date(value), 'DD MMMM YYYY', { locales: 'id-ID' }) }}
                </BaseFieldHighlight>
              </template>
              <template #details-day-end="{ value }">
                <BaseFieldHighlight
                  :value
                  :class="[highlightLevel(data.original.details.date.ts.end, data.value.details.date.ts.end)]"
                >
                  {{ formatDate(new Date(value), 'dddd', { locales: 'id-ID' }) }}
                </BaseFieldHighlight>
              </template>

              <template #bapp-number="{ value }">
                <BaseFieldHighlight
                  :value
                  :class="[highlightLevel(data.original.bapp.number, data.value.bapp.number)]"
                />
              </template>
              <template #po-number="{ value }">
                <BaseFieldHighlight
                  :value
                  :class="[highlightLevel(data.original.po.number, data.value.po.number)]"
                />
              </template>
              <template #invoice-number="{ value }">
                <BaseFieldHighlight
                  :value
                  :class="[highlightLevel(data.original.invoice.number, data.value.invoice.number)]"
                />
              </template>
              <template #invoice-nominal="{ value }">
                <BaseFieldHighlight
                  :value
                  :class="[highlightLevel(data.original.invoice.nominal, data.value.invoice.nominal)]"
                >
                  {{ formatCurrency(value) }}
                </BaseFieldHighlight>
              </template>

              <!-- Employee Info -->
              <template #supervisor-name="{ value }">
                <BaseFieldHighlight
                  :value
                  :class="[highlightLevel(data.original.employee.supervisor.name, data.value.employee.supervisor.name)]"
                />
              </template>
              <template #supervisor-role="{ value }">
                <BaseFieldHighlight
                  :value
                  :class="[highlightLevel(data.original.employee.supervisor.role, data.value.employee.supervisor.role)]"
                />
              </template>
              <template #employee-name="{ value }">
                <BaseFieldHighlight
                  :value
                  :class="[highlightLevel(data.original.employee.name, data.value.employee.name)]"
                />
              </template>
              <template #employee-role="{ value }">
                <BaseFieldHighlight
                  :value
                  :class="[highlightLevel(data.original.employee.role, data.value.employee.role)]"
                />
              </template>
            </DocumentContentBAPP>
          </div>
        </div>
      </template>
    </NuxtLayout>
  </div>
</template>
