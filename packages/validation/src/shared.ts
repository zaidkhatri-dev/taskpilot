import z from "zod";

export const emailSchema = z
  .string("Invalid email format")
  .trim()
  .toLowerCase()
  .pipe(z.email("Invalid email format"));

export const userNameSchema = z
  .string("Invalid username format")
  .trim()
  .min(1, "Username must be at least 1 character long")
  .max(30, "Username must be at most 30 characters long")
  .regex(
    /^[a-z0-9_.]+$/,
    "Username can only contain lowercase letters, numbers, underscores, and dots",
  );

export const nameSchema50 = z
  .string("Invalid name format")
  .trim()
  .toLowerCase()
  .min(1, "Must be at least 1 character long")
  .max(50, "Must be at most 50 characters long");

export const nameSchema100 = z
  .string("Invalid name format")
  .trim()
  .toLowerCase()
  .min(1, "Name must be at least 1 character long")
  .max(100, "Name must be at most 100 characters long");

export const uuidSchema = z.uuid("Invalid ID format");
