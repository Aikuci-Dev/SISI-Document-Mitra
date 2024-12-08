import type { MAPPED_FORMS_KEYS } from '~~/server/utils/documents';
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
  else document = await getWorkDocumentByNameAndId(event, { name, id });

  if (!document) throw createError({ statusCode: 404 });

  const [endDay, endMonth, endYear] = document.details.date.date.end.split('/');
  const payload = Object.entries(MAPPED_FORMS)
    .reduce((prev, [k, v]) => {
      switch (k) {
        case 'entry.741837358':
          prev[k as MAPPED_FORMS_KEYS] = links;
          break;
        case 'entry.283497930_year':
          prev[k as MAPPED_FORMS_KEYS] = endYear;
          break;
        case 'entry.283497930_month':
          prev[k as MAPPED_FORMS_KEYS] = endMonth;
          break;
        case 'entry.283497930_day':
          prev[k as MAPPED_FORMS_KEYS] = endDay;
          break;

        default:
          prev[k as MAPPED_FORMS_KEYS] = getValueByKey(document, v) as string;
          break;
      }
      return prev;
    }, {} as Record<string, string>);

  const params = new URLSearchParams(payload);
  return `${formUrl}?${params}`;
});
