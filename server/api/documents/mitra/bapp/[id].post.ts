import { useValidatedBody } from 'h3-zod';
import { workDocumentSchema } from '~~/types/schema/document';

export default defineEventHandler(async (event) => {
  const id = decodeURI(getRouterParam(event, 'id') || '');
  const user = await verifyUserAuthorizationByName(event);

  const workDocument = await useValidatedBody(event, workDocumentSchema);
  const original = await getMyWorkDocumentById(event, { name: user.name!, id });

  await useDB()
    .insert(tables.documentBapp)
    .values({
      id,
      original,
      value: workDocument,
      createdAt: new Date(),
    })
    .onConflictDoUpdate({
      target: tables.documentBapp.id,
      set: {
        original,
        value: workDocument,
        updatedAt: new Date(),
      },
    });

  return workDocument;
});
