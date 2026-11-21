import base from "@repo/eslint-config/base";
import nextVitals from "eslint-config-next/core-web-vitals";
import pluginQuery from "@tanstack/eslint-plugin-query";

// eslint-config-next and typescript-eslint both register the @typescript-eslint
// plugin. Strip it from Next's configs so the base registration wins.
const nextVitalsDeduped = nextVitals.map((config) => {
  if (
    config.plugins &&
    Object.prototype.hasOwnProperty.call(config.plugins, "@typescript-eslint")
  ) {
    const { "@typescript-eslint": _dropped, ...restPlugins } = config.plugins;
    return { ...config, plugins: restPlugins };
  }
  return config;
});

export default [
  ...base,
  ...nextVitalsDeduped,
  ...pluginQuery.configs["flat/recommended"],

  { ignores: ["next-env.d.ts"] },

  {
    rules: {
      // JSX tidiness
      "react/self-closing-comp": "error",
      "react/jsx-no-useless-fragment": "error",
      "react/jsx-curly-brace-presence": [
        "error",
        { props: "never", children: "never" },
      ],

      // TanStack Query keys live in one place
      "no-restricted-syntax": [
        "error",
        {
          selector: "Property[key.name='queryKey'] > ArrayExpression",
          message: "Define query keys in @/hooks/keys.ts instead of inline arrays.",
        },
      ],
    },
  },

  // the one file allowed to build key arrays
  {
    files: ["**/hooks/keys.ts"],
    rules: { "no-restricted-syntax": "off" },
  },
];