import * as z from "zod";

export const IssueSchema = z.object({
  description: z.string(),
  date:z.date(),
});