export default defineEventHandler(async (event) => {
  const id = decodeURI(getRouterParam(event, 'id') || '');
  const type = decodeURI(getRouterParam(event, 'type') || '');

  if (!['bapp', 'bast'].includes(type.toLowerCase())) throw createError({ statusCode: 404 });

  const workDocument = await useDB()
    .select({
      original: tables.documentMitra.original,
      value: tables.documentMitra.value,
      isValidated: tables.documentMitra.isValidated,
      isApproved: tables.documentMitra.isApproved,
    })
    .from(tables.documentMitra)
    .where(
      or(
        eq(tables.documentMitra.type, type),
        eq(tables.documentMitra.id, id),
      ),
    );

  return catchFirst(workDocument);
});
