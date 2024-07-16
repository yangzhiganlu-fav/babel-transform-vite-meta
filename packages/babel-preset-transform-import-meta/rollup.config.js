import typescript from '@rollup/plugin-typescript';
import resolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import json from '@rollup/plugin-json';
import terser from '@rollup/plugin-terser';
import { babel } from '@rollup/plugin-babel';
import del from 'rollup-plugin-delete';

export default {
    input: 'src/index.ts',
    external: ['babel-plugin-transform-import-meta-env'],
    output: [
        {
            file: 'lib/index.js',
            format: 'cjs',
            sourcemap: true,
            plugins: [terser()],
        },
        {
            file: 'lib/index.esm.js',
            format: 'esm',
            sourcemap: true,
            plugins: [terser()]
        }
    ],
    plugins: [
        del({ targets: 'lib/*' }),
        resolve(),
        commonjs(),
        json(),
        typescript({
            tsconfig: './tsconfig.json',
            declaration: true,
            declarationDir: 'lib',
            rootDir: 'src'
        }),
        babel({
            babelHelpers: 'bundled',
            extensions: ['.ts', '.tsx'],
            presets: [
                '@babel/preset-env',
                '@babel/preset-typescript'
            ],
            plugins: ['@babel/plugin-transform-object-rest-spread']
        })
    ]
};
