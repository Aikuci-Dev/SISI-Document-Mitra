import { z } from 'zod';
import { DOCUMENTS_TABLE, type DOCUMENTS_TABLE_TYPE } from '~~/types/document';

const payloadSchema = z.object({
  type: z.enum(Object.values(DOCUMENTS_TABLE) as [DOCUMENTS_TABLE_TYPE, ...DOCUMENTS_TABLE_TYPE[]]),
});

export default defineEventHandler(async (event) => {
  const { type } = await getValidatedQuery(event, query => payloadSchema.parse(query));

  const user = await verifyUserAuthorizationByName(event);

  if (type === DOCUMENTS_TABLE.admin) {
    await verifyUserAuthorizationByRole(event, { role: ['admin'] });
    return fetchWorkDocumentTableWithStatus({ role: 'admin' });
  }
  return fetchWorkDocumentTableWithStatus({ type, name: user.name });
});
