import type { DocumentState, WorkDocumentComposable, WorkAndKey } from '~~/types/document';

const useDocumentState = () => useState<DocumentState>('document', () => ({}));

export function useDocument(): WorkDocumentComposable {
  const documentState = useDocumentState();
  return {
    document: documentState,
    work: computed(() => documentState.value.work),
    workKey: computed(() => documentState.value.workKey),
    setWork,
  };
}

function setWork(data: WorkAndKey) {
  const { key, ...rest } = data;
  useDocumentState().value.workKey = key;
  useDocumentState().value.work = rest;
}
