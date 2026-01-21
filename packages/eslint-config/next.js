import js from '@eslint/js'
import eslintConfigPrettier from 'eslint-config-prettier'
import globals from 'globals'
import onlyWarn from 'eslint-plugin-only-warn'
import pluginTailwindcss from 'eslint-plugin-better-tailwindcss'
import turboPlugin from 'eslint-plugin-turbo'
import nextVitals from 'eslint-config-next/core-web-vitals'
import nextTs from 'eslint-config-next/typescript'

/**
 * A unified ESLint configuration for Next.js applications and React libraries.
 * This configuration includes all base rules, React rules, Next.js rules, and Tailwind CSS support.
 *
 * @type {import("eslint").Linter.Config}
 * */
export const nextJsConfig = [
  js.configs.recommended,
  eslintConfigPrettier,
  ...nextTs,
  {
    plugins: {
      turbo: turboPlugin,
    },
    rules: {
      'turbo/no-undeclared-env-vars': 'warn',
    },
  },
  {
    plugins: {
      onlyWarn,
    },
  },
  {
    ignores: ['dist/**'],
  },
  ...nextVitals,
  {
    languageOptions: {
      globals: {
        ...globals.serviceworker,
        ...globals.browser,
      },
    },
    settings: { react: { version: 'detect' } },
    rules: {
      'react/react-in-jsx-scope': 'off',
      'react/prop-types': 'off',
    },
  },
  {
    plugins: {
      tailwindcss: pluginTailwindcss,
    },
    settings: {
      tailwindcss: {
        cssFiles: ['**/*.css', '!**/node_modules/**', '!**/dist/**', '!**/build/**'],
      },
    },
    rules: {
      'tailwindcss/no-custom-classname': 'off',
    },
  },
]
