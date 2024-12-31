import { STATUSES, type STATUSES_TYPE } from '~~/types/document';

// --- Utility Function ---
export const isStatusNotInitiated = (status: STATUSES_TYPE) => status !== STATUSES.initiated;
export const isStatusNotNilOrDraft = (status: STATUSES_TYPE) => status !== STATUSES.nil && status !== STATUSES.draft;
export const isStatusInitiatedOrRejected = (status: STATUSES_TYPE) => [STATUSES.initiated, STATUSES.rejected].includes(status as 'initiated' | 'rejected');
