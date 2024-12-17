import { z } from 'zod';
import { getValueByKey } from '~~/server/utils/utils';

const payloadSchema = z.object({
  id: z.string(),
  name: z.string(),
});

export default defineEventHandler(async (event) => {
  const host = getRequestHost(event);

  const { id, name } = await getValidatedQuery(event, query => payloadSchema.parse(query));

  const { form } = useRuntimeConfig().google;

  const formUrl = `https://docs.google.com/forms/d/e/${form.id}/viewform`;

  const workDocuments = await useDB()
    .select({ value: tables.documentMitra.value })
    .from(tables.documentMitra)
    .where(eq(tables.documentMitra.id, id))
    .get();

  const document = workDocuments?.value || await getWorkDocumentByNameAndId({ name, id });
  const links = workDocuments ? `[Document] ${host}/documents/${id}/public` : '';

  if (!document) throw createError({ statusCode: 404 });

  const mappingForm = await useDB()
    .select({
      value: tables.mapping.value,
      map: tables.mapping.map,
      other: tables.mapping.other,
    })
    .from(tables.mapping)
    .where(eq(tables.mapping.type, 'form'))
    .get();
  if (!mappingForm || !mappingForm.other) throw createError('Internal Server Error. >> Mapping data was missing, please contact administrator to handle this!');
  const typeMap = new Map(Object.entries(removeNullUndefined(mappingForm.other.type)));

  const payload = Object.entries(mappingForm.map)
    .reduce((prev, [entryKey, workDocumentKey]) => {
      switch (typeMap.get(entryKey)) {
        case 'custom-links':
          prev[entryKey] = links;
          break;
        case 'date': {
          if (workDocumentKey) {
            const value = String(getValueByKey(document, workDocumentKey));
            if (value) {
              const date = new Date(value);
              prev[`${entryKey}_year`] = String(date.getFullYear());
              prev[`${entryKey}_month`] = String(date.getMonth() + 1);
              prev[`${entryKey}_day`] = String(date.getDate());
            }
          }
          break;
        }

        default:
          if (workDocumentKey)
            prev[entryKey] = getValueByKey(document, workDocumentKey) as string;
          break;
      }
      return prev;
    }, {} as Record<string, string>);

  const params = new URLSearchParams(payload);
  return `${formUrl}?${params}`;
});
