export default defineEventHandler(async (event) => {
  const id = decodeURI(getRouterParam(event, 'id') || '');
  const type = decodeURI(getRouterParam(event, 'type') || '');

  if (!['bapp', 'bast'].includes(type.toLowerCase())) throw createError({ statusCode: 404 });
  await verifyUserAuthorizationByRole(event, { role: ['admin'] });

  const workDocument = await useDB()
    .update(tables.documentMitra)
    .set({ isValidated: true, isApproved: true, validatedAt: new Date() })
    .where(eq(tables.documentMitra.id, id))
    .returning()
    .get();

  return workDocument;
});
