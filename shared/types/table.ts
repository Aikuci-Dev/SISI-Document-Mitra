export interface TableColumn {
  key: string;
  label: string;
}

export interface TableRow {
  key: string;
  value: string[];
}

export interface DataTable {
  columns: TableColumn[];
  rows: TableRow[];
}
