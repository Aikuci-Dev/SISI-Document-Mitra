import type { H3Event } from "h3";
import { SheetValues, ValueRange } from "~~/types/google";

export const getSpreadsheetData = defineCachedFunction(
  async (_event: H3Event) => {
    const { apiKey, sheet } = useRuntimeConfig().google;

    const spreadsheetUrl = `https://sheets.googleapis.com/v4/spreadsheets/${sheet.id}/values/${sheet.range}?key=${apiKey}`;
    const data: ValueRange = await $fetch(spreadsheetUrl);

    const [headers, ...rest] = data.values;
    return { headers, values: rest } as SheetValues;
  },
  {
    maxAge: 5 * 60,
    group: "sheetData",
    getKey: () => "all",
  }
);

export const getSpreadsheetDataColumns = defineCachedFunction(
  async (event: H3Event) => {
    const { headers } = await getSpreadsheetData(event);
    return headers;
  },
  {
    maxAge: 5 * 60,
    group: "sheetData",
    getKey: () => "columns",
  }
);

export const getSpreadsheetDataByName = defineCachedFunction(
  async (event: H3Event, name: string) => {
    const { headers, values } = await getSpreadsheetData(event);

    return {
      headers,
      values: values
        .filter((mitra) => mitra[0] == name) // `freelancer` column
        .sort(
          (prev, curr) =>
            new Date(curr[8]).getTime() - new Date(prev[8]).getTime() // `Tgl. Invoice/BAPP` column
        ),
    } as SheetValues;
  },
  {
    maxAge: 1 * 60,
    group: "sheetData",
    getKey: (_event: H3Event, name: string) => name.trim(),
  }
);
