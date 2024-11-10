<script setup lang="ts">
definePageMeta({
  middleware: "auth",
});

import * as z from "zod";
import { useForm } from "vee-validate";
import { toTypedSchema } from "@vee-validate/zod";

const { user } = useUserSession();

const schema = z.object({
  name: z
    .string({ required_error: "Name is required." })
    .min(2, { message: "Name must be at least 2 characters." }),
});

const form = useForm({
  validationSchema: toTypedSchema(schema),
  initialValues: { name: user.value?.prefilled_name },
});

function onSubmit(values: Record<string, any>) {
  console.log("values", values);
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
        <ShadcnButton type="submit"> Submit </ShadcnButton>
      </div>
    </ShadcnAutoForm>
  </div>
</template>
