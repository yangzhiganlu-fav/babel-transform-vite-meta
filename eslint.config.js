import globals from 'globals';
import pluginJs from '@eslint/js';
import tseslint from 'typescript-eslint';


export default [
    { files: ['**/*.{js,mjs,cjs,ts}'] },
    {
        languageOptions: {
            globals: {
                ...globals.browser,
                ...globals.node,
            }
        }
    },
    {
        plugins: {
            '@stylistic': pluginJs
        }
    },
    {
        ignores: [
            '**/node_modules/**',
            '**/lib/**',
            '**/coverage/**',
            '**/__snapshots__/**',
            '**/fixtures/**',
            '**/package-lock.json',
            '**/pnpm-lock.yaml',
            '**/pnpm-workspace.yaml',
            '.gitignore',
            '.git'
        ]
    },
    {
        rules: {
            '@typescript-eslint/no-explicit-any': 'off',
            'indent': ['warn', 4, { 'SwitchCase': 2 }],
            'linebreak-style': ['warn', 'unix'],
            'semi': ['warn', 'always'],
            'quotes': ['warn', 'single'],
        }
    },
    pluginJs.configs.recommended,
    ...tseslint.configs.recommended,
];