import babelCore, { PluginObj } from '@babel/core';
import { config } from 'dotenv';

export interface PluginOpts {
    mockData?: Record<string, string>;
    envFile?: string;
}

const defaultPluginOpts: PluginOpts = {
    mockData: {}
}

const plugin = ({ types: t }: typeof babelCore, opts: PluginOpts = defaultPluginOpts): PluginObj => {
    let mockData: Record<string, string>;
    if (opts.envFile) {
        const loadData = config({ path: opts.envFile });
        if (loadData.error) {
            throw loadData.error;
        } else {
            mockData = loadData.parsed!;
        }
    } else {
        mockData = opts.mockData || {};
    }
    Object.keys(mockData).forEach(key => {
        if (process.env[key] === undefined) {
            process.env[key] = mockData[key];
        }
    });
    return {
        name: 'babel-plugin-transform-import-meta-env',
        visitor: {
            MemberExpression(path) {
                const { node } = path;
                if (
                    t.isMetaProperty(node.object) &&
                    node.object.meta.name === 'import' &&
                    node.object.property.name === 'meta' &&
                    t.isIdentifier(node.property) &&
                    node.property.name === 'env'
                ) {
                    const parent = path.parent;
                    if (t.isMemberExpression(parent)) {
                        path.replaceWith(
                            t.memberExpression(
                                t.memberExpression(
                                    t.identifier('process'),
                                    t.identifier('env')
                                ),
                                parent.property
                            )
                        );
                    } else {
                        path.replaceWith(t.memberExpression(t.identifier('process'), t.identifier('env')));
                    }
                }
            }
        }
    }
}

export default plugin;