<script setup lang="ts">
interface Item {
  id?: string;
  label: string;
  href: string;
}
interface Props {
  items: Item[];
}

defineProps<Props>();
</script>

<template>
  <ShadcnBreadcrumb>
    <ShadcnBreadcrumbList>
      <template
        v-for="{ id, label, href } in items"
        :key="id || label"
      >
        <ShadcnBreadcrumbItem>
          <ShadcnBreadcrumbLink :href="href">
            {{ label }}
          </ShadcnBreadcrumbLink>
        </ShadcnBreadcrumbItem>
        <ShadcnBreadcrumbSeparator />
      </template>
      <ShadcnBreadcrumbItem>
        <ShadcnBreadcrumbPage><slot /></ShadcnBreadcrumbPage>
      </ShadcnBreadcrumbItem>
    </ShadcnBreadcrumbList>
  </ShadcnBreadcrumb>
</template>
