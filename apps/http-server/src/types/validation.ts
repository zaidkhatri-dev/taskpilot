import { z } from "zod";

export type GetTypeFromSchema<T> = z.infer<T>

