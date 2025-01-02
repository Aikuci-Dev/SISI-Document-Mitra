import { z } from 'zod';

const payloadSchema = z.object({
  type: z.enum(['title', 'nominal']),
});

export default defineEventHandler(async (event) => {
  const { type } = await getValidatedQuery(event, query => payloadSchema.parse(query));
  console.log('type', type);

  // TODO-Last

  await new Promise(resolve =>
    setTimeout(() => { resolve(''); }, 5000),
  );

  return [{ label: 'test', value: 'test', weight: 100 }] as { label: string; value: string; weight: number }[];
});
