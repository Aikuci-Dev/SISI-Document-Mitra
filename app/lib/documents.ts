import { STATUSES, type STATUSES_TYPE } from '~~/types/document';

// --- Utility Function ---

// Checks if a type is one of the accepted document statuses.
export function isValidStatusType(type: string): type is STATUSES_TYPE {
  return Object.values(STATUSES).includes(type as STATUSES_TYPE);
}
