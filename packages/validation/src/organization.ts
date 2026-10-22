import { z } from "zod";

export const createOrganizationSchema = z.object({
  name: z
    .string()
    .trim()
    .toLowerCase()
    .min(1, "Name must be at least 1 character long.")
    .max(100, "Name must be at most 100 characters long."),
  description: z.string().trim().optional(),
});
