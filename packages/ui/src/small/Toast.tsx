"use client";

import * as React from "react";

export type ToastStatus = "success" | "failure" | "warning" | "info" | "error";

export interface ToastAction {
  label: React.ReactNode;
  onClick: () => void;
}

export interface ToastProps
  extends Omit<React.HTMLAttributes<HTMLDivElement>, "content"> {
  /**
   * Main content of the toast notification.
   */
  content: React.ReactNode;

  /**
   * Status type determining the accent icon and color.
   */
  status: ToastStatus;

  /**
   * Auto-dismiss duration in milliseconds. Defaults to 5000. Set to 0 to disable auto-dismiss.
   */
  duration?: number;

  /**
   * Callback fired when the toast is closed/dismissed.
   */
  onClose?: () => void;

  /**
   * Optional action button (e.g., Undo, View details).
   */
  action?: ToastAction;
}

const statusConfig: Record<
  ToastStatus,
  {
    iconColor: string;
    icon: React.ReactNode;
  }
> = {
  success: {
    iconColor: "text-success",
    icon: (
      <svg
        className="w-4 h-4 shrink-0 text-success"
        viewBox="0 0 16 16"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden="true"
        style={{ color: "var(--color-success, #27a644)" }}
      >
        <circle cx="8" cy="8" r="6.25" stroke="currentColor" strokeWidth="1.5" />
        <path
          d="M5.25 8.25L7 10L10.75 6.25"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    ),
  },
  failure: {
    iconColor: "text-failure",
    icon: (
      <svg
        className="w-4 h-4 shrink-0 text-failure"
        viewBox="0 0 16 16"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden="true"
        style={{ color: "var(--color-failure, #eb5757)" }}
      >
        <circle cx="8" cy="8" r="6.25" stroke="currentColor" strokeWidth="1.5" />
        <path
          d="M5.75 5.75L10.25 10.25M10.25 5.75L5.75 10.25"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
        />
      </svg>
    ),
  },
  error: {
    iconColor: "text-failure",
    icon: (
      <svg
        className="w-4 h-4 shrink-0 text-failure"
        viewBox="0 0 16 16"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden="true"
        style={{ color: "var(--color-failure, #eb5757)" }}
      >
        <circle cx="8" cy="8" r="6.25" stroke="currentColor" strokeWidth="1.5" />
        <path
          d="M5.75 5.75L10.25 10.25M10.25 5.75L5.75 10.25"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
        />
      </svg>
    ),
  },
  warning: {
    iconColor: "text-warning",
    icon: (
      <svg
        className="w-4 h-4 shrink-0 text-warning"
        viewBox="0 0 16 16"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden="true"
        style={{ color: "var(--color-warning, #f2994a)" }}
      >
        <path
          d="M7.134 2.5a1 1 0 011.732 0l5.196 9A1 1 0 0113.196 13H2.804a1 1 0 01-.866-1.5l5.196-9z"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinejoin="round"
        />
        <path
          d="M8 6v3.25"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
        />
        <circle cx="8" cy="11.25" r="0.75" fill="currentColor" />
      </svg>
    ),
  },
  info: {
    iconColor: "text-primary",
    icon: (
      <svg
        className="w-4 h-4 shrink-0 text-primary"
        viewBox="0 0 16 16"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden="true"
        style={{ color: "var(--color-primary, #5e6ad2)" }}
      >
        <circle cx="8" cy="8" r="6.25" stroke="currentColor" strokeWidth="1.5" />
        <path
          d="M8 7v4M8 5h.01"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
        />
      </svg>
    ),
  },
};

export const Toast = React.forwardRef<HTMLDivElement, ToastProps>(
  (
    {
      content,
      status,
      duration = 5000,
      onClose,
      action,
      className = "",
      style,
      ...restProps
    },
    ref
  ) => {
    const [isVisible, setIsVisible] = React.useState(true);

    const handleDismiss = React.useCallback(() => {
      setIsVisible(false);
      onClose?.();
    }, [onClose]);

    React.useEffect(() => {
      if (duration <= 0) return;

      const timer = window.setTimeout(() => {
        handleDismiss();
      }, duration);

      return () => {
        window.clearTimeout(timer);
      };
    }, [duration, handleDismiss]);

    if (!isVisible) {
      return null;
    }

    const currentConfig = statusConfig[status] ?? statusConfig.info;

    return (
      <div
        ref={ref}
        role="status"
        aria-live="polite"
        className={`inline-flex items-center gap-3 bg-surface-2 text-ink border border-hairline hover:border-hairline-strong rounded-md px-4 py-3 min-h-[44px] shadow-xl font-sans text-body-sm transition-all duration-150 ease-out animate-fade-in ${className}`}
        style={{
          backgroundColor: "var(--color-surface-2, #141516)",
          borderColor: "var(--color-hairline, #23252a)",
          boxShadow:
            "0 1px 0 0 rgba(255, 255, 255, 0.05) inset, 0 10px 25px -5px rgba(0, 0, 0, 0.6), 0 4px 6px -4px rgba(0, 0, 0, 0.4)",
          ...style,
        }}
        {...restProps}
      >
        {currentConfig.icon}

        <div
          className="flex-1 font-sans text-body-sm text-ink leading-snug"
          style={{
            color: "var(--color-ink, #f7f8f8)",
            fontSize: "var(--text-body-sm, 0.875rem)",
          }}
        >
          {content}
        </div>

        {action && (
          <button
            type="button"
            onClick={action.onClick}
            className="text-primary hover:text-primary-hover font-sans text-body-sm font-medium transition-colors cursor-pointer focus:outline-none focus:underline shrink-0"
            style={{ color: "var(--color-primary, #5e6ad2)" }}
          >
            {action.label}
          </button>
        )}

        <button
          type="button"
          onClick={handleDismiss}
          aria-label="Dismiss notification"
          className="text-ink-tertiary hover:text-ink hover:bg-surface-3 transition-colors p-1.5 rounded-sm cursor-pointer focus:outline-none focus:ring-1 focus:ring-primary-focus/50 inline-flex items-center justify-center shrink-0 -mr-1"
        >
          <svg
            className="w-3.5 h-3.5"
            viewBox="0 0 14 14"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            aria-hidden="true"
          >
            <path
              d="M3.5 3.5L10.5 10.5M10.5 3.5L3.5 10.5"
              stroke="currentColor"
              strokeWidth="1.25"
              strokeLinecap="round"
            />
          </svg>
        </button>
      </div>
    );
  }
);

Toast.displayName = "Toast";

export default Toast;
