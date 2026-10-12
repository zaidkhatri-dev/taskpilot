"use client";

import { useActionState, useEffect, useState } from "react";
import TextInput from "@repo/ui/form/TextInput";
import SecondaryButton from "@repo/ui/buttons/SecondaryButton";
import Toast from "@repo/ui/small/Toast";
import Spinner from "@repo/ui/small/Spinner";
import InlineMessage from "@repo/ui/small/InlineMessage";
import { generateLink } from "@/lib/actions/auth";

export function LoginForm() {
  const [state, formAction, isPending] = useActionState(generateLink, null);
  const [isInputDirty, setIsInputDirty] = useState(false);

  // Reset dirty flag when a new action response arrives
  useEffect(() => {
    setIsInputDirty(false);
  }, [state]);

  // True when a validation failure names the email field specifically.
  // Disabled when the form is submitted again (isPending) or when user edits the input.
  const emailError =
    !isPending && !isInputDirty && state && !state.success && state.path === "email"
      ? state.message
      : null;

  // API-level / generic failures (no field path) shown as a top-level toast.
  const toastError =
    !isPending && state && !state.success && !state.path ? state : null;

  return (
    <div className="w-full max-w-[400px] mx-auto flex flex-col gap-5">
      {/* Success toast */}
      {state?.success && (
        <Toast
          status="success"
          content={state.message}
          className="w-full"
          duration={30}
        />
      )}

      {/* Generic API error toast (no specific field path) */}
      {toastError && (
        <Toast
          status="failure"
          content={toastError.message}
          className="w-full"
        />
      )}

      <div
        className="w-full bg-surface-1 border border-hairline rounded-lg p-6 sm:p-8 shadow-2xl flex flex-col gap-6 animate-fade-in"
        style={{
          backgroundColor: "var(--color-surface-1, #0f1011)",
          borderColor: "var(--color-hairline, #23252a)",
          boxShadow:
            "0 1px 0 0 rgba(255, 255, 255, 0.05) inset, 0 20px 25px -5px rgba(0, 0, 0, 0.7), 0 8px 10px -6px rgba(0, 0, 0, 0.7)",
        }}
      >
        {/* Brand / Header */}
        <div className="flex flex-col gap-2 text-left">
          <div className="flex items-center gap-2 mb-1">
            <div
              className="w-7 h-7 rounded-md flex items-center justify-center text-white"
              style={{
                backgroundColor: "var(--color-primary, #5e6ad2)",
              }}
            >
              <svg
                className="w-4 h-4"
                viewBox="0 0 16 16"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M3 8L6.5 11.5L13 4.5"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </div>
            <span
              className="font-sans font-medium text-ink text-sm tracking-tight"
              style={{ color: "var(--color-ink, #f7f8f8)" }}
            >
              TaskPilot
            </span>
          </div>

          <h1
            className="font-sans font-medium text-ink tracking-tight m-0"
            style={{
              color: "var(--color-ink, #f7f8f8)",
              fontSize: "var(--text-card-title, 1.375rem)",
              letterSpacing: "var(--tracking-card-title, -0.4px)",
              lineHeight: "1.25",
            }}
          >
            Log in to your account
          </h1>
          <p
            className="font-sans text-ink-subtle m-0 leading-normal"
            style={{
              color: "var(--color-ink-subtle, #8a8f98)",
              fontSize: "var(--text-body-sm, 0.875rem)",
            }}
          >
            Enter your work email address to receive a magic sign-in link.
          </p>
        </div>

        {/* Form */}
        <form action={formAction} noValidate className="flex flex-col gap-4">
          <div className="flex flex-col gap-1.5">
            <label
              htmlFor="email"
              className="font-sans text-body-sm font-medium text-ink-muted"
              style={{
                color: "var(--color-ink-muted, #d0d6e0)",
                fontSize: "var(--text-body-sm, 0.875rem)",
              }}
            >
              Email address
            </label>
            <TextInput
              id="email"
              name="email"
              type="email"
              placeholder="name@company.com"
              required
              autoComplete="email"
              disabled={isPending}
              autoFocus
              onChange={() => setIsInputDirty(true)}
              // Visually highlight the input border when it has a validation error
              style={
                emailError
                  ? { borderColor: "var(--color-failure, #eb5757)" }
                  : undefined
              }
              aria-invalid={emailError ? "true" : undefined}
              aria-describedby={emailError ? "email-error" : undefined}
            />
            {/* Inline validation message — rendered only when the email field fails */}
            {emailError && (
              <InlineMessage
                id="email-error"
                variant="error"
                message={emailError}
              />
            )}
          </div>

          <div className="pt-2">
            <SecondaryButton
              type="submit"
              disabled={isPending}
              className="w-full justify-center"
              content={
                isPending ? (
                  <span className="inline-flex items-center gap-2">
                    <Spinner size="sm" color="current" />
                    Sending link...
                  </span>
                ) : (
                  "Send Email"
                )
              }
            />
          </div>
        </form>

        {/* Footer info */}
        <div
          className="border-t border-hairline pt-4 text-center font-sans text-caption text-ink-tertiary"
          style={{
            borderColor: "var(--color-hairline, #23252a)",
            color: "var(--color-ink-tertiary, #62666d)",
            fontSize: "var(--text-caption, 0.75rem)",
          }}
        >
          By continuing, you agree to TaskPilot&apos;s{" "}
          <span className="text-ink-subtle underline underline-offset-2 cursor-pointer hover:text-ink transition-colors">
            Terms of Service
          </span>{" "}
          and{" "}
          <span className="text-ink-subtle underline underline-offset-2 cursor-pointer hover:text-ink transition-colors">
            Privacy Policy
          </span>
          .
        </div>
      </div>
    </div>
  );
}

export default LoginForm;
