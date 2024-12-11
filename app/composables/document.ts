import type { DocumentState, RelatedWork, WorkDocumentComposable } from '~~/types/document';
import type { WorkDocument } from '~~/types/schema/document';

const useDocumentState = () => useState<DocumentState>('document', () => ({}));

export function useDocument(): WorkDocumentComposable {
  const documentState = useDocumentState();
  return {
    document: documentState,
    work: computed(() => documentState.value.work),
    workRelated: computed(() => documentState.value.workRelated),
    workKey: computed(() => documentState.value.workKey),
    setWork,
    setWorkKey,
    setWorkRelated,
  };
}

function setWork(data: WorkDocument) {
  useDocumentState().value.work = data;
}
function setWorkKey(data: string) {
  useDocumentState().value.workKey = data;
}
function setWorkRelated(data: RelatedWork[]) {
  useDocumentState().value.workRelated = data;
}
