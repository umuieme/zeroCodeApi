import { z } from "zod";

export const createProjectSchema = z.object({
  name: z.string().min(1, "Name is required"),
  description: z.string().optional(),
  logo: z.string().url("Invalid URL format").optional().or(z.literal('')),
  userId: z.string().min(1, "Owner is required"),
});

export const updateProjectSchema = z.object({
  name: z.string().min(1, "Name is required").optional(),
  description: z.string().optional(),
  logo: z.string().url("Invalid URL format").optional().or(z.literal('')),
  userId: z.string().min(1, "Owner is required").optional(), 
});
