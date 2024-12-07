<script setup lang="ts">
import { formatDate } from '@vueuse/core';
import { toast } from '~/components/shadcn/ui/toast';
import { isString, formatCurrency } from '~/lib/utils';
import { highlightLevel } from '~/components/base/field/const';

definePageMeta({
  layout: false,
});

const route = useRoute();
const routeType = computed<string>(() => isString(route.params.type) ? route.params.type.toLowerCase() : '');
if (!['bapp', 'bast'].includes(routeType.value)) navigateTo('/documents');

// CORE
const { user } = useUserSession();
const { data, error, refresh } = await useFetch(
  `/api/documents/type/${routeType.value}/${route.params.id}`,
);
if (error.value) throw createError({ ...error.value, fatal: true });
const hasAdmin = computed(() => user.value?.role?.includes('admin'));
const supervisorName = computed(() => data.value?.value.employee.supervisor.name);

// REVIEW
const isLoading = ref(false);
async function handleApproveOrReject(type: 'approve' | 'reject') {
  isLoading.value = true;

  await $fetch(`/api/documents/type/${routeType.value}/${route.params.id}/${type}`, {
    method: 'PATCH',
    onResponseError: ({ response }) => {
      const messages = response.statusText.split('>>');
      toast({
        title: messages[0]?.trim(),
        description: messages[1]?.trim(),
        variant: 'destructive',
      });

      isLoading.value = false;
    },
  });

  refresh();

  isLoading.value = false;
}
async function handleApprove() {
  handleApproveOrReject('approve');
}
async function handleReject() {
  handleApproveOrReject('reject');
}

// SIGN
const formSign = ref();
const showDialogSign = ref(false);
async function handleSign() {
  await $fetch(`/api/documents/type/${routeType.value}/${route.params.id}/sign`, {
    method: 'PATCH',
    body: { sign: formSign.value, name: supervisorName.value },
    onResponseError: ({ response }) => {
      const messages = response.statusText.split('>>');
      toast({
        title: messages[0]?.trim(),
        description: messages[1]?.trim(),
        variant: 'destructive',
      });
    },
  });

  refresh();

  showDialogSign.value = false;
}
</script>

