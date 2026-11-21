import { readdirSync } from "node:fs";
import { join } from "node:path";
import globals from "globals";
import base, { parentImportPattern } from "@repo/eslint-config/base";

// one entry per folder in src/modules, so new modules are picked up automatically
const modules = readdirSync(join(import.meta.dirname, "src/modules"), {
  withFileTypes: true,
})
  .filter((entry) => entry.isDirectory())
  .map((entry) => entry.name);

export default [
  ...base,

  {
    files: ["src/**/*.ts"],
    languageOptions: {
      globals: globals.node,
      parserOptions: {
        projectService: true,
        tsconfigRootDir: import.meta.dirname,
      },
    },
    rules: {
      // un-awaited promises in handlers/services fail silently
      "@typescript-eslint/no-floating-promises": "error",
    },
  },

  // Module autonomy: a module may not import from any other module.
  // Re-states parentImportPattern because this rule replaces the base one.
  ...modules.map((name) => ({
    files: [`src/modules/${name}/**/*.ts`],
    rules: {
      "no-restricted-imports": [
        "error",
        {
          patterns: [
            parentImportPattern,
            {
              regex: `^@/modules/(?!${name}(/|$))`,
              message: "Modules must be self-contained: don't import from other modules.",
            },
          ],
        },
      ],
    },
  })),
];