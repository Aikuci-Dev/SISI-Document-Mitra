import { overrideValues } from './utils';
import type { SheetValues, ValueRange } from '~~/types/google';
import type { WorkDocument } from '~~/types/schema/document';
import type { STATUSES_TYPE, DocumentTable, DocumentTableColumn, DocumentTableRow, MappedWork } from '~~/types/document';
import { STATUSES } from '~~/types/document';

// --- Utility Functions ---

// Checks if the provided status is a valid `STATUSES_TYPE`.
export function isValidStatusType(type: string): type is STATUSES_TYPE {
  return Object.values(STATUSES).includes(type as STATUSES_TYPE);
}

// Creates and returns a new `WorkDocument` with default values.
function makeWorkDocument(): WorkDocument {
  return {
    detailsNumber: '',
    detailsTitle: '',
    detailsDateStart: '',
    detailsDateEnd: '',
    detailsDateTsStart: 0,
    detailsDateTsEnd: 0,

    employeeName: '',
    employeeRole: '',
    employeeSignUrl: '',
    supervisorName: '',
    supervisorRole: '',
    supervisorSignUrl: '',

    poNumber: '',
    bappNumber: '',
    bappDate: '',
    bappDateTs: 0,
    invoiceNumber: '',
    invoiceNominal: 0,
    invoiceDate: '',
    invoiceDateTs: 0,
    bastNumber: '',
  };
}

// Returns the status of multiple work documents based on their IDs.
export function getWorkDocumentStatus(
  ids: string[],
  data: { id: string; isValidated: boolean | null; isApproved: boolean | null; signedAt: Date | null; revisedAt: Date | null }[],
): { id: string; status: STATUSES_TYPE }[] {
  const dataMap = new Map(data.map(item => [item.id, item]));

  return ids.map((id) => {
    const item = dataMap.get(id);
    if (!item) return { id, status: STATUSES.nil };

    if (item.revisedAt) return { id, status: STATUSES.revised };
    if (!item.isValidated) return { id, status: STATUSES.created };
    if (!item.isApproved) return { id, status: STATUSES.rejected };
    if (item.signedAt) return { id, status: STATUSES.signed };

    return { id, status: STATUSES.approved };
  });
}

// Retrieves and maps spreadsheet headers to column definitions based on configuration settings.
const mapSpreadsheetHeadersToColumns = defineCachedFunction<DocumentTableColumn[]>(async (headers: SheetValues['headers']) => {
  const mappingColumn = await useDB()
    .select({
      value: tables.mapping.value,
      map: tables.mapping.map,
      other: tables.mapping.other,
    })
    .from(tables.mapping)
    .where(eq(tables.mapping.type, 'column'))
    .get();
  if (!mappingColumn || !mappingColumn.other) return [];

  const columnMap = new Map(Object.entries(invertKeyValue(mappingColumn.value)));
  const spreadSheetColumnMap = new Map(Object.entries(invertKeyValue(mappingColumn.other.spreadsheet)));
  return headers
    .map((column, index) => {
      const key = spreadSheetColumnMap.get(column);
      return { key: key || String(index), label: column, meta: { mapped_key: columnMap.get(key!) } };
    });
}, {
  maxAge: 365 * 24 * 60 * 60,
  name: 'spreadsheet',
  getKey: () => 'mapping-columns',
});

// Converts raw spreadsheet data into structured `WorkDocument` objects based on the provided columns
function transformSpreadsheetDataToRows(columns: DocumentTableColumn[], values: SheetValues['values']): DocumentTableRow[] {
  return values
    .map((value, index) => {
      const workDocument = makeWorkDocument();

      value.forEach((item, index) => {
        const mapped_key = columns[index].meta.mapped_key;
        if (mapped_key) overrideValues(workDocument, mapped_key, item.trim());
      });

      const [startDay, startMonth, startYear] = workDocument.detailsDateStart.split('/');
      const [endDay, endMonth, endYear] = workDocument.detailsDateEnd.split('/');
      const dateStart = new Date(Number(startYear), Number(startMonth) - 1, Number(startDay));
      const dateEnd = new Date(Number(endYear), Number(endMonth) - 1, Number(endDay));
      workDocument.detailsDateTsStart = dateStart.getTime();
      workDocument.detailsDateTsEnd = dateEnd.getTime();
      workDocument.detailsDateStart = dateStart.toISOString(); // Reformat
      workDocument.detailsDateEnd = dateEnd.toISOString(); // Reformat

      const [bappDay, bappMonth, bappYear] = workDocument.bappDate.split('/');
      const [invoiceDay, invoiceMonth, invoiceYear] = workDocument.invoiceDate.split('/');
      workDocument.bappDateTs = new Date(Number(bappYear), Number(bappMonth) - 1, Number(bappDay)).getTime();
      workDocument.invoiceDateTs = new Date(Number(invoiceYear), Number(invoiceMonth) - 1, Number(invoiceDay)).getTime();

      workDocument.supervisorRole = 'Project Manager';

      const isDraft = workDocument.poNumber.toLowerCase() === 'draft';
      const workKey = `${workDocument.poNumber}${workDocument.detailsDateTsEnd}${isDraft ? index : ''}`;
      return {
        key: workKey,
        value,
        meta: {
          mapped_work: { original: workDocument, value: workDocument },
          key: workKey,
          status: isDraft ? STATUSES.draft : STATUSES.initiated,
        },
      };
    })
    .filter(value => value.meta.mapped_work.original.poNumber)
    .sort((prev, curr) => curr.meta.mapped_work.original.bappDateTs - prev.meta.mapped_work.original.bappDateTs);
}

