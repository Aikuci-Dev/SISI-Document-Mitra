import type { TableColumn, TableRow } from './table';
import type { WorkDocument, WorkDocumentKeys } from './schema/document';

// META
export type WorkMeta = {
  key: string;
  status: STATUSES_TYPE;
};
export type WorkWithMeta = WorkDocument & {
  meta: WorkMeta;
};
export type MappedWork = {
  original: WorkDocument;
  value: WorkDocument;
  isValidated?: boolean | null;
  isApproved?: boolean | null;
  signedAt?: Date | null;
  revisedAt?: Date | null;
};

// TABLE
export interface DocumentTableColumn extends TableColumn {
  meta: {
    mapped_key?: string;
  };
}
export interface DocumentTableRow extends TableRow {
  meta: WorkMeta & {
    mapped_work: MappedWork;
  };
}
export interface DocumentTable {
  columns: DocumentTableColumn[];
  rows: DocumentTableRow[];
}

// STATE
export interface DocumentState {
  work?: WorkDocument;
  workKey?: string;
  [key: string]: unknown;
}
export interface WorkDocumentComposable {
  document: Ref<DocumentState>;
  work: ComputedRef<WorkDocument | undefined>;
  workKey: ComputedRef<string | undefined>;
  setWork: (data: WorkDocument) => void;
  setWorkKey: (data: string) => void;
}

export const WORK_DOCUMENT: Partial<Record<WorkDocumentKeys, string | null>> = {
  employeeName: 'Name',
  employeeRole: 'Role',
  employeeSignUrl: 'Signature',
  supervisorName: 'Supervisor Name',
  supervisorRole: 'Supervisor Role',
  supervisorSignUrl: 'Supervisor Signature',

  detailsNumber: 'Project Number',
  detailsTitle: 'Project Title',
  detailsDateStart: 'Start Date',
  detailsDateEnd: 'End Date',
  detailsDateTsStart: 'Start Date (TS)',
  detailsDateTsEnd: 'End Date (TS)',

  poNumber: 'PO',
  bappNumber: 'BAPP',
  bappDate: 'BAPP Date',
  bappDateTs: 'BAPP Date (TS)',
  invoiceNumber: 'Invoice',
  invoiceNominal: 'Invoice Nominal',
  invoiceDate: 'Invoice Date',
  invoiceDateTs: 'Invoice Date (TS)',
  bastNumber: 'BAST',
};

export type BAPPOrBAST = 'BAPP' | 'BAST';

export const DOCUMENTS_TABLE = {
  employee: 'employee',
  supervisor: 'supervisor',
  admin: 'admin',
} as const;
export type DOCUMENTS_TABLE_TYPE = typeof DOCUMENTS_TABLE[keyof typeof DOCUMENTS_TABLE];

export const STATUSES = {
  nil: 'nil',
  draft: 'draft',
  initiated: 'initiated',
  created: 'created',
  rejected: 'rejected',
  revised: 'revised',
  approved: 'approved',
  signed: 'signed',
} as const;
export type STATUSES_TYPE = typeof STATUSES[keyof typeof STATUSES];
