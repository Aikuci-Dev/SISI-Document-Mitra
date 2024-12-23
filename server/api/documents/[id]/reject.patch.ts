export default defineEventHandler(async (event) => {
  const id = decodeURI(getRouterParam(event, 'id') || '');

  await verifyUserAuthorizationByRole(event, { role: ['admin'] });

  const workDocument = await useDB()
    .update(tables.documentMitra)
    .set({ isValidated: true, isApproved: false, validatedAt: new Date(), revisedAt: null })
    .where(eq(tables.documentMitra.id, id))
    .returning()
    .get();

  const prefixCacheKey = 'nitro:functions:datatable';
  await useStorage('cache').removeItem(`${prefixCacheKey}:datatable.json`);
  await useStorage('cache').removeItem(`${prefixCacheKey}:datatable-supervisor-${workDocument.value.supervisorName}.json`);
  await useStorage('cache').removeItem(`${prefixCacheKey}:datatable-employee-${workDocument.value.employeeName}.json`);

  return workDocument;
});
