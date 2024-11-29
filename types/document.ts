export interface TableColumn {
  key: string;
  label: string;
}

export interface DocumentTableColumn extends TableColumn {
  meta: {
    mapped_key: string;
  };
}

export interface Sign {
  url: string;
}

export interface EmployeeInfo {
  name: string;
  role: string;
  sign: Sign;
  supervisor: {
    name: string;
    role: string;
    sign: Sign;
    phone?: number;
  };
}

export type WorkDocument = {
  details: {
    title: string;
    date: {
      ts: {
        start: number;
        end: number;
      };
      date: {
        start: string;
        end: string;
      };
    };
  };
  employee: EmployeeInfo;
  po: {
    number: string;
  };
  bapp: {
    number: string;
    date: string;
    date_ts: number;
  };
  invoice: {
    number: string;
    nominal?: number;
    date: string;
    date_ts: number;
  };
  bast?: {
    number: string;
  };
};

export interface DocumentTableRow {
  value: string[];
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
