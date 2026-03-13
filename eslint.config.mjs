import { dirname } from "path";
import { fileURLToPath } from "url";
import { FlatCompat } from "@eslint/eslintrc";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({
  baseDirectory: __dirname,
});

const eslintConfig = [
  ...compat.extends("next/core-web-vitals", "next/typescript"),
  {
    ignores: [
      "node_modules/**",
      ".next/**",
      "out/**",
      "build/**",
      "next-env.d.ts",
    ],
  },
  {
    rules: {
      // Desabilita exigência de tipar explicitamente (no lugar de 'any')
      "@typescript-eslint/no-explicit-any": "off",
      // Desabilita erro de variáveis não utilizadas
      "@typescript-eslint/no-unused-vars": "off",
      // Desabilita erro de aspas não escapadas no JSX
      "react/no-unescaped-entities": "off",
      // Desabilita aviso de dependências faltando no useEffect
      "react-hooks/exhaustive-deps": "off",
      // Desabilita aviso de <img> no lugar de <Image> do Next
      "@next/next/no-img-element": "off",
      // Desabilita aviso de <a> no lugar de <Link> do Next
      "@next/next/no-html-link-for-pages": "off",
      // Desabilita aviso de @ts-ignore
      "@typescript-eslint/ban-ts-comment": "off",
      // Desabilita aviso de comentário em JSX
      "react/jsx-no-comment-textnodes": "off",
    },
  },
];

export default eslintConfig;