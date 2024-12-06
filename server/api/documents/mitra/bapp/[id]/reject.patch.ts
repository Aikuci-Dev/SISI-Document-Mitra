export default defineEventHandler(async (event) => {
  const id = decodeURI(getRouterParam(event, 'id') || '');
  await verifyUserAuthorizationByRole(event, { role: ['admin'] });

  const workDocument = await useDB()
    .update(tables.documentBapp)
    .set({ isValidated: true, isApproved: false, validatedAt: new Date() })
    .where(eq(tables.documentBapp.id, id))
    .returning()
    .get();

  return workDocument;
});
