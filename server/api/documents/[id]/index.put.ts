import { useValidatedBody } from 'h3-zod';
import { workDocumentSchema } from '~~/shared/types/schema/document';

export default defineEventHandler(async (event) => {
  const id = decodeURI(getRouterParam(event, 'id') || '');
  const workDocument = await useValidatedBody(event, workDocumentSchema);

  const user = await verifyUserAuthorizationByName(event);

  const original = await getWorkDocumentOriginalByNameAndId({ name: user.name!, id });

  await useDB()
    .insert(tables.documentMitra)
    .values({
      id,
      original,
      value: workDocument,
      createdAt: new Date(),
    })
    .onConflictDoUpdate({
      target: tables.documentMitra.id,
      set: {
        original,
        value: workDocument,
        isValidated: false,
        isApproved: false,
        validatedAt: null,
        revisedAt: new Date(),
      },
    });

  await useStorage('cache').removeItem(`nitro:functions:datatable:datatable.json`);

  return workDocument;
});
