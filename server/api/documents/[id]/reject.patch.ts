export default defineEventHandler(async (event) => {
  const id = decodeURI(getRouterParam(event, 'id') || '');

  await verifyUserAuthorizationByRole(event, { role: ['admin'] });

  const workDocument = await useDB()
    .update(tables.documentMitra)
    .set({ isValidated: true, isApproved: false, validatedAt: new Date(), revisedAt: null })
    .where(eq(tables.documentMitra.id, id))
    .returning()
    .get();

  return workDocument;
});
