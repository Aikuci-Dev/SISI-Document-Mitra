import { isNotUndefined, overrideValues, snakeCase } from './utils';
import type { SheetValues, ValueRange } from '~~/types/google';
import type { WorkDocument } from '~~/types/schema/document';
import type { STATUSES_TYPE, DocumentTable, DocumentTableColumn, DOCUMENTS_TYPE } from '~~/types/document';
import { DOCUMENTS, STATUSES } from '~~/types/document';

// Function to construct the initial WorkDocument structure
function makeWorkDocument(): WorkDocument {
  return {
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

// --- Core Data Fetching Functions ---

// Fetch spreadsheet data from Google Sheets
const getSpreadsheetData = defineCachedFunction<SheetValues>(async () => {
  const { apiKey, sheet } = useRuntimeConfig().google;
  const spreadsheetUrl = `https://sheets.googleapis.com/v4/spreadsheets/${sheet.id}/values/${sheet.range}?key=${apiKey}`;
  const data: ValueRange = await $fetch(spreadsheetUrl);

  const [headers, ...rest] = data.values;
  return { headers, values: rest };
}, {
  maxAge: 30 * 60,
  group: 'sheetData',
  getKey: () => 'all',
});

// Fetch data columns based on spreadsheet headers
const getDataColumns = defineCachedFunction<DocumentTableColumn[]>(async () => {
  const { headers } = await getSpreadsheetData();

  return headers.map((column) => {
    const key = snakeCase(column) as MAPPED_COLUMNS_KEYS;
    return { key, label: column, meta: { mapped_key: MAPPED_COLUMNS[key] } };
  });
}, {
  maxAge: 365 * 24 * 60 * 60,
  group: 'sheetData',
  getKey: () => 'columns',
});

// --- Data Retrieval Functions ---

// Get raw data for a specific name
async function getRawDataByName(name: string) {
  const { freelancerKey } = useRuntimeConfig().google.sheet;
  const { headers, values } = await getSpreadsheetData();
  const freelancerIndex = headers.findIndex(header => header.trim().toLowerCase() == freelancerKey);
  return {
    headers,
    values: freelancerIndex === -1
      ? []
      : values.filter(mitra => mitra[freelancerIndex].trim().toLowerCase() == name.trim().toLowerCase()),
  };
}

// Get transformed data for a specific name, converting the raw data into structured "WorkDocument" objects.
async function getDataTableByName(name: string): Promise<DocumentTable> {
  const { values } = await getRawDataByName(name);
  const columns = await getDataColumns();

  const rows = values
    .map((value) => {
      const workDocument = makeWorkDocument();

      value.forEach((item, index) => {
        if (columns[index].meta.mapped_key)
          overrideValues(workDocument, columns[index].meta.mapped_key, item.trim());
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

      const workKey = `${workDocument.poNumber}${workDocument.detailsDateTsEnd}`;
      return {
        key: workKey,
        value,
        meta: {
          mapped_work: workDocument,
          key: workKey,
          statuses: [{
            type: DOCUMENTS.original,
            status: STATUSES.initiated,
          }],
        },
      };
    })
    .filter(value => value.meta.mapped_work.poNumber)
    .sort((prev, curr) => curr.meta.mapped_work.bappDateTs - prev.meta.mapped_work.bappDateTs);

  return { columns, rows };
}

// Get the status of multiple work documents based on their ID
export function getWorkDocumentStatus(
  ids: string[],
  data: { id: string; type: DOCUMENTS_TYPE | null; isValidated: boolean | null; isApproved: boolean | null; signedAt: Date | null }[],
): { id: string; type: DOCUMENTS_TYPE; status: STATUSES_TYPE }[] {
  const dataMap = new Map(data.map(item => [`${item.type}-${item.id}`, item]));

  return Object.values(DOCUMENTS)
    .flatMap(type =>
      ids.map((id) => {
        if (type === DOCUMENTS.original) return { id, type, status: STATUSES.initiated };

        const item = dataMap.get(`${type}-${id}`);
        if (!item) return { id, type, status: STATUSES.initiated };

        if (!item.isValidated) return { id, type, status: STATUSES.created };
        if (!item.isApproved) return { id, type, status: STATUSES.rejected };
        if (item.signedAt) return { id, type, status: STATUSES.signed };

        return { id, type, status: STATUSES.approved };
      }),
    );
}

// Get "WorkDocument" objects and add status information.
export const getDataTableWithStatusByName = defineCachedFunction<DocumentTable>(async (name: string) => {
  const datatables = await getDataTableByName(name);

  const ids = datatables.rows.map(row => row.key);
  const workDocuments = await useDB()
    .select({
      id: tables.documentMitra.id,
      type: tables.documentMitra.type,
      isValidated: tables.documentMitra.isValidated,
      isApproved: tables.documentMitra.isApproved,
      signedAt: tables.documentMitra.signedAt,
    })
    .from(tables.documentMitra)
    .where(inArray(tables.documentMitra.id, ids));

  const statuses = getWorkDocumentStatus(ids, workDocuments);
  const statusesMap = new Map(statuses.map(status => [`${status.type}-${status.id}`, status.status]));
  datatables.rows = datatables.rows.map((row) => {
    const { meta, ...rest } = row;
    const { key, mapped_work } = meta;
    const isBastExist = mapped_work.bastNumber?.length;

    return {
      ...rest,
      meta: {
        mapped_work,
        key,
        statuses: Object.values(DOCUMENTS)
          .map((type) => {
            if (type === DOCUMENTS.original) return; // Comment if client needs status for 'original' type
            if (type === DOCUMENTS.bast && !isBastExist) return;

            return { type, status: statusesMap.get(`${type}-${key}`) as STATUSES_TYPE };
          })
          .filter(isNotUndefined),
      },
    };
  });

  return datatables;
}, {
  maxAge: 5 * 60,
  group: 'sheetData',
  getKey: (name: string) => `datatable-${name.trim()}`,
});

// Get WorkDocument by a specific name and ID
export async function getWorkDocumentByNameAndId(context: { name: string; id: string }): Promise<WorkDocument> {
  const { name, id } = context;

  const dataTables = await getDataTableWithStatusByName(name);
  const dataTable = dataTables.rows.find(row => row.key === id);
  if (!dataTable)
    throw createError({
      statusCode: 500,
      statusMessage: 'Something went wrong. >> Please refresh the page OR try again later.',
    });

  return dataTable.meta.mapped_work;
};

// --- Utility Function ---
// Checks if a type is one of the accepted document types.
export function isValidDocumentType(type: string): type is DOCUMENTS_TYPE {
  return Object.values(DOCUMENTS).includes(type as DOCUMENTS_TYPE);
}
// Checks if a type is one of the accepted document statuses.
export function isValidStatusType(type: string): type is STATUSES_TYPE {
  return Object.values(STATUSES).includes(type as STATUSES_TYPE);
}

// --- Static Column Mapping ---

// TODO-Next: Make MAPPED_COLUMNS dynamic and configurable.
// The current hardcoded mapping should be made customizable, allowing users to define mappings.
// Consider implementing a feature where users can map data from various sources to properties in the WorkDocument interface.
// The mapping could be stored in a configuration file (e.g., JSON) or a user interface for easy customization.
export const MAPPED_COLUMNS = {
  inti: 'employeeName',
  role: 'employeeRole',
  start_kontrak: 'detailsDateStart',
  end_kontrak: 'detailsDateEnd',
  p_m: 'supervisorName',
  // "no_project": "detailsNumber",
  nama_project: 'detailsTitle',
  n_o_p_o: 'poNumber',
  tgl_invoice_b_a_p_p: 'bappDate',
  j_t_pembayaran: 'invoiceDate',
  nomor_b_a_p_p: 'bappNumber',
  nomor_b_a_s_t: 'bastNumber',
  nomor_invoice: 'invoiceNumber',
} as const;
export type MAPPED_COLUMNS_KEYS = keyof typeof MAPPED_COLUMNS;

// TODO-Next: Make MAPPED_FORMS dynamic and configurable.
export const MAPPED_FORMS = {
  'entry.1424391317': 'employeeName',
  'entry.2068564928': 'supervisorName',
  'entry.1805086296': 'detailsTitle',
  'entry.741837358': '', // document links
  'entry.283497930_year': 'detailsDateEnd',
  'entry.283497930_month': 'detailsDateEnd',
  'entry.283497930_day': 'detailsDateEnd',
} as const;
export type MAPPED_FORMS_KEYS = keyof typeof MAPPED_FORMS;
