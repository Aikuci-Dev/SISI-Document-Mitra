<script setup lang="ts">
import * as z from 'zod';
import { useForm } from 'vee-validate';
import { toTypedSchema } from '@vee-validate/zod';

const { user, fetch: refetchUserSession } = useUserSession();
const loading = ref(false);

const schema = z.object({
  name: z
    .string({ required_error: 'Name is required.' })
    .min(2, { message: 'Name must be at least 2 characters.' }),
});
type Form = z.infer<typeof schema>;

const form = useForm({
  validationSchema: toTypedSchema(schema),
  initialValues: { name: user.value!.oauth!.name },
});

async function onSubmit(values: Form) {
  loading.value = true;

  try {
    const { id, email } = user.value!.oauth!;
    await $fetch('/api/user/google', {
      method: 'POST',
      body: { id, email, name: values.name },
    });

    await refetchUserSession();
    navigateTo('/documents');
  }
  catch (error) {
    // TODO: Error Handling
    console.error(error);
  }

  loading.value = false;
}
</script>

<template>
  <div
    class="tw-container tw-grid tw-h-screen tw-items-center tw-justify-center"
  >
    <ShadcnAutoForm
      :schema
      :form
      :field-config="{
        name: {
          description: 'This will be used in query filters.',
        },
      }"
      @submit="onSubmit"
    >
      <div class="tw-text-right">
        <ShadcnButton
          type="submit"
          :disabled="loading"
        >
          Submit
        </ShadcnButton>
      </div>
    </ShadcnAutoForm>
  </div>
</template>
