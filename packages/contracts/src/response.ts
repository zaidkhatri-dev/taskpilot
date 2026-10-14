interface BaseResponse {
  success: boolean;
  message: string;
}

export interface DefaultResponse extends BaseResponse {
  data: null;
}

export interface UserNotOnboardedResponse extends BaseResponse {
  data: {
    isUserOnboarded: false;
  };
}

/**
 * FormActionResponse — returned by server actions wired to useActionState.
 * Extends DefaultResponse with an optional `path` field that names the
 * specific form field that failed validation (e.g. "email"), enabling
 * the client form to render an inline error below the correct input.
 *
 * `path` is only present on validation failures originating from
 * validateAction(). API-level failures omit it.
 */
export interface FormActionResponse extends BaseResponse {
  data: null | Record<string, unknown>;
  path: null | string;
  values: null | Record<string, unknown>;
}
