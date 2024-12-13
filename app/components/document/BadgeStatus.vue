<script setup lang="ts">
import type { BadgeVariants } from '../shadcn/ui/badge';
import { STATUSES, type STATUSES_TYPE, type WorkMetaStatus } from '~~/types/document';

defineProps<WorkMetaStatus>();

const variantClassesByStatus: Record<STATUSES_TYPE, string> = {
  initiated: '',
  created: '',
  approved: 'bg-green-500 text-slate-50 hover:bg-green-500/80 dark:bg-green-900 dark:text-slate-50 dark:hover:bg-green-900/80',
  rejected: '',
  revised: '',
  signed: 'bg-blue-500 text-slate-50 hover:bg-blue-500/80 dark:bg-blue-900 dark:text-slate-50 dark:hover:bg-blue-900/80',
};

const variantBadgeByStatus: Record<STATUSES_TYPE, BadgeVariants['variant']> = {
  initiated: 'outline',
  created: 'secondary',
  approved: 'default',
  rejected: 'destructive',
  revised: 'default',
  signed: 'default',
};
</script>

<template>
  <ShadcnTooltipProvider>
    <ShadcnTooltip>
      <ShadcnTooltipTrigger>
        <ShadcnBadge
          class="capitalize"
          :class="variantClassesByStatus[status]"
          :variant="variantBadgeByStatus[status]"
        >
          <span class="uppercase">{{ type }}</span>&nbsp;{{ status }}
        </shadcnbadge>
      </ShadcnTooltipTrigger>
      <ShadcnTooltipContent>
        <div v-if="status === STATUSES.initiated">
          Please fill in your information.
        </div>
        <div v-else-if="status === STATUSES.created">
          Waiting for admin validation.
        </div>
        <div v-else-if="status === STATUSES.approved">
          Waiting for supervisor's signature.
        </div>
        <div v-else-if="status === STATUSES.rejected">
          Please make your revisions.
        </div>
        <div v-else-if="status === STATUSES.revised">
          Waiting for admin validation again.
        </div>
        <div v-else-if="status === STATUSES.signed">
          Document has been signed by your supervisor.
        </div>
      </ShadcnTooltipContent>
    </ShadcnTooltip>
  </ShadcnTooltipProvider>
</template>
