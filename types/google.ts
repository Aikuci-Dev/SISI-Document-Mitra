// https://developers.google.com/sheets/api/reference/rest/v4/spreadsheets.values#ValueRange
export interface ValueRange {
  range: string;
  majorDimension: 'ROWS' | 'COLUMNS';
  values: string[][];
}

export interface SheetValues {
  headers: string[];
  values: string[][];
}
