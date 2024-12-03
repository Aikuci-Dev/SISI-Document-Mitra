import { z } from 'zod';

export const signSchema = z.object({
  url: z.string(),
});
export type Sign = z.infer<typeof signSchema>;

export const employeeInfoSchema = z.object({
  name: z.string(),
  role: z.string(),
  sign: signSchema,
  supervisor: z.object({
    name: z.string(),
    role: z.string(),
    sign: signSchema,
    phone: z.number().optional(),
  }),
});
export type EmployeeInfo = z.infer<typeof employeeInfoSchema>;

export const workDocumentSchema = z.object({
  details: z.object({
    title: z.string(),
    date: z.object({
      ts: z.object({
        start: z.number(),
        end: z.number(),
      }),
      date: z.object({
        start: z.string(),
        end: z.string(),
      }),
    }),
  }),
  employee: employeeInfoSchema,
  po: z.object({
    number: z.string(),
  }),
  bapp: z.object({
    number: z.string(),
    date: z.string(),
    date_ts: z.number(),
  }),
  invoice: z.object({
    number: z.string(),
    nominal: z.number().optional(),
    date: z.string(),
    date_ts: z.number(),
  }),
  bast: z
    .object({
      number: z.string(),
    })
    .optional(),
});
export type WorkDocument = z.infer<typeof workDocumentSchema>;
