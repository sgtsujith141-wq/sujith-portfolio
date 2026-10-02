import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";

const eslintConfig = [
  ...nextVitals,
  ...nextTs,
  {
    rules: {
      /* Internal links are plain <a> on purpose: they work without JS, and
       * components/runtime.tsx intercepts them to run the route wipe and
       * the eased scroller, prefetching both routes itself. */
      "@next/next/no-html-link-for-pages": "off",
    },
  },
  {
    ignores: [".next/**", "node_modules/**", "next-env.d.ts", "out/**"],
  },
];

export default eslintConfig;
