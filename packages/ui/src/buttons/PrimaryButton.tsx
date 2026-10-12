import * as React from "react";

export interface ButtonPrimaryProps
  extends Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, "content"> {
  content: React.ReactNode;
}

export const ButtonPrimary = React.forwardRef<
  HTMLButtonElement,
  ButtonPrimaryProps
>(({ content, type = "button", className = "", ...restProps }, ref) => {
  return (
    <button
      ref={ref}
      type={type}
      className={`font-sans text-button font-medium text-on-primary bg-primary
      hover:bg-primary-hover active:bg-primary-focus
      rounded-md px-[14px] py-xs min-h-[40px]
      inline-flex items-center justify-center
      cursor-pointer transition-colors duration-150 ease-out
      focus:outline-none focus:ring-2 focus:ring-primary-focus/50
      disabled:opacity-50 disabled:cursor-not-allowed ${className}`}
      {...restProps}
    >
      {content}
    </button>
  );
});

ButtonPrimary.displayName = "ButtonPrimary";

export default ButtonPrimary;