<template>
  <div>
    <NuxtLayout name="documents">
      <template #body>
        <div
          v-if="data"
          class="h-screen overflow-auto bg-slate-100 print:h-full print:overflow-hidden"
        >
          <DocumentAction class="absolute right-5 top-5">
            <div
              v-if="hasAdmin && !data.isValidated"
              class="flex justify-between space-x-4"
            >
              <ShadcnButton
                :disabled="isLoading"
                @click="handleApprove"
              >
                Approve
              </ShadcnButton>
              <ShadcnButton
                variant="destructive"
                :disabled="isLoading"
                @click="handleReject"
              >
                Reject
              </ShadcnButton>
            </div>

            <ShadcnTooltipProvider
              v-if="user?.name === supervisorName"
              :disabled="!data.isValidated && !data.isApproved"
            >
              <ShadcnTooltip
                :open="!data.isValidated || !data.isApproved"
                :disable-closing-trigger="!data.isValidated || !data.isApproved"
              >
                <ShadcnTooltipTrigger as-child>
                  <ShadcnButton
                    :disabled="!data.isValidated || !data.isApproved"
                    @click="() => showDialogSign = true"
                  >
                    Sign
                  </ShadcnButton>
                </ShadcnTooltipTrigger>
                <ShadcnTooltipContent>
                  <div v-if="!data.isValidated">
                    <p class="text-red-500">
                      The admin hasn't reviewed this document yet.
                    </p>
                    <p class="font-bold">
                      This document is awaiting admin review before you can sign it.
                    </p>
                  </div>
                  <div v-else-if="!data.isApproved">
                    <p class="text-red-500">
                      The admin has rejected this document.
                    </p>
                    <p class="font-bold">
                      This document needs to be revised by the employee before you can sign it.
                    </p>
                  </div>
                </ShadcnTooltipContent>
              </ShadcnTooltip>
            </ShadcnTooltipProvider>
          </DocumentAction>

          <DocumentDialogSign
            v-model:open="showDialogSign"
            v-model="formSign"
            @sign="handleSign"
          />
          <div class="grid place-content-center">
            <DocumentContentBAPP
              v-if="routeType === 'bapp'"
              :data="data.value"
            >
              <template
                v-if="hasAdmin"
                #details-title="{ value }"
              >
                <BaseFieldHighlight
                  :value
                  :class="[highlightLevel(data.original.details.title, data.value.details.title)]"
                />
              </template>
              <template
                v-if="hasAdmin"
                #details-date-start="{ value }"
              >
                <BaseFieldHighlight
                  :value
                  :class="[highlightLevel(data.original.details.date.ts.start, data.value.details.date.ts.start)]"
                >
                  {{ formatDate(new Date(value), 'DD MMMM YYYY', { locales: 'id-ID' }) }}
                </BaseFieldHighlight>
              </template>
              <template
                v-if="hasAdmin"
                #details-date-end="{ value }"
              >
                <BaseFieldHighlight
                  :value
                  :class="[highlightLevel(data.original.details.date.ts.end, data.value.details.date.ts.end)]"
                >
                  {{ formatDate(new Date(value), 'DD MMMM YYYY', { locales: 'id-ID' }) }}
                </BaseFieldHighlight>
              </template>
              <template
                v-if="hasAdmin"
                #details-day-end="{ value }"
              >
                <BaseFieldHighlight
                  :value
                  :class="[highlightLevel(data.original.details.date.ts.end, data.value.details.date.ts.end)]"
                >
                  {{ formatDate(new Date(value), 'dddd', { locales: 'id-ID' }) }}
                </BaseFieldHighlight>
              </template>

              <template
                v-if="hasAdmin"
                #bapp-number="{ value }"
              >
                <BaseFieldHighlight
                  :value
                  :class="[highlightLevel(data.original.bapp.number, data.value.bapp.number)]"
                />
              </template>
              <template
                v-if="hasAdmin"
                #po-number="{ value }"
              >
                <BaseFieldHighlight
                  :value
                  :class="[highlightLevel(data.original.po.number, data.value.po.number)]"
                />
              </template>
              <template
                v-if="hasAdmin"
                #invoice-number="{ value }"
              >
                <BaseFieldHighlight
                  :value
                  :class="[highlightLevel(data.original.invoice.number, data.value.invoice.number)]"
                />
              </template>
              <template
                v-if="hasAdmin"
                #invoice-nominal="{ value }"
              >
                <BaseFieldHighlight
                  :value
                  :class="[highlightLevel(data.original.invoice.nominal, data.value.invoice.nominal)]"
                >
                  {{ formatCurrency(value) }}
                </BaseFieldHighlight>
              </template>

              <!-- Employee Info -->
              <template
                v-if="hasAdmin"
                #supervisor-name="{ value }"
              >
                <BaseFieldHighlight
                  :value
                  :class="[highlightLevel(data.original.employee.supervisor.name, data.value.employee.supervisor.name)]"
                />
              </template>
              <template
                v-if="hasAdmin"
                #supervisor-role="{ value }"
              >
                <BaseFieldHighlight
                  :value
                  :class="[highlightLevel(data.original.employee.supervisor.role, data.value.employee.supervisor.role)]"
                />
              </template>
              <template
                v-if="hasAdmin"
                #employee-name="{ value }"
              >
                <BaseFieldHighlight
                  :value
                  :class="[highlightLevel(data.original.employee.name, data.value.employee.name)]"
                />
              </template>
              <template
                v-if="hasAdmin"
                #employee-role="{ value }"
              >
                <BaseFieldHighlight
                  :value
                  :class="[highlightLevel(data.original.employee.role, data.value.employee.role)]"
                />
              </template>
            </DocumentContentBAPP>
            <DocumentContentBAST
              v-else
              :data="data.value"
            >
              <template
                v-if="hasAdmin"
                #details-title="{ value }"
              >
                <BaseFieldHighlight
                  :value
                  :class="[highlightLevel(data.original.details.title, data.value.details.title)]"
                />
              </template>
              <template
                v-if="hasAdmin"
                #details-date-end="{ value }"
              >
                <BaseFieldHighlight
                  :value
                  :class="[highlightLevel(data.original.details.date.ts.end, data.value.details.date.ts.end)]"
                >
                  {{ formatDate(new Date(value), 'DD MMMM YYYY', { locales: 'id-ID' }) }}
                </BaseFieldHighlight>
              </template>
              <template
                v-if="hasAdmin"
                #details-day-end="{ value }"
              >
                <BaseFieldHighlight
                  :value
                  :class="[highlightLevel(data.original.details.date.ts.end, data.value.details.date.ts.end)]"
                >
                  {{ formatDate(new Date(value), 'dddd', { locales: 'id-ID' }) }}
                </BaseFieldHighlight>
              </template>

              <template
                v-if="hasAdmin"
                #bapp-number="{ value }"
              >
                <BaseFieldHighlight
                  :value
                  :class="[highlightLevel(data.original.bapp.number, data.value.bapp.number)]"
                />
              </template>
              <template
                v-if="hasAdmin"
                #bast-number="{ value }"
              >
                <BaseFieldHighlight
                  :value
                  :class="[highlightLevel(data.original.bast!.number, data.value.bast!.number)]"
                />
              </template>
              <template
                v-if="hasAdmin"
                #po-number="{ value }"
              >
                <BaseFieldHighlight
                  :value
                  :class="[highlightLevel(data.original.po.number, data.value.po.number)]"
                />
              </template>

              <!-- Employee Info -->
              <template
                v-if="hasAdmin"
                #supervisor-name="{ value }"
              >
                <BaseFieldHighlight
                  :value
                  :class="[highlightLevel(data.original.employee.supervisor.name, data.value.employee.supervisor.name)]"
                />
              </template>
              <template
                v-if="hasAdmin"
                #supervisor-role="{ value }"
              >
                <BaseFieldHighlight
                  :value
                  :class="[highlightLevel(data.original.employee.supervisor.role, data.value.employee.supervisor.role)]"
                />
              </template>
              <template
                v-if="hasAdmin"
                #employee-name="{ value }"
              >
                <BaseFieldHighlight
                  :value
                  :class="[highlightLevel(data.original.employee.name, data.value.employee.name)]"
                />
              </template>
              <template
                v-if="hasAdmin"
                #employee-role="{ value }"
              >
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
