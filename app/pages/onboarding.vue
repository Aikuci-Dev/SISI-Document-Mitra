<script setup lang="ts">
import { z } from 'zod';
import { useForm } from 'vee-validate';
import { toTypedSchema } from '@vee-validate/zod';
import { toast } from '~/components/shadcn/ui/toast';

const { user, fetch: refetchUserSession } = useUserSession();
const loading = ref(false);

const schema = z.object({
  name: z
    .string({ required_error: 'Name is required.' })
    .min(2, { message: 'Name must be at least 2 characters.' }),
});

const form = useForm({
  validationSchema: toTypedSchema(schema),
  initialValues: { name: user.value!.oauth!.name },
});

const showAlertDialog = ref(false);

async function handleSubmit() {
  showAlertDialog.value = false;
  loading.value = true;

  const { id, email } = user.value!.oauth!;
  await $fetch('/api/user/google', {
    method: 'POST',
    body: { id, email, name: form.values.name },
    onResponseError: ({ response }) => {
      const messages = response.statusText.split('>>');
      toast({
        title: messages[0]?.trim(),
        description: messages[1]?.trim(),
        variant: 'destructive',
      });

      loading.value = false;
    },
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
    <ShadcnAlertDialog v-model:open="showAlertDialog">
      <ShadcnAlertDialogContent>
        <ShadcnAlertDialogHeader>
          <ShadcnAlertDialogTitle>Final Confirmation</ShadcnAlertDialogTitle>
          <ShadcnAlertDialogDescription>
            This action cannot be undone. Please make sure the name you provide matches the one registered on SISI.
          </ShadcnAlertDialogDescription>
        </ShadcnAlertDialogHeader>
        <ShadcnAlertDialogFooter>
          <ShadcnAlertDialogCancel>Cancel</ShadcnAlertDialogCancel>
          <ShadcnAlertDialogAction @click="handleSubmit">
            Confirm
          </ShadcnAlertDialogAction>
        </ShadcnAlertDialogFooter>
      </ShadcnAlertDialogContent>
    </ShadcnAlertDialog>

    <ShadcnAutoForm
      :schema
      :form
      :field-config="{
        name: {
          description: 'This will be used in query filters.',
        },
      }"
      class="w-96"
      @submit="() => showAlertDialog = true"
    >
      <div class="mt-4 flex justify-end">
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
