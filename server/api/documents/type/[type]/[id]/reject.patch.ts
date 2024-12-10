export default defineEventHandler(async (event) => {
  const id = decodeURI(getRouterParam(event, 'id') || '');
  const type = decodeURI(getRouterParam(event, 'type') || '').toLowerCase();

  if (!isValidDocumentType(type)) throw createError({ statusCode: 404 });
  await verifyUserAuthorizationByRole(event, { role: ['admin'] });

  const workDocument = await useDB()
    .update(tables.documentMitra)
    .set({ isValidated: true, isApproved: false, validatedAt: new Date() })
    .where(
      and(
        eq(tables.documentMitra.type, type),
        eq(tables.documentMitra.id, id),
      ),
    )
    .returning()
    .get();

  return workDocument;
});
