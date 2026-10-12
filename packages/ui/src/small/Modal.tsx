"use client";

import * as React from "react";
import { createPortal } from "react-dom";
import Spinner from "./Spinner";

export interface ModalProps
  extends Omit<React.HTMLAttributes<HTMLDivElement>, "content" | "title"> {
  /**
   * Main content of the modal. Domain agnostic and accepts any React node.
   */
  content: React.ReactNode;

  /**
   * Title or header displayed at the top of the modal.
   */
  title?: React.ReactNode;

  /**
   * Secondary description text displayed below the title.
   */
  description?: React.ReactNode;

  /**
   * Controls modal visibility. Defaults to true.
   */
  isOpen?: boolean;

  /**
   * Callback fired when the close button, top-right 'X', backdrop, or Escape key is triggered.
   */
  onClose?: () => void;

  /**
   * Callback fired when the confirm button is clicked.
   */
  onConfirm?: () => void;

  /**
   * Label or ReactNode for the confirm button. Defaults to "Confirm".
   */
  confirmText?: React.ReactNode;

  /**
   * Label or ReactNode for the close/cancel button. Defaults to "Cancel".
   */
  closeText?: React.ReactNode;

  /**
   * Displays loading state on the confirm button.
   */
  isLoading?: boolean;

  /**
   * Disables the confirm button.
   */
  isConfirmDisabled?: boolean;

  /**
   * Disables the close button.
   */
  isCloseDisabled?: boolean;

  /**
   * Whether to show the top-right close 'X' button. Defaults to true.
   */
  showCloseIcon?: boolean;

  /**
   * Whether clicking the backdrop overlay triggers onClose. Defaults to true.
   */
  closeOnOverlayClick?: boolean;

  /**
   * Whether pressing the Escape key triggers onClose. Defaults to true.
   */
  closeOnEscape?: boolean;

  /**
   * Additional className applied to the modal dialog card container.
   */
  containerClassName?: string;
}

