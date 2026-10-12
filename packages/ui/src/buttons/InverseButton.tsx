import * as React from "react";

export interface InverseButtonProps
  extends Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, "content"> {
  content: React.ReactNode;
}

export const InverseButton = React.forwardRef<
  HTMLButtonElement,
  InverseButtonProps
>(({ content }, ref) => {
  return (
    <button
      ref={ref}
      type="button"
      className="font-sans text-button font-medium text-inverse-ink bg-inverse-canvas
      hover:bg-inverse-surface-1 active:bg-inverse-surface-2
      rounded-md px-[14px] py-xs min-h-[40px]
      inline-flex items-center justify-center
      cursor-pointer transition-colors duration-150 ease-out
      focus:outline-none focus:ring-2 focus:ring-primary-focus/50
      disabled:opacity-50 disabled:cursor-not-allowed"
    >
      {content}
    </button>
  );
});

InverseButton.displayName = "InverseButton";

export default InverseButton;
