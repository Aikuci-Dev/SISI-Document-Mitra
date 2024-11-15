<script setup lang="ts">
import { Home } from 'lucide-vue-next';
import type { Item } from '@/components/base/Breadcrumb.vue';

interface Props {
  page: string;
  items?: Item[];
}

withDefaults(defineProps<Props>(), {
  items: () => [{ label: 'Documents', href: '/documents' }],
});
</script>

<template>
  <ShadcnCard>
    <ShadcnCardContent class="tw-flex tw-items-center tw-gap-4 tw-p-0">
      <div class="tw-flex tw-items-center">
        <NuxtLink to="/">
          <Home class="tw-size-4" />
        </NuxtLink>
      </div>
      <BaseBreadcrumb :items>
        {{ page }}
      </BaseBreadcrumb>
    </ShadcnCardContent>
  </ShadcnCard>
</template>
