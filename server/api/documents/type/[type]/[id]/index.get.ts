import { z } from 'zod';
import type { STATUSES_TYPE } from '~~/types/document';

const payloadSchema = z.object({
  includeRelatedWork: z.boolean().optional(),
});

export default defineEventHandler(async (event) => {
  const id = decodeURI(getRouterParam(event, 'id') || '');
  const type = decodeURI(getRouterParam(event, 'type') || '').toLowerCase();
  const { data: query } = await getValidatedQuery(event, query => payloadSchema.safeParse(query));

  if (!isValidDocumentType(type)) throw createError({ statusCode: 404 });

  const workDocuments = await useDB()
    .select({
      type: tables.documentMitra.type,
      value: tables.documentMitra.value,
      isValidated: tables.documentMitra.isValidated,
      isApproved: tables.documentMitra.isApproved,
      signedAt: tables.documentMitra.signedAt,
    })
    .from(tables.documentMitra)
    .where(eq(tables.documentMitra.id, id));

  const { works, relatedWorks } = workDocuments
    .reduce(
      (prev, curr) => {
        if (curr.type === type) prev.works.push(curr);
        else prev.relatedWorks.push(curr);

        return prev;
      },
      { works: [], relatedWorks: [] } as { works: typeof workDocuments; relatedWorks: typeof workDocuments },
    );

  const workDocument = catchFirst(works);

  const { isValidated, isApproved, signedAt } = workDocument;
  const statuses = getWorkDocumentStatus([id], [{ id, type, isValidated, isApproved, signedAt }]);
  const status = statuses.find(status => status.type === type);

  return {
    ...workDocument,
    status: status!.status as STATUSES_TYPE,
    relatedWorks: query?.includeRelatedWork ? relatedWorks : undefined,
  };
});
