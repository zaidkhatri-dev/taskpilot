import js from "@eslint/js";
import tseslint from "typescript-eslint";
import promise from "eslint-plugin-promise";
import unicorn from "eslint-plugin-unicorn";

// Exported so app configs can re-use it: a later `no-restricted-imports`
// entry REPLACES this one, so apps must spread this pattern back in.
export const parentImportPattern = {
  group: ["../*", "../../*", "../../../*"],
  message: "Use the @/ import alias instead of relative parent imports.",
};

export default [
  {
    ignores: [
      "**/node_modules/**",
      "**/dist/**",
      "**/.next/**",
      "**/.turbo/**",
      "**/coverage/**",
    ],
  },

  js.configs.recommended,
  ...tseslint.configs.recommended,

  {
    plugins: { promise, unicorn },
    rules: {
      // const instead of let
      "prefer-const": "error",

      // arrow functions instead of function declarations/expressions
      // (Next pages: `const Page = () => ...; export default Page;`)
      "func-style": ["error", "expression"],
      "prefer-arrow-callback": "error",

      // async/await instead of .then() chains
      "promise/prefer-await-to-then": "error",

      // object destructuring (arrays off: too noisy)
      "prefer-destructuring": [
        "error",
        {
          VariableDeclarator: { object: true, array: false },
          AssignmentExpression: { object: false, array: false },
        },
      ],

      // template literals instead of string concatenation
      "prefer-template": "error",

      // ternary for a lone if/else
      "unicorn/prefer-ternary": ["error", "only-single-line"],

      // naming
      camelcase: ["error", { properties: "never" }],
      "unicorn/filename-case": ["error", { case: "kebabCase" }],

      // @/ aliases instead of relative parent imports
      "no-restricted-imports": ["error", { patterns: [parentImportPattern] }],

      // TypeScript hygiene
      "@typescript-eslint/no-unused-vars": [
        "error",
        { argsIgnorePattern: "^_", varsIgnorePattern: "^_" },
      ],

      // use the logger / remove debug output
      "no-console": ["warn", { allow: ["warn", "error"] }],
    },
  },
];