export const Modal = React.forwardRef<HTMLDivElement, ModalProps>(
  (
    {
      content,
      title,
      description,
      isOpen = true,
      onClose,
      onConfirm,
      confirmText = "Confirm",
      closeText = "Cancel",
      isLoading = false,
      isConfirmDisabled = false,
      isCloseDisabled = false,
      showCloseIcon = true,
      closeOnOverlayClick = true,
      closeOnEscape = true,
      containerClassName = "",
      className = "",
      ...restProps
    },
    ref
  ) => {
    const [isMounted, setIsMounted] = React.useState(false);
    const titleId = React.useId();
    const descriptionId = React.useId();

    React.useEffect(() => {
      setIsMounted(true);
    }, []);

    // Handle Escape key to close modal
    React.useEffect(() => {
      if (!isOpen || !closeOnEscape) return;

      const handleKeyDown = (event: KeyboardEvent) => {
        if (event.key === "Escape") {
          event.stopPropagation();
          onClose?.();
        }
      };

      window.addEventListener("keydown", handleKeyDown);
      return () => {
        window.removeEventListener("keydown", handleKeyDown);
      };
    }, [isOpen, closeOnEscape, onClose]);

    // Lock body scrolling while the modal is open
    React.useEffect(() => {
      if (!isOpen) return;

      const originalOverflow = document.body.style.overflow;
      document.body.style.overflow = "hidden";

      return () => {
        document.body.style.overflow = originalOverflow;
      };
    }, [isOpen]);

    if (!isOpen || !isMounted) {
      return null;
    }

    const modalContent = (
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby={title ? titleId : undefined}
        aria-describedby={description ? descriptionId : undefined}
        className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto animate-fade-in"
        style={{
          backgroundColor: "rgba(0, 0, 0, 0.7)",
          backdropFilter: "blur(8px)",
          WebkitBackdropFilter: "blur(8px)",
        }}
        onClick={(e) => {
          if (e.target === e.currentTarget && closeOnOverlayClick) {
            onClose?.();
          }
        }}
      >
        <div
          ref={ref}
          {...restProps}
          className={`relative w-full max-w-lg bg-surface-1 text-ink border border-hairline rounded-lg p-6 shadow-2xl animate-scale-in transition-all duration-150 ease-out flex flex-col gap-5 ${containerClassName} ${className}`}
          style={{
            backgroundColor: "var(--color-surface-1, #0f1011)",
            borderColor: "var(--color-hairline, #23252a)",
            boxShadow:
              "0 1px 0 0 rgba(255, 255, 255, 0.05) inset, 0 20px 25px -5px rgba(0, 0, 0, 0.7), 0 8px 10px -6px rgba(0, 0, 0, 0.7)",
          }}
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          {(title || showCloseIcon) && (
            <div className="flex items-start justify-between gap-4">
              <div className="flex-1 min-w-0">
                {title && (
                  <h2
                    id={titleId}
                    className="font-sans text-card-title font-medium text-ink tracking-tight leading-snug m-0"
                    style={{
                      color: "var(--color-ink, #f7f8f8)",
                      fontSize: "var(--text-card-title, 1.375rem)",
                      letterSpacing: "var(--tracking-card-title, -0.4px)",
                    }}
                  >
                    {title}
                  </h2>
                )}
                {description && (
                  <p
                    id={descriptionId}
                    className="font-sans text-body-sm text-ink-subtle mt-1 leading-normal m-0"
                    style={{
                      color: "var(--color-ink-subtle, #8a8f98)",
                      fontSize: "var(--text-body-sm, 0.875rem)",
                    }}
                  >
                    {description}
                  </p>
                )}
              </div>

              {showCloseIcon && (
                <button
                  type="button"
                  onClick={onClose}
                  disabled={isCloseDisabled}
                  aria-label="Close modal"
                  className="text-ink-tertiary hover:text-ink hover:bg-surface-2 p-1.5 rounded-md transition-colors cursor-pointer focus:outline-none focus:ring-2 focus:ring-primary-focus/50 inline-flex items-center justify-center shrink-0 -mr-1.5 -mt-1.5 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <svg
                    className="w-4 h-4"
                    viewBox="0 0 16 16"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                    aria-hidden="true"
                  >
                    <path
                      d="M4 4L12 12M12 4L4 12"
                      stroke="currentColor"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                    />
                  </svg>
                </button>
              )}
            </div>
          )}

          {/* Body / Content */}
          <div
            className="font-sans text-body text-ink-muted leading-relaxed"
            style={{
              color: "var(--color-ink-muted, #d0d6e0)",
              fontSize: "var(--text-body, 1rem)",
            }}
          >
            {content}
          </div>

          {/* Footer with Confirm & Close buttons */}
          <div className="flex items-center justify-end gap-3 pt-3 border-t border-hairline mt-1">
            <button
              type="button"
              onClick={onClose}
              disabled={isCloseDisabled || isLoading}
              className="font-sans text-button font-medium text-ink bg-surface-1 hover:bg-surface-2 border border-hairline hover:border-hairline-strong rounded-md px-[14px] py-xs min-h-[40px] inline-flex items-center justify-center cursor-pointer transition-colors duration-150 ease-out focus:outline-none focus:ring-2 focus:ring-primary-focus/50 disabled:opacity-50 disabled:cursor-not-allowed disabled:text-ink-tertiary"
            >
              {closeText}
            </button>

            <button
              type="button"
              onClick={onConfirm}
              disabled={isConfirmDisabled || isLoading}
              className="font-sans text-button font-medium text-on-primary bg-primary hover:bg-primary-hover active:bg-primary-focus rounded-md px-[14px] py-xs min-h-[40px] inline-flex items-center justify-center cursor-pointer transition-colors duration-150 ease-out focus:outline-none focus:ring-2 focus:ring-primary-focus/50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading && <Spinner size="sm" color="current" className="mr-2" />}
              {confirmText}
            </button>
          </div>
        </div>
      </div>
    );

    return createPortal(modalContent, document.body);
  }
);

Modal.displayName = "Modal";

export default Modal;
