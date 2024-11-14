<script setup lang="ts">
import { ChevronLeft, Home } from 'lucide-vue-next';

const breadcrumbItems = [{ label: 'Documents', href: '/documents' }];

interface Props {
  page: string;
}

defineProps<Props>();
</script>

<template>
  <div class="tw-flex tw-items-center tw-gap-4">
    <div class="tw-flex tw-items-center">
      <ShadcnButton
        variant="ghost"
        size="icon"
        @click="$router.back()"
      >
        <ChevronLeft />
      </ShadcnButton>
      <NuxtLink to="/">
        <Home class="tw-size-4" />
      </NuxtLink>
    </div>
    <BaseBreadcrumb :items="breadcrumbItems">
      {{ page }}
    </BaseBreadcrumb>
  </div>
</template>
