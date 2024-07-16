import BabelPluginTransformGlob from '../src/index';
import { resolve } from 'path';
import { transformFileSync } from '@babel/core';

describe('BabelPluginTransformGlob', () => {
    it('should replace import.meta.globEager(pattern) with globEager(pattern)', () => {
        const transformed = transformFileSync(
            resolve(__dirname, 'fixtures/gloalEager.ts'),
            {
                plugins: [BabelPluginTransformGlob]
            }
        )?.code;
        expect(transformed).toMatchSnapshot();
    });
    it('should replace import.meta.glob(pattern) with glob(pattern)', () => {
        const transformed = transformFileSync(
            resolve(__dirname, 'fixtures/glob.ts'),
            {
                plugins: [BabelPluginTransformGlob]
            }
        )?.code;
        expect(transformed).toMatchSnapshot();
    });
    it('should replace import.meta.glob(pattern, {eager:true}) with globEager(pattern)', () => {
        const transformed = transformFileSync(
            resolve(__dirname, 'fixtures/globEagerTrue.ts'),
            {
                plugins: [BabelPluginTransformGlob]
            }
        )?.code;
        expect(transformed).toMatchSnapshot();
    });
    it('should relpace import.meta.glob(pattern) when pattern is array', () => {
        const transformed = transformFileSync(
            resolve(__dirname, 'fixtures/globArrayPattern.ts'),
            {
                plugins: [BabelPluginTransformGlob]
            }
        )?.code;
        expect(transformed).toMatchSnapshot();
    });
    it('should throw error when pattern array containe ther type than string', () => {
        expect(() => {
            transformFileSync(
                resolve(__dirname, 'fixtures/globInvalidArrayPattern.ts'),
                {
                    plugins: [BabelPluginTransformGlob]
                }
            );
        }).toThrowErrorMatchingSnapshot();
    });
});
