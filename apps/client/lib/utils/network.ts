export function handleNetworkError(
  error: unknown,
  values?: Record<string, unknown>,
) {
  console.error(error);
  return {
    success: false,
    message: "Network error, please try again later.",
    errors: null,
    data: null,
    path: null,
    values: values ?? null,
  };
}
