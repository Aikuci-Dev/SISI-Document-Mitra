<script setup lang="ts">
import { Home } from 'lucide-vue-next';
import type { Item } from '~/components/base/Breadcrumb.vue';

defineProps<{
  page: string;
  items: Item[];
}>();
</script>

<template>
  <ShadcnCard>
    <ShadcnCardContent class="flex items-center gap-4 p-2">
      <div class="flex items-center">
        <NuxtLink to="/">
          <Home class="size-4" />
        </NuxtLink>
      </div>
      <BaseBreadcrumb :items>
        {{ page }}
      </BaseBreadcrumb>
    </ShadcnCardContent>
  </ShadcnCard>
</template>
