import preset from '../src/index';
import babelCore from '@babel/core';
import envPlugin from 'babel-plugin-transform-import-meta-env';
import globPlugin from 'babel-plugin-transform-import-meta-glob';

describe('babel-preset-transform-import-meta', () => {
    it('should call preset function with default options', () => {
        const result = preset(babelCore);
        expect(result).toHaveProperty('plugins');
        expect(result.plugins).toBeInstanceOf(Array);
    });

    it('should return a preset object', () => {
        const opts = { env: true, glob: true };
        const result = preset(babelCore, opts);
        expect(result).toEqual({
            plugins: [
                babelCore.createConfigItem(envPlugin),
                babelCore.createConfigItem(globPlugin),
            ],
        });
    });

    it('should return a preset object with empty option', () => {
        const opts = {};
        const result = preset(babelCore, opts);
        expect(result).toEqual({
            plugins: [
                babelCore.createConfigItem(envPlugin),
                babelCore.createConfigItem(globPlugin),
            ],
        });
    });

    it('should return a preset object with env plugin', () => {
        const opts = { env: true, glob: false };
        const result = preset(babelCore, opts);
        expect(result).toEqual({
            plugins: [
                babelCore.createConfigItem(envPlugin),
            ],
        });
    });

    it('should return a preset object with glob options', () => {
        const opts = { glob: true, env: false };
        const result = preset(babelCore, opts);
        expect(result).toEqual({
            plugins: [
                babelCore.createConfigItem(globPlugin),
            ],
        });
    });

    it('should return a preset object with glob options', () => {
        const opts = { glob: false, env: false };
        const result = preset(babelCore, opts);
        expect(result).toEqual({
            plugins: [],
        });
    });

    it('should return a preset object with env plugin with options', () => {
        const opts = { env: { mockData: { VITE_XXX: '123' } }, glob: false };
        const result = preset(babelCore, opts);
        expect(result).toEqual({
            plugins: [
                babelCore.createConfigItem([envPlugin, opts.env]),
            ],
        });
    });
});