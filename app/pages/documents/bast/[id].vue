<script setup lang="ts">
import { formatDate } from '@vueuse/core';
import { highlightLevel } from '~/components/base/field/const';

const route = useRoute();

const { data, error } = await useFetch(
  `/api/documents/mitra/bast/${route.params.id}`,
);

if (error.value?.statusCode === 404) {
  navigateTo('/404');
}
</script>

<template>
  <div>
    <NuxtLayout name="documents">
      <template #body>
        <div class="h-screen overflow-auto bg-slate-100 print:h-full print:overflow-hidden">
          <div class="grid place-content-center">
            <!-- @vue-expect-error 'bast' is defined and not undefined. -->
            <DocumentContentBAST
              v-if="data?.value"
              :data="data?.value"
            >
              <template #details-title="{ value }">
                <BaseFieldHighlight
                  :value
                  :class="[highlightLevel(data.original.details.title, data.value.details.title)]"
                />
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
              <template #bast-number="{ value }">
                <BaseFieldHighlight
                  :value
                  :class="[highlightLevel(data.original.bast!.number, data.value.bast!.number)]"
                />
              </template>
              <template #po-number="{ value }">
                <BaseFieldHighlight
                  :value
                  :class="[highlightLevel(data.original.po.number, data.value.po.number)]"
                />
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
            </DocumentContentBAST>
          </div>
        </div>
      </template>
    </NuxtLayout>
  </div>
</template>
