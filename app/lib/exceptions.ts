import type { FetchResponse } from 'ofetch';
import { toast } from '~/components/shadcn/ui/toast';

export function catchFetchError(error: unknown) {
  if (error instanceof Error) {
    if (error.name !== 'FetchError') console.error(error);
  }
  else console.error('unexpected error', error);
}

export function handleResponseError(response: FetchResponse<unknown>) {
  const messages = response.statusText.split('>>');
  toast({
    title: messages[0]?.trim(),
    description: messages[1]?.trim(),
    variant: 'destructive',
  });
}
