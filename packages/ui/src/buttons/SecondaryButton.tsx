import * as React from "react";

export interface SecondaryButtonProps
  extends Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, "content"> {
  content: React.ReactNode;
}

export const SecondaryButton = React.forwardRef<
  HTMLButtonElement,
  SecondaryButtonProps
>(({ content, type = "button", className = "", ...restProps }, ref) => {
  return (
    <button
      ref={ref}
      type={type}
      className={`font-sans text-button font-medium text-ink bg-surface-1
      hover:bg-surface-2 border border-hairline hover:border-hairline-strong
      rounded-md px-[14px] py-xs min-h-[40px]
      inline-flex items-center justify-center
      cursor-pointer transition-colors duration-150 ease-out
      focus:outline-none focus:ring-2 focus:ring-primary-focus/50
      disabled:opacity-50 disabled:cursor-not-allowed disabled:text-ink-tertiary ${className}`}
      {...restProps}
    >
      {content}
    </button>
  );
});

SecondaryButton.displayName = "SecondaryButton";

export default SecondaryButton;
