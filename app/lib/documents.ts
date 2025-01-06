import { STATUSES, type STATUSES_TYPE } from '~~/types/document';
import type { WorkDocument } from '~~/types/schema/document';

// --- Utility Function ---
export const isStatusNotInitiated = (status: STATUSES_TYPE) => status !== STATUSES.initiated;
export const isStatusNotNilOrDraft = (status: STATUSES_TYPE) => status !== STATUSES.nil && status !== STATUSES.draft;
export const isStatusInitiatedOrRejected = (status: STATUSES_TYPE) => [STATUSES.initiated, STATUSES.rejected].includes(status as 'initiated' | 'rejected');

// Creates and returns a new `WorkDocument` with default values.
export function makeWorkDocument(): WorkDocument {
  return {
    detailsNumber: '',
    detailsTitle: '',
    detailsDateStart: '',
    detailsDateEnd: '',
    detailsDateTsStart: 0,
    detailsDateTsEnd: 0,

    employeeName: '',
    employeeRole: '',
    employeeSignUrl: '',
    supervisorName: '',
    supervisorRole: '',
    supervisorSignUrl: '',

    poNumber: '',
    bappNumber: '',
    bappDate: '',
    bappDateTs: 0,
    invoiceNumber: '',
    invoiceNominal: 0,
    invoiceDate: '',
    invoiceDateTs: 0,
    bastNumber: '',
  };
}
