import { STATUSES, type STATUSES_TYPE } from '~~/types/document';

// --- Utility Function ---

// Checks if a type is one of the accepted document statuses.
export function isValidStatusType(type: string): type is STATUSES_TYPE {
  return Object.values(STATUSES).includes(type as STATUSES_TYPE);
}

// Returns the status of multiple work documents based on their IDs.
export function getWorkDocumentStatusFromFlags(
  ids: string[],
  data: { id: string; isValidated: boolean | null; isApproved: boolean | null; signedAt: Date | null; revisedAt: Date | null }[],
): { id: string; status: STATUSES_TYPE }[] {
  const dataMap = new Map(data.map(item => [item.id, item]));

  return ids.map((id) => {
    const item = dataMap.get(id);
    if (!item) return { id, status: STATUSES.nil };

    if (item.revisedAt) return { id, status: STATUSES.revised };
    if (!item.isValidated) return { id, status: STATUSES.created };
    if (!item.isApproved) return { id, status: STATUSES.rejected };
    if (item.signedAt) return { id, status: STATUSES.signed };

    return { id, status: STATUSES.approved };
  });
}

// Maps the status of multiple work documents to their corresponding flags based on document IDs.
export function getWorkDocumentFlagsFromStatus(
  ids: string[],
  data: { id: string; status: STATUSES_TYPE }[],
): { id: string; isValidated: boolean | null; isApproved: boolean | null; signedAt: Date | null; revisedAt: Date | null }[] {
  const statusMap = new Map(data.map(item => [item.id, item]));

  return ids.map((id) => {
    const item = statusMap.get(id);

    // If the document status is not found, return default values
    if (!item) return { id, isValidated: null, isApproved: null, signedAt: null, revisedAt: null };

    // Mapping status back to the original structure
    switch (item.status) {
      case STATUSES.approved:
        return { id, isValidated: true, isApproved: true, signedAt: null, revisedAt: null };
      case STATUSES.rejected:
        return { id, isValidated: true, isApproved: false, signedAt: null, revisedAt: null };
      case STATUSES.signed:
        return { id, isValidated: true, isApproved: true, signedAt: new Date(), revisedAt: null }; // Adjust signedAt as needed
      case STATUSES.revised:
        return { id, isValidated: null, isApproved: null, signedAt: null, revisedAt: new Date() }; // Adjust revisedAt as needed
      default:
        return { id, isValidated: false, isApproved: null, signedAt: null, revisedAt: null };
    }
  });
}
