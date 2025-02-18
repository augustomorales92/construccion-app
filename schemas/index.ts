import * as z from "zod";

export const IssueSchema = z.object({
  description: z.string(),
  date:z.date(),
});

export const projectSchema = z.object({
  name: z.string().min(3, { message: 'Name must be at least 3 characters.' }),
  description: z.string().optional(),
  address: z.string().optional(),
  budget: z.number().optional(),
  projectNumber: z.string().optional(),
  accessCode: z.string(),
});