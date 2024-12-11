import { DOCUMENTS, STATUSES, type DOCUMENTS_TYPE, type STATUSES_TYPE } from '~~/types/document';

// --- Utility Function ---

// Checks if a type is one of the accepted document types.
export function isValidDocumentType(type: string): type is DOCUMENTS_TYPE {
  return Object.values(DOCUMENTS).includes(type as DOCUMENTS_TYPE);
}

// Checks if a type is one of the accepted document statuses.
export function isValidStatusType(type: string): type is STATUSES_TYPE {
  return Object.values(STATUSES).includes(type as STATUSES_TYPE);
}
