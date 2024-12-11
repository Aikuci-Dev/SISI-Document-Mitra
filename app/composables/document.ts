import type { DocumentState, WorkDocumentComposable, WorkWithMeta } from '~~/types/document';

const useDocumentState = () => useState<DocumentState>('document', () => ({}));

export function useDocument(): WorkDocumentComposable {
  const documentState = useDocumentState();
  return {
    document: documentState,
    work: computed(() => documentState.value.work),
    workRelated: computed(() => documentState.value.workRelated),
    workKey: computed(() => documentState.value.workKey),
    setWork,
  };
}

function setWork(data: WorkWithMeta) {
  const { meta, related, ...rest } = data;
  useDocumentState().value.workKey = meta.key;
  useDocumentState().value.work = rest;
  useDocumentState().value.workRelated = related;
}
