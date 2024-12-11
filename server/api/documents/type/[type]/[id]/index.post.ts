import { useValidatedBody } from 'h3-zod';
import { workDocumentSchema } from '~~/types/schema/document';

export default defineEventHandler(async (event) => {
  const id = decodeURI(getRouterParam(event, 'id') || '');
  const type = decodeURI(getRouterParam(event, 'type') || '').toLowerCase();
  const workDocument = await useValidatedBody(event, workDocumentSchema);

  if (!isValidDocumentType(type)) throw createError({ statusCode: 404 });
  const user = await verifyUserAuthorizationByName(event);

  const original = await getWorkDocumentByNameAndId({ name: user.name!, id });

  await useDB()
    .insert(tables.documentMitra)
    .values([
      {
        id,
        type: 'original',
        value: original,
        createdAt: new Date(),
      },
      {
        id,
        type,
        value: workDocument,
        createdAt: new Date(),
      },
    ])
    .onConflictDoUpdate({
      target: [tables.documentMitra.id, tables.documentMitra.type],
      set: {
        value: workDocument,
        isValidated: false,
        isApproved: false,
        validatedAt: null,
        updatedAt: new Date(),
      },
    });

  return workDocument;
});
