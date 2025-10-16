// eslint.config.mts
import js from "@eslint/js";
import globals from "globals";
import tseslint from "typescript-eslint";
import prettier from "eslint-plugin-prettier";
import { defineConfig } from "eslint/config";

export default defineConfig([
  // ✅ Regras base do JavaScript
  js.configs.recommended,

  // ✅ Regras base do TypeScript
  ...tseslint.configs.recommended,

  // 🎯 Configuração principal para arquivos .ts
  {
    files: ["**/*.ts"],
    languageOptions: {
      globals: globals.node, // ambiente Node padrão
    },
    plugins: { prettier },
    rules: {
      // ⚙️ Integração com Prettier (opcional)
      // "prettier/prettier": "warn",

      // 🚨 Erros reais de runtime
      "no-undef": "error",

      // ✅ Ajuste de variáveis não usadas (ignora variáveis iniciadas com "_")
      "no-unused-vars": "off",
      "@typescript-eslint/no-unused-vars": [
        "error",
        {
          argsIgnorePattern: "^_",
          varsIgnorePattern: "^_",
          caughtErrorsIgnorePattern: "^_",
        },
      ],

      // 💬 Regras mais brandas
      "no-console": "off",
      "@typescript-eslint/no-explicit-any": "warn",
    },
  },

  // 🧪 Override para testes Jest (.spec.ts / .test.ts)
  {
    files: [
      "tests/**/*.spec.ts",
      "tests/**/*.test.ts",
      "src/**/*.spec.ts",
      "src/**/*.test.ts",
      "src/**/tests/**/*.spec.ts",
      "src/**/tests/**/*.test.ts",
    ],
    languageOptions: {
      globals: {
        ...globals.node,
        ...globals.jest, // describe, it, expect, beforeAll, afterAll, etc.
      },
    },
    rules: {
      "no-undef": "off",
    },
  },

  // 🧩 Override adicional: arquivos de setup do Jest (não são *.spec/*.test)
  {
    files: [
      "tests/**/setup.ts",
      "tests/**/setup.*.ts", // cobre variações como setup-e2e.ts (opcional)
    ],
    languageOptions: {
      globals: {
        ...globals.node,
        ...globals.jest, // habilita beforeAll/afterAll/etc. no setup
      },
    },
    rules: {
      "no-undef": "off",
    },
  },

  // 🧹 Ignorar build e arquivos gerados
  {
    ignores: [
      "node_modules",
      "dist",
      "coverage",
      "*.js",
      "*.cjs",
      "*.d.ts",
      "*.map",
    ],
  },
]);
