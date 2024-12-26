export default defineEventHandler(async (event) => {
  const id = decodeURI(getRouterParam(event, 'id') || '');

  const workDocuments = await useDB()
    .select({
      original: tables.documentMitra.original,
      value: tables.documentMitra.value,
      isValidated: tables.documentMitra.isValidated,
      isApproved: tables.documentMitra.isApproved,
      signedAt: tables.documentMitra.signedAt,
      revisedAt: tables.documentMitra.revisedAt,
    })
    .from(tables.documentMitra)
    .where(eq(tables.documentMitra.id, id));

  const workDocument = catchFirst(workDocuments);

  const { isValidated, isApproved, signedAt, revisedAt } = workDocument;
  const status = getWorkDocumentStatusFromFlags([id], [{ id, isValidated, isApproved, signedAt, revisedAt }]);

  return { ...workDocument, status: status[0].status };
});
