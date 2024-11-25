import type { DocumentState, WorkDocument, WorkDocumentComposable } from '~~/types/document';

const useDocumentState = () => useState<DocumentState>('document', () => ({}));

export function useDocument(): WorkDocumentComposable {
  const documentState = useDocumentState();
  return {
    document: documentState,
    work: computed(() => documentState.value.work),
    setWork,
  };
}

function setWork(data: WorkDocument) {
  useDocumentState().value.work = data;
}
