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
    meta_work: WorkMeta;
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

export type WorkMeta = {
  key: string;
  status: string;
};
export type WorkWithMeta = WorkDocument & {
  meta: WorkMeta;
};

export interface WorkDocumentComposable {
  document: Ref<DocumentState>;
  work: ComputedRef<WorkDocument | undefined>;
  workKey: ComputedRef<string | undefined>;
  setWork: (data: WorkWithMeta) => void;
}
