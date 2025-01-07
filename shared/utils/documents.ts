import type { WorkDocument } from '~~/shared/types/schema/document';

// --- Utility Function ---
export const isStatusNotInitiated = (status: STATUSES_TYPE) => status !== STATUSES.initiated;
export const isStatusNotNilOrDraft = (status: STATUSES_TYPE) => status !== STATUSES.nil && status !== STATUSES.draft;
export const isStatusInitiatedOrRejected = (status: STATUSES_TYPE) => [STATUSES.initiated, STATUSES.rejected].includes(status as 'initiated' | 'rejected');

// Creates and returns a new `WorkDocument` with default values.
export function makeWorkDocument(): WorkDocument {
  return {
    detailsNumber: '',
    detailsTitle: '',
    detailsDateStart: 0,
    detailsDateEnd: 0,

    employeeName: '',
    employeeRole: '',
    employeeSignUrl: '',
    supervisorName: '',
    supervisorRole: '',
    supervisorSignUrl: '',

    poNumber: '',
    bappNumber: '',
    bappDate: 0,
    invoiceNumber: '',
    invoiceNominal: 0,
    invoiceDate: 0,
    bastNumber: '',
  };
}
