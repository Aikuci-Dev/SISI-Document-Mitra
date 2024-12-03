import type { TableColumn, TableRow } from './table';
import type { WorkDocument } from './schema/document';

export interface DocumentTableColumn extends TableColumn {
  meta: {
    mapped_key: string;
  };
}

export interface DocumentTableRow extends TableRow {
  meta: {
    mapped_work: WorkDocument;
  };
}

export interface DocumentTable {
  columns: DocumentTableColumn[];
  rows: DocumentTableRow[];
}

export interface DocumentState {
  work?: WorkDocument;
  [key: string]: unknown;
}

export interface WorkDocumentComposable {
  document: Ref<DocumentState>;
  work: ComputedRef<WorkDocument | undefined>;
  setWork: (data: WorkDocument) => void;
}
