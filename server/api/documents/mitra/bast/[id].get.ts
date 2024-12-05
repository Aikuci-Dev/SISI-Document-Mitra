export default defineEventHandler(async (event) => {
  const id = decodeURI(getRouterParam(event, 'id') || '');

  const workDocument = await useDB()
    .select({ original: tables.documentBast.original, value: tables.documentBast.value })
    .from(tables.documentBast)
    .where(eq(tables.documentBast.id, id));

  return catchFirst(workDocument);
});
