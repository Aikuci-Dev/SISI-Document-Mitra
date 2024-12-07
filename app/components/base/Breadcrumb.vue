<script setup lang="ts">
export interface Item {
  id?: string;
  label: string;
  href: string;
}
defineProps<{ items: Item[] }>();
</script>

<template>
  <ShadcnBreadcrumb>
    <ShadcnBreadcrumbList>
      <template
        v-for="{ id, label, href } in items"
        :key="id || label"
      >
        <ShadcnBreadcrumbItem>
          <ShadcnBreadcrumbLink as-child>
            <NuxtLink :to="href">
              {{ label }}
            </NuxtLink>
          </ShadcnBreadcrumbLink>
        </ShadcnBreadcrumbItem>
        <ShadcnBreadcrumbSeparator />
      </template>
      <ShadcnBreadcrumbItem>
        <ShadcnBreadcrumbPage>
          <slot />
        </ShadcnBreadcrumbPage>
      </ShadcnBreadcrumbItem>
    </ShadcnBreadcrumbList>
  </ShadcnBreadcrumb>
</template>
