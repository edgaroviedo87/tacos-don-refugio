import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,
  // Override default ignores of eslint-config-next.
  globalIgnores([
    // Default ignores of eslint-config-next:
    ".next/**",
    "out/**",
    "build/**",
    "next-env.d.ts",
    // Isolated git worktrees (see .gitignore) — each is a full checkout with
    // its own tree; never lint into them from the main checkout.
    ".worktrees/**",
  ]),
  // The domain layer (src/domain) must stay framework-free so it can later be
  // extracted into a shared package (packages/core) for the future mobile app.
  {
    files: ["src/domain/**/*.{ts,tsx}"],
    rules: {
      "no-restricted-imports": [
        "error",
        {
          patterns: [
            {
              group: [
                "next",
                "next/*",
                "react",
                "react-dom",
                "react/*",
                "@/components/*",
                "@/app/*",
              ],
              message:
                "src/domain must stay framework-free (no next/react imports) so it can become packages/core later.",
            },
          ],
        },
      ],
    },
  },
  // One-off Node scripts under scripts/ are plain CommonJS (.cjs) by design —
  // require() is the correct idiom there, not a lint violation.
  {
    files: ["scripts/**/*.cjs"],
    rules: {
      "@typescript-eslint/no-require-imports": "off",
    },
  },
]);

export default eslintConfig;
