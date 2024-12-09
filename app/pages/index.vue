<script setup lang="ts">
import { z } from 'zod';
import { useForm } from 'vee-validate';
import { toTypedSchema } from '@vee-validate/zod';
import { Roles } from '~~/types/user';

const { fetch: refetchUserSession } = useUserSession();

const loading = ref(false);

// FORM
const schema = z.object({
  role: z.nativeEnum(Roles),
});
const form = useForm({
  validationSchema: toTypedSchema(schema),
  initialValues: { role: Roles.user },
});
async function handleSubmit() {
  loading.value = true;

  await $fetch('/api/user/demo', {
    method: 'POST',
    body: { role: form.values.role },
  });

  await refetchUserSession();
  navigateTo('/documents');

  loading.value = false;
}
</script>

<template>
  <div
    class="container flex h-screen items-center justify-center"
  >
    <ShadcnAutoForm
      :schema
      :form
      class="w-96"
      @submit="handleSubmit"
    >
      <div class="mt-4 flex justify-end">
        <ShadcnButton
          type="submit"
          :disabled="loading"
        >
          Login
        </ShadcnButton>
      </div>
    </ShadcnAutoForm>
  </div>
</template>
