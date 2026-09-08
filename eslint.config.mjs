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
    // Generated design-sync bundle (gitignored build output, not source).
    "ds-bundle/**",
    // Netlify build output and the design-sync workspace, both gitignored.
    ".netlify/**",
    ".ds-sync/**",
  ]),
]);

export default eslintConfig;
