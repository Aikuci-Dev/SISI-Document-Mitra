import type { DocumentState, WorkDocumentComposable, WorkWithMeta } from '~~/types/document';

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

function setWork(data: WorkWithMeta) {
  const { meta, ...rest } = data;
  useDocumentState().value.workKey = meta.key;
  useDocumentState().value.work = rest;
}
