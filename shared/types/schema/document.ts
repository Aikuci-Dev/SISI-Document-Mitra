import { z } from 'zod';

export const employeeInfoSchema = z.object({
  employeeName: z.string(),
  employeeRole: z.string(),
  employeeSignUrl: z.string(),
  supervisorName: z.string(),
  supervisorRole: z.string(),
  supervisorSignUrl: z.string(),
});
export type EmployeeInfo = z.infer<typeof employeeInfoSchema>;

export const workDocumentSchema = employeeInfoSchema.extend({
  detailsNumber: z.string(),
  detailsTitle: z.string(),
  detailsDateStart: z.number(),
  detailsDateEnd: z.number(),

  poNumber: z.string(),
  bappNumber: z.string(),
  bappDate: z.number(),
  invoiceNumber: z.string(),
  invoiceNominal: z.number().optional(),
  invoiceDate: z.number(),
  bastNumber: z.string().optional(),
});
export type WorkDocument = z.infer<typeof workDocumentSchema>;
export type WorkDocumentKeys = keyof typeof workDocumentSchema.shape;
