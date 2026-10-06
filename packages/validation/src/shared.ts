import z from "zod"

export const emailSchema = z.email("Please enter a valid email address")
export const INVALID_URL_MSG = "The provided URL is invalid"