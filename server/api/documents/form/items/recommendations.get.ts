import { z } from 'zod';

const payloadSchema = z.object({
  id: z.string(),
  type: z.enum(['title', 'nominal']),
});

export default defineEventHandler(async (event) => {
  const { id, type } = await getValidatedQuery(event, query => payloadSchema.parse(query));

  if (type === 'title') {
    const workDocuments = await fetchWorkDocumentTableWithStatus({ role: 'admin' });
    return workDocuments.rows
      .filter(row => isStatusNotInitiated(row.meta.status) && isStatusNotNilOrDraft(row.meta.status) && row.key !== id && row.meta.mapped_work.value.detailsTitle !== '')
      .map(row => ({ key: row.meta.mapped_work.value.detailsNumber, value: row.meta.mapped_work.value.detailsTitle }));
  }

  return [] as { key: string; value: string }[];
});
