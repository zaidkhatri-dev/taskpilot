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

export const namePartSchema = z
  .string()
  .trim()
  .min(1, "Must be at least 1 character long")
  .max(50, "Must be at most 50 characters long")
  .toLowerCase();
