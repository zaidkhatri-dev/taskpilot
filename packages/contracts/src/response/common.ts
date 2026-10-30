/**
 * Generic API response wrapper.
 *
 * Use this as the base for all HTTP responses from the server.
 * - success: whether the request succeeded
 * - message: human-readable status string
 * - data: the payload (T), or null for empty responses
 */
export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
}

/**
 * Response with no payload — used for actions that confirm success
 * without returning any data (e.g. create, update, delete confirmations,
 * error responses from the global error handler).
 */
export type EmptyResponse = ApiResponse<null>;
