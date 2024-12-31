export default defineEventHandler(async (event) => {
  const id = decodeURI(getRouterParam(event, 'id') || '');

  const approveOrReject = decodeURI(getRouterParam(event, 'approveOrReject') || '');
  if (!['approve', 'reject'].includes(approveOrReject.toLowerCase())) throw createError({ statusCode: 404 });
  const isApproved = approveOrReject === 'approve';

  await verifyUserAuthorizationByRole(event, { role: ['admin'] });

  const workDocument = await useDB()
    .update(tables.documentMitra)
    .set({ isValidated: true, isApproved, validatedAt: new Date(), revisedAt: null })
    .where(eq(tables.documentMitra.id, id))
    .returning()
    .get();

  await useStorage('cache').removeItem(`nitro:functions:datatable:datatable.json`);

  return workDocument;
});
