import type { DOCUMENTS_TYPE, STATUSES_TYPE } from '~~/types/document';

export default defineEventHandler(async (event) => {
  const id = decodeURI(getRouterParam(event, 'id') || '');
  const type = decodeURI(getRouterParam(event, 'type') || '').toLowerCase();

  if (!isValidDocumentType(type)) throw createError({ statusCode: 404 });

  const workDocuments = await useDB()
    .select({
      value: tables.documentMitra.value,
      isValidated: tables.documentMitra.isValidated,
      isApproved: tables.documentMitra.isApproved,
      signedAt: tables.documentMitra.signedAt,
    })
    .from(tables.documentMitra)
    .where(
      and(
        eq(tables.documentMitra.type, type as DOCUMENTS_TYPE),
        eq(tables.documentMitra.id, id),
      ),
    );

  const workDocument = catchFirst(workDocuments);
  const { isValidated, isApproved, signedAt } = workDocument;
  const statuses = getWorkDocumentStatus([id], [{ id, type, isValidated, isApproved, signedAt }]);
  const status = statuses.find(status => status.type === type);
  return { ...workDocument, status: status!.status as STATUSES_TYPE };
});
