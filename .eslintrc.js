module.exports = {
    root: true,
    env: { browser: true, node: true, es6: true, jest: true, webextensions: true },
    extends: [
        'eslint:recommended',
        'plugin:@typescript-eslint/recommended',
        'plugin:prettier/recommended',
        'plugin:react/recommended',
        'plugin:import/errors',
        'plugin:import/warnings',
        'prettier',
    ],
    plugins: ['@typescript-eslint', 'react', 'react-hooks'],
    parser: '@typescript-eslint/parser',
    parserOptions: {
        sourceType: 'module',
        project: './tsconfig.json',
    },
    settings: {
        'import/resolver': {
            node: {
                extensions: ['.js', '.jsx', '.ts', '.tsx'],
            },
        },
        react: {
            pragma: 'h',
            version: 'detect',
        },
    },
    rules: {
        '@typescript-eslint/no-use-before-define': ['error', { functions: false, classes: true, variables: true }],
        '@typescript-eslint/explicit-function-return-type': [
            'error',
            {
                allowExpressions: true,
                allowTypedFunctionExpressions: true,
                allowHigherOrderFunctions: true,
            },
        ],
        'react-hooks/rules-of-hooks': 'error',
        'react-hooks/exhaustive-deps': [
            'warn',
            {
                additionalHooks: 'useRecoilCallback',
            },
        ],
        'import/order': [
            'error',
            {
                groups: ['builtin', 'external', 'internal', 'parent', 'sibling', 'index'],
                'newlines-between': 'always',
            },
        ],
    },
    ignorePatterns: ['**/lib'],
};
