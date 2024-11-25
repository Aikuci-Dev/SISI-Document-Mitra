import type { H3Event } from 'h3';
import { overrideValues, snakeCase } from './utils';
import type { SheetValues, ValueRange } from '~~/types/google';
import type { DocumentTable, DocumentTableColumn, WorkDocument } from '~~/types/document';

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
    po: {
      number: '',
    },
    bast: {
      number: 'bast',
    },
    bapp: {
      number: '',
      date: '',
      date_ts: 0,
    },
    invoice: {
      number: '',
      nominal: '',
      date: '',
      date_ts: 0,
    },
    employee: {
      name: '',
      role: '',
      supervisor: {
        name: '',
        phone: '',
      },
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
  maxAge: 5 * 60,
  group: 'sheetData',
  getKey: () => 'all',
});

// Fetch data columns based on spreadsheet headers
export const getDataColumns = defineCachedFunction<DocumentTableColumn[]>(async (event: H3Event) => {
  const { headers } = await getSpreadsheetData(event);

  return headers.map((column) => {
    const key = snakeCase(column);
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
  const { headers, values } = await getSpreadsheetData(event);
  const freelancerIndex = headers.findIndex(header => header.toLowerCase() == 'freelancer');
  return {
    headers,
    values: freelancerIndex === -1 ? [] : values.filter(mitra => mitra[freelancerIndex] == name),
  };
}, {
  maxAge: 1 * 60,
  group: 'sheetData',
  getKey: (_event: H3Event, name: string) => `raw_${name.trim()}`,
});

// Get transformed data for a specific name, converting the raw data into structured "WorkDocument" objects.
export const getDataTableByName = defineCachedFunction<DocumentTable>(async (event: H3Event, name: string) => {
  const { values } = await getRawDataByName(event, name);
  const columns = await getDataColumns(event);

  const rows = values.map((value) => {
    const workDocument = makeWorkDocument();

    value.forEach((item, index) => {
      if (columns[index].meta.mapped_key)
        overrideValues(workDocument, columns[index].meta.mapped_key, item.trim());
    });

    workDocument.details.date.ts.start = new Date(workDocument.details.date.date.start).getTime() / 1000;
    workDocument.details.date.ts.end = new Date(workDocument.details.date.date.end).getTime() / 1000;
    workDocument.bapp.date_ts = new Date(workDocument.bapp.date).getTime() / 1000;
    workDocument.invoice.date_ts = new Date(workDocument.invoice.date).getTime() / 1000;

    return { value, meta: { mapped_work: workDocument } };
  }).sort(
    (prev, curr) => curr.meta.mapped_work.bapp.date_ts - prev.meta.mapped_work.bapp.date_ts,
  );

  return { columns, rows };
  // return { columns, rows: Array(10).fill(rows) };
}, {
  maxAge: 1 * 60,
  group: 'sheetData',
  getKey: (_event: H3Event, name: string) => name.trim(),
});

// --- Static Column Mapping ---

// TODO-Next: Make MAPPED_COLUMNS dynamic and configurable.
// The current hardcoded mapping should be made customizable, allowing users to define mappings.
// Consider implementing a feature where users can map data from various sources to properties in the WorkDocument interface.
// The mapping could be stored in a configuration file (e.g., JSON) or a user interface for easy customization.
const MAPPED_COLUMNS: Record<string, string> = {
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
};
