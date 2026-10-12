import * as React from "react";

export type SpinnerSize = "xs" | "sm" | "md" | "lg" | "xl";
export type SpinnerColor =
  | "current"
  | "primary"
  | "muted"
  | "inverse"
  | "success"
  | "white";

export interface SpinnerProps extends React.SVGAttributes<SVGSVGElement> {
  /**
   * Size of the spinner.
   * - "xs": 12px (0.75rem)
   * - "sm": 16px (1rem) - default
   * - "md": 20px (1.25rem)
   * - "lg": 24px (1.5rem)
   * - "xl": 32px (2rem)
   * - Or a custom numeric size in pixels
   */
  size?: SpinnerSize | number;

  /**
   * Color variant conforming to Linear design tokens.
   * - "current": inherits textColor (default)
   * - "primary": signature lavender-blue (#5e6ad2)
   * - "muted": secondary ink (#8a8f98)
   * - "inverse": pure black inverse ink (#000000)
   * - "success": semantic green (#27a644)
   * - "white": pure white (#ffffff)
   */
  color?: SpinnerColor;

  /**
   * Accessible label for screen readers. Defaults to "Loading...".
   */
  label?: string;
}

const sizeClasses: Record<SpinnerSize, string> = {
  xs: "w-3 h-3",
  sm: "w-4 h-4",
  md: "w-5 h-5",
  lg: "w-6 h-6",
  xl: "w-8 h-8",
};

const colorConfigs: Record<
  SpinnerColor,
  { className: string; colorStyle?: string }
> = {
  current: { className: "text-current" },
  primary: {
    className: "text-primary",
    colorStyle: "var(--color-primary, #5e6ad2)",
  },
  muted: {
    className: "text-ink-subtle",
    colorStyle: "var(--color-ink-subtle, #8a8f98)",
  },
  inverse: {
    className: "text-inverse-ink",
    colorStyle: "var(--color-inverse-ink, #000000)",
  },
  success: {
    className: "text-success",
    colorStyle: "var(--color-success, #27a644)",
  },
  white: { className: "text-white", colorStyle: "#ffffff" },
};

export const Spinner = React.forwardRef<SVGSVGElement, SpinnerProps>(
  (
    {
      size = "sm",
      color = "current",
      label = "Loading...",
      className = "",
      style,
      ...restProps
    },
    ref
  ) => {
    const isCustomSize = typeof size === "number";
    const sizeClass = isCustomSize ? "" : sizeClasses[size] ?? sizeClasses.sm;
    const { className: colorClass, colorStyle } =
      colorConfigs[color] ?? colorConfigs.current;

    const mergedStyle: React.CSSProperties = {
      ...(isCustomSize ? { width: `${size}px`, height: `${size}px` } : {}),
      ...(colorStyle ? { color: colorStyle } : {}),
      ...style,
    };

    return (
      <svg
        ref={ref}
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className={`animate-spin shrink-0 ${sizeClass} ${colorClass} ${className}`.trim()}
        style={mergedStyle}
        role="status"
        aria-label={label || undefined}
        aria-hidden={!label}
        {...restProps}
      >
        {/* Subtle background track circle */}
        <circle
          cx="12"
          cy="12"
          r="9.5"
          stroke="currentColor"
          strokeWidth="2.5"
          strokeOpacity="0.2"
        />
        {/* Sweeping spinning head arc with rounded cap */}
        <path
          d="M12 2.5C17.2467 2.5 21.5 6.75329 21.5 12"
          stroke="currentColor"
          strokeWidth="2.5"
          strokeLinecap="round"
        />
      </svg>
    );
  }
);

Spinner.displayName = "Spinner";

export default Spinner;
