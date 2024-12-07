import { useValidatedBody, z } from 'h3-zod';

export default defineEventHandler(async (event) => {
  const id = decodeURI(getRouterParam(event, 'id') || '');
  const type = decodeURI(getRouterParam(event, 'type') || '');
  const { sign, name } = await useValidatedBody(event, z.object({
    sign: z.string(),
    name: z.string(),
  }));

  if (!['bapp', 'bast'].includes(type.toLowerCase())) throw createError({ statusCode: 404 });
  await verifyUserAuthorizationByName(event, {
    name,
    errorMessage: 'Forbidden. >> You do not have the necessary permissions to perform this action because you are not the supervisor of this employee.',
  });

  const workDocuments = await useDB()
    .select({ value: tables.documentMitra.value })
    .from(tables.documentMitra)
    .where(
      or(
        eq(tables.documentMitra.type, type),
        eq(tables.documentMitra.id, id),
      ),
    );
  const workDocument = catchFirst(workDocuments);

  workDocument.value.employee.supervisor.sign.url = sign;
  const workDocumentUpdated = await useDB()
    .update(tables.documentMitra)
    .set({ value: workDocument.value, signedAt: new Date() })
    .where(
      or(
        eq(tables.documentMitra.type, type),
        eq(tables.documentMitra.id, id),
      ),
    )
    .returning()
    .get();

  return workDocumentUpdated;
});
