import z from "zod";

export const emailSchema = z
  .email("Please enter a valid email address")
  .trim()
  .toLowerCase();
export const userNameSchema = z
  .string()
  .trim()
  .min(1, "Username must be at least 1 character long")
  .max(30, "Username must be at most 30 characters long")
  .toLowerCase()
  .regex(
    /^[a-z0-9_.]+$/,
    "Username can only contain lowercase letters, numbers, underscores, and dots",
  );
