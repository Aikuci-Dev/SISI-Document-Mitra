import { z } from 'zod';
import { useValidatedBody } from 'h3-zod';

const payloadSchema = z.object({
  sign: z.string(),
  name: z.string(),
});

export default defineEventHandler(async (event) => {
  const id = decodeURI(getRouterParam(event, 'id') || '');
  const { sign, name } = await useValidatedBody(event, payloadSchema);

  await verifyUserAuthorizationByName(event, {
    name,
    errorMessage: 'Forbidden. >> You do not have the necessary permissions to perform this action because you are not the supervisor of this employee.',
  });

  const workDocuments = await useDB()
    .select({ value: tables.documentMitra.value })
    .from(tables.documentMitra)
    .where(eq(tables.documentMitra.id, id));
  const workDocument = catchFirst(workDocuments);

  workDocument.value.supervisorSignUrl = sign;
  const workDocumentUpdated = await useDB()
    .update(tables.documentMitra)
    .set({ value: workDocument.value, signedAt: new Date() })
    .where(eq(tables.documentMitra.id, id))
    .returning()
    .get();

  const prefixCacheKey = 'nitro:functions:datatable';
  await useStorage('cache').removeItem(`${prefixCacheKey}:datatable.json`);
  await useStorage('cache').removeItem(`${prefixCacheKey}:datatable-supervisor-${name}.json`);
  await useStorage('cache').removeItem(`${prefixCacheKey}:datatable-employee-${workDocument.value.employeeName}.json`);

  return workDocumentUpdated;
});
