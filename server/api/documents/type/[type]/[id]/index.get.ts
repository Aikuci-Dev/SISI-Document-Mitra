import type { STATUSES_TYPE } from '~~/types/document';

export default defineEventHandler(async (event) => {
  const id = decodeURI(getRouterParam(event, 'id') || '');
  const type = decodeURI(getRouterParam(event, 'type') || '');

  if (!['bapp', 'bast'].includes(type.toLowerCase())) throw createError({ statusCode: 404 });

  const workDocuments = await useDB()
    .select({
      original: tables.documentMitra.original,
      value: tables.documentMitra.value,
      isValidated: tables.documentMitra.isValidated,
      isApproved: tables.documentMitra.isApproved,
      signedAt: tables.documentMitra.signedAt,
    })
    .from(tables.documentMitra)
    .where(
      and(
        eq(tables.documentMitra.type, type),
        eq(tables.documentMitra.id, id),
      ),
    );

  const workDocument = catchFirst(workDocuments);
  const { isValidated, isApproved, signedAt } = workDocument;
  const status = getWorkDocumentStatus([id], [{ id, isValidated, isApproved, signedAt }]);
  return { ...workDocument, status: status[0].status as STATUSES_TYPE };
});
