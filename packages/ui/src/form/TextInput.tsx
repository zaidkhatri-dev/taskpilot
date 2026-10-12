import * as React from "react";

export interface TextInputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  placeholder?: string;
}

export const TextInput = React.forwardRef<HTMLInputElement, TextInputProps>(
  ({ placeholder, type = "text", className = "", onInvalid, ...restProps }, ref) => {
    const internalRef = React.useRef<HTMLInputElement | null>(null);

    React.useEffect(() => {
      // Ensure the enclosing form disables native browser validation popups/tooltips
      if (internalRef.current?.form) {
        internalRef.current.form.noValidate = true;
      }
    }, []);

    const handleRef = React.useCallback(
      (node: HTMLInputElement | null) => {
        internalRef.current = node;
        if (typeof ref === "function") {
          ref(node);
        } else if (ref) {
          (ref as React.MutableRefObject<HTMLInputElement | null>).current = node;
        }
      },
      [ref]
    );

    return (
      <input
        ref={handleRef}
        type={type}
        placeholder={placeholder}
        onInvalid={(e) => {
          // Prevent default browser tooltip / validation bubble
          e.preventDefault();
          onInvalid?.(e);
        }}
        className={`w-full font-sans text-body text-ink bg-surface-1
        border border-hairline rounded-md px-sm py-xs min-h-[44px]
        placeholder:text-ink-subtle
        transition-colors duration-150 ease-out
        focus:outline-none focus:border-hairline-strong focus:ring-2 focus:ring-primary-focus/50
        disabled:opacity-50 disabled:cursor-not-allowed disabled:text-ink-tertiary ${className}`}
        {...restProps}
      />
    );
  }
);

TextInput.displayName = "TextInput";

export default TextInput;