// --- Core Data Fetching Functions ---

// Fetches data from a Google Spreadsheet and returns headers and values.
const getSpreadsheetData = defineCachedFunction<SheetValues>(async () => {
  const { apiKey, sheet } = useRuntimeConfig().google;
  const spreadsheetUrl = `https://sheets.googleapis.com/v4/spreadsheets/${sheet.id}/values/${sheet.range}?key=${apiKey}`;
  const data: ValueRange = await $fetch(spreadsheetUrl);

  const [headers, ...rest] = data.values;
  return { headers, values: rest };
}, {
  maxAge: 30 * 60,
  name: 'spreadsheet',
  getKey: () => 'raw-data',
});

// --- Data Retrieval Functions ---

// Fetches a table of work documents, filtered by the specified name or supervisor, depending on user role.
async function fetchWorkDocumentTable(context: { name?: string; supervisorName?: string; role?: 'admin' }): Promise<DocumentTable> {
  const spreadSheetData = await getSpreadsheetData();

  let values = spreadSheetData.values;
  const { name, supervisorName, role } = context;
  if (role !== 'admin') {
    if (name) {
      const { freelancerKey } = useRuntimeConfig().google.sheet;
      const freelancerIndex = spreadSheetData.headers.findIndex(header => header.trim().toLowerCase() == freelancerKey.trim().toLowerCase());
      values = freelancerIndex === -1
        ? []
        : spreadSheetData.values.filter(mitra => mitra[freelancerIndex].trim().toLowerCase() == name.trim().toLowerCase());
    }
    else if (supervisorName) {
      const { supervisorKey } = useRuntimeConfig().google.sheet;
      const supervisorIndex = spreadSheetData.headers.findIndex(header => header.trim().toLowerCase() == supervisorKey.trim().toLowerCase());
      values = supervisorIndex === -1
        ? []
        : spreadSheetData.values.filter(mitra => mitra[supervisorIndex].trim().toLowerCase() == supervisorName.trim().toLowerCase());
    }
  }

  const columns = await mapSpreadsheetHeadersToColumns(spreadSheetData.headers);
  const rows = transformSpreadsheetDataToRows(columns, values);

  return { columns, rows };
}

// Fetches a table of work documents along with their validation and approval status.
export const fetchWorkDocumentTableWithStatus = defineCachedFunction<DocumentTable>(async (context: { name?: string; type?: string; role?: 'admin' }) => {
  const { type, name, role } = context;
  const employeeName = type === 'employee' ? name : undefined;
  const supervisorName = type === 'supervisor' ? name : undefined;
  const datatables = await fetchWorkDocumentTable({ name: employeeName, supervisorName, role });

  const ids = datatables.rows.map(row => row.key);
  const workDocuments = await useDB()
    .select({
      id: tables.documentMitra.id,
      value: tables.documentMitra.value,
      isValidated: tables.documentMitra.isValidated,
      isApproved: tables.documentMitra.isApproved,
      signedAt: tables.documentMitra.signedAt,
      revisedAt: tables.documentMitra.revisedAt,
    })
    .from(tables.documentMitra)
    .where(inArray(tables.documentMitra.id, ids));

  const statuses = getWorkDocumentStatus(ids, workDocuments);
  const statusesMap = new Map(statuses.map(status => [status.id, status.status]));
  const workDocumentsMap = new Map(workDocuments.map(workDocument => [workDocument.id, workDocument]));

  datatables.rows = datatables.rows.map((row) => {
    const { meta, ...rest } = row;
    const { key, status } = meta;

    const original = meta.mapped_work.original;
    const workDocument = workDocumentsMap.get(key);
    const mapped_work: MappedWork = workDocument ? { original, ...workDocument } : { original, value: original };

    const finalStatus = statusesMap.has(key) && statusesMap.get(key) !== STATUSES.nil
      ? statusesMap.get(key)!
      : status;

    return {
      ...rest,
      meta: {
        mapped_work,
        key,
        status: finalStatus,
      },
    };
  });

  return datatables;
}, {
  maxAge: 5 * 60,
  name: 'datatable',
  shouldBypassCache: (context: { name?: string; type?: string; role?: 'admin' }) => !!context.name,
  getKey: () => 'datatable',
});

// Fetches a specific `WorkDocument` based on name and ID.
export async function getWorkDocumentByNameAndId(context: { name: string; id: string }): Promise<WorkDocument> {
  const { name, id } = context;

  const dataTables = await fetchWorkDocumentTableWithStatus({ name });
  const dataTable = dataTables.rows.find(row => row.key === id);
  if (!dataTable)
    throw createError({
      statusCode: 500,
      statusMessage: 'Something went wrong. >> Please refresh the page OR try again later.',
    });

  return dataTable.meta.mapped_work.original;
};
