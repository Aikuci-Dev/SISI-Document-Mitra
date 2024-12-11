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
  workRelated?: RelatedWork[];
  workKey?: string;
  [key: string]: unknown;
}

export type RelatedWork = {
  type: DOCUMENTS_TYPE;
  value: WorkDocument;
};
export type WorkMetaStatus = {
  type: DOCUMENTS_TYPE;
  status: STATUSES_TYPE;
};
export type WorkMeta = {
  key: string;
  statuses: WorkMetaStatus[];
};
export type WorkWithMeta = WorkDocument & {
  meta: WorkMeta;
  related?: RelatedWork[];
};

export interface WorkDocumentComposable {
  document: Ref<DocumentState>;
  work: ComputedRef<WorkDocument | undefined>;
  workRelated: ComputedRef<RelatedWork[] | undefined>;
  workKey: ComputedRef<string | undefined>;
  setWork: (data: WorkDocument) => void;
  setWorkKey: (data: string) => void;
  setWorkRelated: (data: RelatedWork[]) => void;
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
