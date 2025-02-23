import js from '@eslint/js'
import tseslint from '@typescript-eslint/eslint-plugin'
import tsParser from '@typescript-eslint/parser'
import globals from 'globals'
import reactHooks from 'eslint-plugin-react-hooks'
import reactRefresh from 'eslint-plugin-react-refresh'
import prettier from 'eslint-plugin-prettier'
import tailwindcss from 'eslint-plugin-tailwindcss'
import jest from 'eslint-plugin-jest'

export default [
  { ignores: ['dist'] },
  {
    files: ['**/*.{ts,tsx}', '**/*.test.ts', '**/*.test.tsx'],
    languageOptions: {
      ecmaVersion: 2020,
      globals: {
        ...globals.browser,
        jest: 'readonly',
        expect: 'readonly',
        describe: 'readonly',
        test: 'readonly',
        beforeEach: 'readonly',
        afterEach: 'readonly',
        it: 'readonly',
      },
      parser: tsParser,
    },
    plugins: {
      '@typescript-eslint': tseslint,
      'react-hooks': reactHooks,
      'react-refresh': reactRefresh,
      prettier,
      tailwindcss,
      jest,
    },
    rules: {
      ...js.configs.recommended.rules,
      ...tseslint.configs['recommended'].rules,
      'jest/no-disabled-tests': 'warn',
      'jest/no-focused-tests': 'error',
      'jest/valid-expect': 'error',
      ...reactHooks.configs.recommended.rules,
      'react-refresh/only-export-components': [
        'warn',
        { allowConstantExport: true },
      ],
      'prettier/prettier': 'warn',
      'tailwindcss/no-custom-classname': 'off',
    },
  },
]
