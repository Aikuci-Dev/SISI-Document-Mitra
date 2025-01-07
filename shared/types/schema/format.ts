import { z } from 'zod';

export const dataFormatSchema = z.object({
  format: z.enum(['datatable']).optional(),
});
