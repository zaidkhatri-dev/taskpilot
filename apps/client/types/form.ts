export interface FieldError {
  path: string;
  message: string;
}

export interface FormActionState {
  success: boolean;
  message: string;
  errors: FieldError[] | null;
  values: Record<string, unknown> | null;
  data: Record<string, unknown> | null;
}

export interface FormProps {
  formAction: (formData: FormData) => void;
  isPending: boolean;
  fieldErrors: FieldError[] | null;
  values: Record<string, unknown>;
}
