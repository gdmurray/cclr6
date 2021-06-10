module.exports = {
    parser: '@typescript-eslint/parser',
    plugins: ['@typescript-eslint'],
    extends: [
        'eslint:recommended',
        'plugin:@typescript-eslint/recommended', // TypeScript rules
        'plugin:react/recommended', // React rules
        'plugin:react-hooks/recommended', // React hooks rules
        // 'plugin:jsx-a11y/recommended', // Accessibility rules
        'plugin:prettier/recommended',
    ],
    env: {
        es6: true,
        browser: true,
        jest: true,
        node: true,
    },
    settings: {
        react: {
            version: 'detect',
        },
    },
    // ignorePatterns: ['./functions/**/*'],
    rules: {
        'no-unused-vars': 'off',
        'react/react-in-jsx-scope': 0,
        'react/display-name': 0,
        '@typescript-eslint/ban-ts-comment': 'off',
        '@typescript-eslint/explicit-module-boundary-types': 'off',
        '@typescript-eslint/explicit-function-return-type': 0,
        '@typescript-eslint/explicit-member-accessibility': 0,
        '@typescript-eslint/indent': 0,
        '@typescript-eslint/member-delimiter-style': 0,
        '@typescript-eslint/no-explicit-any': 0,
        '@typescript-eslint/no-var-requires': 0,
        '@typescript-eslint/no-use-before-define': 0,
        '@typescript-eslint/no-unused-vars': [
            'error',
            {
                argsIgnorePattern: '^_',
            },
        ],
        'no-console': [
            2,
            {
                allow: ['warn', 'error', 'log'],
            },
        ],
    },
    overrides: [
        {
            files: ['**/*.ts', '**/*.tsx'],
            rules: {
                '@typescript-eslint/no-unused-vars': [
                    'error',
                    {
                        argsIgnorePattern: '^_',
                    },
                ],
            },
        },
    ],
}
