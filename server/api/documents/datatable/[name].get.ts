import { z } from 'zod';
import { type DocumentTable, DOCUMENTS_TABLE, type DOCUMENTS_TABLE_TYPE, STATUSES } from '~~/types/document';

const payloadSchema = z.object({
  type: z.enum(Object.values(DOCUMENTS_TABLE) as [DOCUMENTS_TABLE_TYPE, ...DOCUMENTS_TABLE_TYPE[]]),
});

export default defineEventHandler(async (event) => {
  const { type } = await getValidatedQuery(event, query => payloadSchema.parse(query));

  const user = await verifyUserAuthorizationByName(event);

  let datatable: DocumentTable = { columns: [], rows: [] };
  if (type === DOCUMENTS_TABLE.admin) {
    await verifyUserAuthorizationByRole(event, { role: ['admin'] });
    datatable = await fetchWorkDocumentTableWithStatus({ role: 'admin' });
  }
  else
    datatable = await fetchWorkDocumentTableWithStatus({ type, name: user.name });

  return {
    columns: datatable.columns,
    rows: type === DOCUMENTS_TABLE.employee
      ? datatable.rows
      : datatable.rows.filter(row => row.meta.status !== STATUSES.nil && row.meta.status !== STATUSES.draft && row.meta.status !== STATUSES.initiated),
  };
});
