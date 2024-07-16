import { transformFileSync } from '@babel/core';
import {resolve} from 'path';
import BabelPluginTransformEnv from '../src/index';

describe('babel-plugin-transform-env', () => {
    it('should replace import.meta.env with process.env and use mock data', () => {
        const transformed = transformFileSync(resolve(__dirname, 'fixtures/index.ts'), {
            plugins: [
                [
                    BabelPluginTransformEnv,
                    {
                        mockData: {
                            VITE_API_URL: 'https://api.example.com',
                            VITE_API_KEY: '123',
                        },
                    }
                ],
            ],
        })?.code;
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
        expect(transformed).toMatchSnapshot();
    });

    it('should replace import.meta.env with process.env and use env file', () => {
        const transformed = transformFileSync(resolve(__dirname, 'fixtures/index.ts'), {
            plugins: [
                [
                    BabelPluginTransformEnv, {
                        mockData: {
                            VITE_API_URL: 'https://api.example.com/mockData',
                            VITE_API_KEY: 'mockData123',
                        },
                        envFile: resolve(__dirname, 'fixtures/.env'),
                    }
                ]
            ],
        })?.code;
        expect(transformed).toMatchSnapshot();
    });
    it("should replace import.meta.env with process.env and use multiple env files with override", () => {
        const transformed = transformFileSync(resolve(__dirname, "fixtures/index.ts"), {
            plugins: [
                [
                    BabelPluginTransformEnv,
                    {
                        envFile: {
                            files: [
                                resolve(__dirname, "fixtures/.env"),
                                resolve(__dirname, "fixtures/.env.dev")
                            ],
                            override: true
                        }
                    },
                ],
            ],
        })?.code;
        expect(transformed).toMatchSnapshot();
    });
    it("should replace import.meta.env with process.env and use multiple env files without override", () => {
        const transformed = transformFileSync(resolve(__dirname, "fixtures/index.ts"), {
            plugins: [
                [
                    BabelPluginTransformEnv,
                    {
                        envFile: {
                            files: [
                                resolve(__dirname, "fixtures/.env"),
                                resolve(__dirname, "fixtures/.env.dev")
                            ],
                        }
                    },
                ],
            ],
        })?.code;
        expect(transformed).toMatchSnapshot();
    });
});