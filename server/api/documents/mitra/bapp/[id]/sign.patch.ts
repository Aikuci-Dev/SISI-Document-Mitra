import { useValidatedBody, z } from 'h3-zod';

export default defineEventHandler(async (event) => {
  const id = decodeURI(getRouterParam(event, 'id') || '');
  const { sign, name } = await useValidatedBody(event, z.object({
    sign: z.string(),
    name: z.string(),
  }));

  await verifyUserAuthorizationByName(event, {
    name,
    errorMessage: 'Forbidden. >> You do not have the necessary permissions to perform this action because you are not the supervisor of this employee.',
  });

  const workDocuments = await useDB()
    .select({ value: tables.documentBapp.value })
    .from(tables.documentBapp)
    .where(eq(tables.documentBapp.id, id));

  const workDocument = catchFirst(workDocuments);
  workDocument.value.employee.supervisor.sign.url = sign;

  await useDB().update(tables.documentBapp)
    .set({ value: workDocument.value, signedAt: new Date() })
    .where(eq(tables.documentBapp.id, id));

  return workDocument;
});
