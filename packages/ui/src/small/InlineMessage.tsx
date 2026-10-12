import * as React from "react";

export type InlineMessageVariant = "error" | "warning" | "success" | "info";

export interface InlineMessageProps
  extends Omit<React.HTMLAttributes<HTMLParagraphElement>, "content"> {
  /**
   * The message text or ReactNode to display inline below a form field.
   */
  message: React.ReactNode;

  /**
   * Visual variant controlling the icon and color.
   * - "error"   : failure red (#eb5757) — default
   * - "warning" : amber (#f2994a)
   * - "success" : semantic green (#27a644)
   * - "info"    : lavender-blue (#5e6ad2)
   */
  variant?: InlineMessageVariant;
}

const variantConfig: Record<
  InlineMessageVariant,
  { color: string; icon: React.ReactNode }
> = {
  error: {
    color: "var(--color-failure, #eb5757)",
    icon: (
      <svg
        className="w-3.5 h-3.5 shrink-0 mt-px"
        viewBox="0 0 14 14"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden="true"
      >
        <circle cx="7" cy="7" r="5.5" stroke="currentColor" strokeWidth="1.25" />
        <path
          d="M7 4.5V7.5"
          stroke="currentColor"
          strokeWidth="1.25"
          strokeLinecap="round"
        />
        <circle cx="7" cy="9.5" r="0.625" fill="currentColor" />
      </svg>
    ),
  },
  warning: {
    color: "var(--color-warning, #f2994a)",
    icon: (
      <svg
        className="w-3.5 h-3.5 shrink-0 mt-px"
        viewBox="0 0 14 14"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden="true"
      >
        <path
          d="M6.242 2.187a.875.875 0 011.516 0l4.546 7.875A.875.875 0 0111.546 11.5H2.454a.875.875 0 01-.758-1.438l4.546-7.875z"
          stroke="currentColor"
          strokeWidth="1.25"
          strokeLinejoin="round"
        />
        <path
          d="M7 5.25v2.625"
          stroke="currentColor"
          strokeWidth="1.25"
          strokeLinecap="round"
        />
        <circle cx="7" cy="9.625" r="0.625" fill="currentColor" />
      </svg>
    ),
  },
  success: {
    color: "var(--color-success, #27a644)",
    icon: (
      <svg
        className="w-3.5 h-3.5 shrink-0 mt-px"
        viewBox="0 0 14 14"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden="true"
      >
        <circle cx="7" cy="7" r="5.5" stroke="currentColor" strokeWidth="1.25" />
        <path
          d="M4.5 7.25L6.125 8.875L9.5 5.5"
          stroke="currentColor"
          strokeWidth="1.25"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    ),
  },
  info: {
    color: "var(--color-primary, #5e6ad2)",
    icon: (
      <svg
        className="w-3.5 h-3.5 shrink-0 mt-px"
        viewBox="0 0 14 14"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden="true"
      >
        <circle cx="7" cy="7" r="5.5" stroke="currentColor" strokeWidth="1.25" />
        <path
          d="M7 6.125V9.625"
          stroke="currentColor"
          strokeWidth="1.25"
          strokeLinecap="round"
        />
        <circle cx="7" cy="4.375" r="0.625" fill="currentColor" />
      </svg>
    ),
  },
};

export const InlineMessage = React.forwardRef<
  HTMLParagraphElement,
  InlineMessageProps
>(
  (
    { message, variant = "error", className = "", style, ...restProps },
    ref
  ) => {
    const { color, icon } = variantConfig[variant] ?? variantConfig.error;

    return (
      <p
        ref={ref}
        role="alert"
        aria-live="polite"
        className={`inline-flex items-start gap-1.5 font-sans m-0 animate-fade-in ${className}`}
        style={{
          color,
          fontSize: "var(--text-caption, 0.75rem)",
          lineHeight: "var(--leading-relaxed, 1.40)",
          ...style,
        }}
        {...restProps}
      >
        {icon}
        <span>{message}</span>
      </p>
    );
  }
);

InlineMessage.displayName = "InlineMessage";

export default InlineMessage;
