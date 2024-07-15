import { transformFileSync } from '@babel/core';
import {resolve} from 'path';
import BabelPluginTransformEnv from '../src/index';

describe('babel-plugin-transform-env', () => {
    let originalEnv: NodeJS.ProcessEnv;

    beforeEach(() => {
        originalEnv = { ...process.env };
    });

    afterEach(() => {
        process.env = originalEnv;
    });

    it('should replace import.meta.env with process.env and use mock data', () => {
        const transformed = transformFileSync(resolve(__dirname, 'fixtures/index.ts'), {
            plugins: [
                [
                    BabelPluginTransformEnv,
                    {
                        mockData: {
                            API_URL: 'https://api.example.com',
                            API_KEY: '123',
                        },
                    }
                ],
            ],
        })?.code;
        expect(process.env.API_URL).toContain('https://api.example.com');
        expect(process.env.API_KEY).toContain('123');
        expect(transformed).toMatchSnapshot();
    });

    it('should replace import.meta.env with process.env and use env file', () => {
        const transformed = transformFileSync(resolve(__dirname, 'fixtures/index.ts'), {
            plugins: [
                [
                    BabelPluginTransformEnv, {
                        envFile: resolve(__dirname, 'fixtures/.env'),
                    }
                ]
            ],
        })?.code;
        expect(process.env.API_URL).toContain('https://api.example.com');
        expect(process.env.API_KEY).toContain('123');
        expect(transformed).toMatchSnapshot();
    });

    it('should throw error if env file not found', () => {
        expect(() => {
            transformFileSync(resolve(__dirname, 'fixtures/index.ts'), {
                plugins: [
                    [
                        BabelPluginTransformEnv,
                        {
                            envFile: resolve(__dirname, 'fixtures/.env.notfound'),
                        }
                    ]
                ],
            });
        }).toThrow('ENOENT: no such file or directory');
    });

    it('should undefined if no mock data and env file', () => {
        const transformed = transformFileSync(resolve(__dirname, 'fixtures/index.ts'), {
            plugins: [
                BabelPluginTransformEnv,
            ],
        })?.code;
        expect(process.env.API_URL).toBeUndefined();
        expect(process.env.API_KEY).toBeUndefined();
        expect(transformed).toMatchSnapshot();
    });

    it('should replace import.meta.env with process.env and use env file', () => {
        const transformed = transformFileSync(resolve(__dirname, 'fixtures/index.ts'), {
            plugins: [
                [
                    BabelPluginTransformEnv, {
                        mockData: {
                            API_URL: 'https://api.example.com/mockData',
                            API_KEY: 'mockData123',
                        },
                        envFile: resolve(__dirname, 'fixtures/.env'),
                    }
                ]
            ],
        })?.code;
        expect(process.env.API_URL).toContain('https://api.example.com');
        expect(process.env.API_KEY).toContain('123');
        expect(transformed).toMatchSnapshot();
    });
});