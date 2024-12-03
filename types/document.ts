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
  workKey?: string;
  [key: string]: unknown;
}

export type WorkAndKey = WorkDocument & { key: string };

export interface WorkDocumentComposable {
  document: Ref<DocumentState>;
  work: ComputedRef<WorkDocument | undefined>;
  workKey: ComputedRef<string | undefined>;
  setWork: (data: WorkAndKey) => void;
}
