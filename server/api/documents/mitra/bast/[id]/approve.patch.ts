export default defineEventHandler(async (event) => {
  const id = decodeURI(getRouterParam(event, 'id') || '');
  await verifyUserAuthorizationByRole(event, { role: ['admin'] });

  const workDocument = await useDB()
    .update(tables.documentBast)
    .set({ isValidated: true, isApproved: true, validatedAt: new Date() })
    .where(eq(tables.documentBast.id, id))
    .returning()
    .get();

  return workDocument;
});
