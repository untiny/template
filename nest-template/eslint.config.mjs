import antfu from '@antfu/eslint-config';
import globals from 'globals';

export default antfu(
  {
    typescript: true,
    languageOptions: {
      globals: {
        ...globals.node,
        ...globals.jest,
      },
      ecmaVersion: 5,
      sourceType: 'module',
      parserOptions: {
        projectService: true,
        tsconfigRootDir: import.meta.dirname,
      },
    },   
    rules: {
      'node/prefer-global/process': 'off',
      'ts/consistent-type-imports': 'off',
      '@typescript-eslint/no-explicit-any': 'off',
      '@typescript-eslint/no-floating-promises': 'warn',
      '@typescript-eslint/no-unsafe-argument': 'warn',
      'no-console': ['warn', { allow: ['warn', 'error'] }],
    },
    ignores: [
      'prisma/generated/**',
    ]
  },
);
