"use client";

import { ArrowLeft, PlusIcon, SendToBackIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Field,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
  FieldSet,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Spinner } from "@/components/ui/spinner";
import type { FormProps } from "@/types/form";
import { getFieldError } from "@/lib/utils/form";

interface CreateOrganizationFormProps extends FormProps {
  setShowForm: (show: boolean) => void;
}

export default function CreateOrganizationForm({
  formAction,
  isPending,
  fieldErrors,
  values,
  setShowForm,
}: CreateOrganizationFormProps) {
  const nameError = getFieldError(fieldErrors, "name");
  const descriptionError = getFieldError(fieldErrors, "description");

  return (
    <form noValidate action={formAction} className="w-full">
      <FieldSet>
        <Button
          variant="link"
          size="sm"
          className="w-max px-2 py-2"
          onClick={() => setShowForm(false)}
        >
          <ArrowLeft data-icon="inline-start" /> Back
        </Button>
        <FieldGroup>
          <Field data-invalid={!!nameError}>
            <FieldLabel htmlFor="name">Name</FieldLabel>
            <Input
              type="text"
              name="name"
              id="name"
              required
              autoComplete="organization"
              defaultValue={values?.name ? String(values.name) : ""}
              aria-invalid={!!nameError}
              aria-describedby={nameError ? "name-error" : "name-desc"}
            />
            <div className="min-h-6">
              {nameError ? (
                <FieldError id="name-error">{nameError}</FieldError>
              ) : (
                <FieldDescription id="name-desc">
                  Enter your organization name
                </FieldDescription>
              )}
            </div>
          </Field>

          <Field data-invalid={!!descriptionError}>
            <FieldLabel htmlFor="description">Description</FieldLabel>
            <Input
              type="text"
              name="description"
              id="description"
              autoComplete="off"
              defaultValue={
                values?.description ? String(values.description) : ""
              }
              aria-invalid={!!descriptionError}
              aria-describedby={
                descriptionError ? "description-error" : "description-desc"
              }
            />
            <div className="min-h-6">
              {descriptionError ? (
                <FieldError id="description-error">
                  {descriptionError}
                </FieldError>
              ) : (
                <FieldDescription id="description-desc">
                  Enter a brief description (optional)
                </FieldDescription>
              )}
            </div>
          </Field>

          <Button type="submit" disabled={isPending}>
            {isPending ? (
              <>
                <Spinner data-icon="inline-start" /> Creating...
              </>
            ) : (
              <>
                <PlusIcon data-icon="inline-start" /> Create
              </>
            )}
          </Button>
        </FieldGroup>
      </FieldSet>
    </form>
  );
}
