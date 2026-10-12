/**
 * ui-safelist.ts
 *
 * This file exists solely to guarantee Tailwind v4 generates utility classes
 * for every class name used in @repo/ui components (packages/ui/src).
 *
 * Problem: @tailwindcss/turbopack only auto-scans files within apps/client.
 * Files in packages/ui/src are outside its detection boundary, so any class
 * used exclusively there is never emitted into the CSS bundle.
 *
 * Solution: Declare all @repo/ui class names here as a string literal.
 * Tailwind's scanner picks up this file (it's inside apps/client) and
 * generates the corresponding utilities.
 *
 * MAINTENANCE: When adding new classes to any @repo/ui component, add them
 * here too. Group by component for readability.
 */

// prettier-ignore
const _uiSafelist = [
  // ── PrimaryButton ──────────────────────────────────────────────────────────
  "bg-primary", "hover:bg-primary-hover", "active:bg-primary-focus",
  "text-on-primary",

  // ── SecondaryButton ────────────────────────────────────────────────────────
  "bg-surface-1", "hover:bg-surface-2",
  "border-hairline", "hover:border-hairline-strong",
  "text-ink", "disabled:text-ink-tertiary",

  // ── TertiaryButton ─────────────────────────────────────────────────────────
  "bg-canvas", "hover:bg-surface-1", "active:bg-surface-2",

  // ── InverseButton ──────────────────────────────────────────────────────────
  "bg-inverse-canvas", "hover:bg-inverse-surface-1", "active:bg-inverse-surface-2",
  "text-inverse-ink",

  // ── TextInput ──────────────────────────────────────────────────────────────
  "w-full", "text-body", "text-ink-subtle", "text-ink-tertiary",
  "border-hairline", "focus:border-hairline-strong",
  "placeholder:text-ink-subtle",
  "min-h-[44px]",

  // ── Toast ──────────────────────────────────────────────────────────────────
  "text-success", "text-failure", "text-warning",
  "gap-2.5", "gap-3", "w-4", "h-4", "w-3.5", "h-3.5", "shrink-0",
  "px-4", "py-3", "min-h-[44px]", "p-1.5",
  "shadow-lg", "shadow-xl", "text-body-sm", "leading-snug", "hover:text-ink", "animate-fade-in",

  // ── Shared across all buttons & inputs ─────────────────────────────────────
  "font-sans", "text-button", "font-medium",
  "rounded-md", "px-sm", "py-xs", "px-[14px]", "min-h-[40px]",
  "border", "inline-flex", "items-center", "justify-center",
  "cursor-pointer", "transition-colors", "duration-150", "ease-out",
  "focus:outline-none", "focus:ring-2", "focus:ring-primary-focus/50",
  "disabled:opacity-50", "disabled:cursor-not-allowed",

  // ── Spinner ────────────────────────────────────────────────────────────────
  "animate-spin",
  "w-3", "h-3", "w-5", "h-5", "w-6", "h-6", "w-8", "h-8",
  "text-primary", "text-ink-subtle", "text-inverse-ink", "text-white",

  // ── InlineMessage ──────────────────────────────────────────────────────────
  "items-start", "gap-1.5", "mt-px", "text-caption",
];

export default _uiSafelist;
