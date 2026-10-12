import * as React from "react";

export interface TertiaryButtonProps
  extends Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, "content"> {
  content: React.ReactNode;
}

export const TertiaryButton = React.forwardRef<
  HTMLButtonElement,
  TertiaryButtonProps
>(({ content }, ref) => {
  return (
    <button
      ref={ref}
      type="button"
      className="font-sans text-button font-medium text-ink bg-canvas
      hover:bg-surface-1 active:bg-surface-2
      rounded-md px-[14px] py-xs min-h-[40px]
      inline-flex items-center justify-center
      cursor-pointer transition-colors duration-150 ease-out
      focus:outline-none focus:ring-2 focus:ring-primary-focus/50
      disabled:opacity-50 disabled:cursor-not-allowed disabled:text-ink-tertiary"
    >
      {content}
    </button>
  );
});

TertiaryButton.displayName = "TertiaryButton";

export default TertiaryButton;
