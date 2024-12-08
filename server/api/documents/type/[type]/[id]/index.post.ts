import { useValidatedBody } from 'h3-zod';
import { workDocumentSchema } from '~~/types/schema/document';

export default defineEventHandler(async (event) => {
  const id = decodeURI(getRouterParam(event, 'id') || '');
  const type = decodeURI(getRouterParam(event, 'type') || '');
  const workDocument = await useValidatedBody(event, workDocumentSchema);

  if (!['bapp', 'bast'].includes(type.toLowerCase())) throw createError({ statusCode: 404 });
  const user = await verifyUserAuthorizationByName(event);

  const original = await getWorkDocumentByNameAndId(event, { name: user.name!, id });

  await useDB()
    .insert(tables.documentMitra)
    .values({
      id,
      type,
      original,
      value: workDocument,
      createdAt: new Date(),
    })
    .onConflictDoUpdate({
      target: [tables.documentMitra.id, tables.documentMitra.type],
      set: {
        original,
        value: workDocument,
        updatedAt: new Date(),
      },
    });

  return workDocument;
});
