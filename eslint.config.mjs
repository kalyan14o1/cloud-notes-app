import globals from 'globals';
import js from '@eslint/js';

export default [
  js.configs.recommended,
  {
    languageOptions: {
      ecmaVersion: 'latest',
      sourceType: 'commonjs',
      globals: {
        ...globals.node  // Node.js globals like 'process'
      }
    },
    rules: {
      'no-undef': 'error'
    }
  }
];
