import type { TableColumn, TableRow } from './table';
import type { WorkDocument, WorkDocumentKeys } from './schema/document';

// META
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
    type: 'default' | 'date';
  };
}
export interface DocumentTableRow extends TableRow {
  meta: {
    key: string;
    status: STATUSES_TYPE;
    mapped_work: MappedWork;
  };
}
export interface DocumentTable {
  columns: DocumentTableColumn[];
  rows: DocumentTableRow[];
}

// CONST
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

  poNumber: 'PO',
  bappNumber: 'BAPP',
  bappDate: 'BAPP Date',
  invoiceNumber: 'Invoice',
  invoiceNominal: 'Invoice Nominal',
  invoiceDate: 'Invoice Date',
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
