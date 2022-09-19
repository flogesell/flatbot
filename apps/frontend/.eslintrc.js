module.exports = {
  extends: [
    'plugin:unicorn/recommended',
    'airbnb-typescript',
    'airbnb/hooks',
    'plugin:import/recommended',
    'plugin:import/typescript',
    'plugin:@typescript-eslint/recommended',
    'plugin:prettier/recommended'
  ],
  plugins: ['react', '@typescript-eslint'],
  env: {
    browser: true,
    es6: true
  },
  globals: {
    Atomics: 'readonly',
    SharedArrayBuffer: 'readonly'
  },
  parser: '@typescript-eslint/parser',
  parserOptions: {
    ecmaFeatures: {
      jsx: true
    },
    sourceType: 'module',
    project: './tsconfig.json'
  },
  rules: {
    'linebreak-style': 'off',
    "react-hooks/rules-of-hooks": "error",
    'import/order': [
      'error',
      {
        groups: ['builtin', 'internal', 'external', 'parent', 'sibling', 'index'],
        'newlines-between': 'never'
      }
    ],
    'prettier/prettier': [
      'error',
      {
        endOfLine: 'auto'
      }
    ],
    'unicorn/filename-case': [
      'error',
      {
        cases: {
          kebabCase: true,
          pascalCase: true
        }
      }
    ]
  }
};
