import type { TableColumn, TableRow } from './table';
import type { WorkDocument } from './schema/document';

export interface DocumentTableColumn extends TableColumn {
  meta: {
    mapped_key: string;
  };
}

export interface DocumentTableRow extends TableRow {
  meta: WorkMeta & {
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

export type WorkMeta = {
  key: string;
  status: STATUSES_TYPE;
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

export const DOCUMENTS = {
  original: 'original',
  bapp: 'bapp',
  bast: 'bast',
} as const;
export type DOCUMENTS_TYPE = typeof DOCUMENTS[keyof typeof DOCUMENTS];

export const STATUSES = {
  initiated: 'initiated',
  created: 'created',
  rejected: 'rejected',
  approved: 'approved',
  signed: 'signed',
} as const;
export type STATUSES_TYPE = typeof STATUSES[keyof typeof STATUSES];
