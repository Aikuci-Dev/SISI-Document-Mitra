export default defineEventHandler(async (event) => {
  const id = decodeURI(getRouterParam(event, 'id') || '');

  const workDocument = await useDB()
    .select({
      original: tables.documentBapp.original,
      value: tables.documentBapp.value,
      isValidated: tables.documentBapp.isValidated,
      isApproved: tables.documentBapp.isApproved,
    })
    .from(tables.documentBapp)
    .where(eq(tables.documentBapp.id, id));

  return catchFirst(workDocument);
});
