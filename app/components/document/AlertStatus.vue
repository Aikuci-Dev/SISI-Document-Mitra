<script setup lang="ts">
import type { AlertVariants } from '@/components/shadcn/ui/alert';
import { STATUSES, type STATUSES_TYPE } from '~~/types/document';

const props = defineProps<{ status: STATUSES_TYPE }>();

const alertTitle = computed(() => {
  let title = '';
  switch (props.status) {
    case STATUSES.approved:
      title = 'Waiting for supervisor\'s signature.';
      break;
    case STATUSES.rejected:
      title = 'Please make your revisions.';
      break;
    case STATUSES.signed:
      title = 'Document has been signed by your supervisor.';
      break;

    default:
      title = 'Waiting for admin validation.';
      break;
  }
  return title;
});

const variantClassesByStatus: Partial<Record<STATUSES_TYPE, string>> = {
  created: 'border-slate-900/50 text-slate-900 dark:border-slate-900 [&>svg]:text-slate-900 dark:border-slate-50/50 dark:text-slate-50 dark:dark:border-slate-50 dark:[&>svg]:text-slate-50',
  approved: 'border-green-500/50 text-green-500 dark:border-green-500 [&>svg]:text-green-500 dark:border-green-900/50 dark:text-green-900 dark:dark:border-green-900 dark:[&>svg]:text-green-900',
  rejected: 'border-slate-900/50 text-slate-900 dark:border-slate-900 [&>svg]:text-slate-900 dark:border-slate-50/50 dark:text-slate-50 dark:dark:border-slate-50 dark:[&>svg]:text-slate-50',
  signed: 'border-blue-500/50 text-blue-500 dark:border-blue-500 [&>svg]:text-blue-500 dark:border-blue-900/50 dark:text-blue-900 dark:dark:border-blue-900 dark:[&>svg]:text-blue-900',
};

const variantAlertByStatus: Partial<Record<STATUSES_TYPE, AlertVariants['variant']>> = {
  rejected: 'destructive',
};
</script>

<template>
  <ShadcnAlert
    :class="variantClassesByStatus[status]"
    :variant="variantAlertByStatus[status]"
  >
    <ShadcnAlertTitle>{{ alertTitle }}</ShadcnAlertTitle>
  </ShadcnAlert>
</template>
