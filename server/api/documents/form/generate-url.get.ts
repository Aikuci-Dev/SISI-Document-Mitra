import { getValueByKey } from '~~/server/utils/utils';

export default defineEventHandler(async (event) => {
  const host = getRequestHost(event);

  const { id, name }: { id: string; name: string } = getQuery(event);

  if (!id) throw createError({ statusCode: 400, statusMessage: 'Bad request. >> Please try again later or contact support if the issue persists.' });

  const { form } = useRuntimeConfig().google;

  const formUrl = `https://docs.google.com/forms/d/e/${form.id}/viewform`;

  const workDocuments = await useDB()
    .select({
      value: tables.documentMitra.value,
      type: tables.documentMitra.type,
    })
    .from(tables.documentMitra)
    .where(eq(tables.documentMitra.id, id));

  let document, links = '';

  if (workDocuments.length) {
    const bapp = workDocuments.find(workDocument => workDocument.type === 'bapp');
    const bast = workDocuments.find(workDocument => workDocument.type === 'bast');
    const bappUrl = bapp ? `[BAPP] ${host}/documents/bapp/${id}/public` : undefined;
    const bastUrl = bast ? `[BAST] ${host}/documents/bast/${id}/public` : undefined;
    links = [bappUrl, bastUrl].filter(Boolean).join(', ');

    document = workDocuments[0].value;
  }
  else document = await getWorkDocumentByNameAndId({ name, id });

  if (!document) throw createError({ statusCode: 404 });

  const mappedForms = await useDB()
    .select({
      value: tables.mapping.value,
      other: tables.mapping.other,
    })
    .from(tables.mapping)
    .where(eq(tables.mapping.type, 'form'))
    .get();
  if (!mappedForms || !mappedForms.other) throw createError('Internal Server Error. >> Mapping data was missing, please contact administrator to handle this!');
  const typeMap = new Map(Object.entries(removeNullUndefined(mappedForms.other.type)));

  const payload = Object.entries(removeNullUndefined(mappedForms.other.form))
    .reduce((prev, [entryKey, workDocumentKey]) => {
      switch (typeMap.get(entryKey)) {
        case 'custom-links':
          prev[entryKey] = links;
          break;
        case 'date': {
          const value = getValueByKey(document, workDocumentKey) as string | number | undefined;
          if (value) {
            const date = new Date(value);
            prev[`${entryKey}_year`] = String(date.getFullYear());
            prev[`${entryKey}_month`] = String(date.getMonth() + 1);
            prev[`${entryKey}_day`] = String(date.getDate());
          }
          break;
        }

        default:
          prev[entryKey] = getValueByKey(document, workDocumentKey) as string;
          break;
      }
      return prev;
    }, {} as Record<string, string>);

  const params = new URLSearchParams(payload);
  return `${formUrl}?${params}`;
});
