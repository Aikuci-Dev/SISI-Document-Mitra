import type { H3Event } from 'h3';
import { overrideValues, snakeCase } from './utils';
import type { SheetValues, ValueRange } from '~~/types/google';
import type { WorkDocument } from '~~/types/schema/document';
import type { DocumentTable, DocumentTableColumn } from '~~/types/document';

// Function to construct the initial WorkDocument structure
function makeWorkDocument(): WorkDocument {
  return {
    details: {
      title: '',
      date: {
        ts: {
          start: 0,
          end: 0,
        },
        date: {
          start: '',
          end: '',
        },
      },
    },
    employee: {
      name: '',
      role: '',
      sign: {
        url: '',
      },
      supervisor: {
        name: '',
        role: '',
        sign: {
          url: '',
        },
        phone: 0,
      },
    },
    po: {
      number: '',
    },
    bapp: {
      number: '',
      date: '',
      date_ts: 0,
    },
    invoice: {
      number: '',
      nominal: 0,
      date: '',
      date_ts: 0,
    },
    bast: {
      number: '',
    },
  };
}

// --- Core Data Fetching Functions ---

// Fetch spreadsheet data from Google Sheets
export const getSpreadsheetData = defineCachedFunction<SheetValues>(async (_event: H3Event) => {
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
export const getDataColumns = defineCachedFunction<DocumentTableColumn[]>(async (event: H3Event) => {
  const { headers } = await getSpreadsheetData(event);

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

// Get raw data for a specific name (e.g., freelancer)
export const getRawDataByName = defineCachedFunction<SheetValues>(async (event: H3Event, name: string) => {
  const { freelancerKey } = useRuntimeConfig().google.sheet;
  const { headers, values } = await getSpreadsheetData(event);
  const freelancerIndex = headers.findIndex(header => header.trim().toLowerCase() == freelancerKey);
  return {
    headers,
    values: freelancerIndex === -1
      ? []
      : values.filter(mitra => mitra[freelancerIndex].trim().toLowerCase() == name.trim().toLowerCase()),
  };
}, {
  maxAge: 5 * 60,
  group: 'sheetData',
  getKey: (_event: H3Event, name: string) => `raw_${name.trim()}`,
});

// Get transformed data for a specific name, converting the raw data into structured "WorkDocument" objects.
export const getDataTableByName = defineCachedFunction<DocumentTable>(async (event: H3Event, name: string) => {
  const { values } = await getRawDataByName(event, name);
  const columns = await getDataColumns(event);

  const rows = values
    .map((value) => {
      const workDocument = makeWorkDocument();

      value.forEach((item, index) => {
        if (columns[index].meta.mapped_key)
          overrideValues(workDocument, columns[index].meta.mapped_key, item.trim());
      });

      const [startDay, startMonth, startYear] = workDocument.details.date.date.start.split('/');
      const [endDay, endMonth, endYear] = workDocument.details.date.date.end.split('/');
      workDocument.details.date.ts.start = new Date(Number(startYear), Number(startMonth) - 1, Number(startDay)).getTime();
      workDocument.details.date.ts.end = new Date(Number(endYear), Number(endMonth) - 1, Number(endDay)).getTime();

      const [bappDay, bappMonth, bappYear] = workDocument.bapp.date.split('/');
      const [invoiceDay, invoiceMonth, invoiceYear] = workDocument.invoice.date.split('/');
      workDocument.bapp.date_ts = new Date(Number(bappYear), Number(bappMonth) - 1, Number(bappDay)).getTime();
      workDocument.invoice.date_ts = new Date(Number(invoiceYear), Number(invoiceMonth) - 1, Number(invoiceDay)).getTime();

      workDocument.employee.supervisor.role = 'Project Manager';

      return { key: `${workDocument.details.date.ts.end}-${workDocument.po.number}`, value, meta: { mapped_work: workDocument } };
    })
    .filter(value => value.meta.mapped_work.po.number)
    .sort((prev, curr) => curr.meta.mapped_work.bapp.date_ts - prev.meta.mapped_work.bapp.date_ts);

  return { columns, rows };
}, {
  maxAge: 5 * 60,
  group: 'sheetData',
  getKey: (_event: H3Event, name: string) => `datatable_${name.trim()}`,
});

// Get WorkDocument by a specific name and ID
export async function getWorkDocumentByNameAndId(event: H3Event, context: { name: string; id: string }): Promise<WorkDocument> {
  const { name, id } = context;

  const dataTables = await getDataTableByName(event, name);
  const dataTable = dataTables.rows.find(row => row.key === id);
  if (!dataTable)
    throw createError({
      statusCode: 500,
      statusMessage: 'Something went wrong. >> Please refresh the page OR try again later.',
    });

  return dataTable.meta.mapped_work;
};

// --- Static Column Mapping ---

// TODO-Next: Make MAPPED_COLUMNS dynamic and configurable.
// The current hardcoded mapping should be made customizable, allowing users to define mappings.
// Consider implementing a feature where users can map data from various sources to properties in the WorkDocument interface.
// The mapping could be stored in a configuration file (e.g., JSON) or a user interface for easy customization.
export const MAPPED_COLUMNS = {
  freelancer: 'employee.name',
  role: 'employee.role',
  start_kontrak: 'details.date.date.start',
  end_kontrak: 'details.date.date.end',
  p_m: 'employee.supervisor.name',
  // "no_project": "details.number",
  nama_project: 'details.title',
  n_o_p_o: 'po.number',
  tgl_invoice_b_a_p_p: 'bapp.date',
  j_t_pembayaran: 'invoice.date',
  nomor_b_a_p_p: 'bapp.number',
  nomor_b_a_s_t: 'bast.number',
  nomor_invoice: 'invoice.number',
} as const;
export type MAPPED_COLUMNS_KEYS = keyof typeof MAPPED_COLUMNS;

// TODO-Next: Make MAPPED_FORMS dynamic and configurable.
export const MAPPED_FORMS = {
  'entry.1424391317': 'employee.name',
  'entry.2068564928': 'employee.supervisor.name',
  'entry.1805086296': 'details.title',
  'entry.741837358': '', // document links
  'entry.283497930_year': 'details.date.date.end',
  'entry.283497930_month': 'details.date.date.end',
  'entry.283497930_day': 'details.date.date.end',
} as const;
export type MAPPED_FORMS_KEYS = keyof typeof MAPPED_FORMS;
