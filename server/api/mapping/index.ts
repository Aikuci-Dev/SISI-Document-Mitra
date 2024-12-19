import { WORK_DOCUMENT } from '~~/types/document';
import type { WorkDocumentKeys } from '~~/types/schema/document';
import { dataFormatSchema } from '~~/types/schema/format';

const payloadSchema = dataFormatSchema.extend({});

export default defineEventHandler(async (event) => {
  const mappingData = await useDB()
    .select({
      type: tables.mapping.type,
      value: tables.mapping.value,
      map: tables.mapping.map,
    })
    .from(tables.mapping);

  const { data: query } = await getValidatedQuery(event, query => payloadSchema.safeParse(query));
  if (query?.format) {
    const columns = [
      { key: 'type', label: 'Type' },
      { key: 'workDocumentKey', label: 'Key' },
      { key: 'otherKey', label: 'Label' },
    ];
    const rows = mappingData.flatMap(item =>
      Object.entries(item.value).map(
        ([key, otherKey], index) => ({
          key: `${item.type}-${index}`,
          value: [
            item.type,
            WORK_DOCUMENT[key as WorkDocumentKeys],
            otherKey ? item.map[otherKey] : '',
          ],
        }),
      ),
    );

    return { columns, rows };
  }

  return mappingData;
});
