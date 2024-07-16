import babelCore, { PluginObj } from '@babel/core';
import { config } from 'dotenv';

export interface PluginOpts {
    mockData?: Record<string, string>;
    envFile?: string | string[];
}

const defaultPluginOpts: PluginOpts = {
    mockData: {}
}

const plugin = ({ types: t }: typeof babelCore, opts: PluginOpts = defaultPluginOpts): PluginObj => {
    let mockData: Record<string, string>;
    if (opts.envFile) {
        const loadData = config({ path: opts.envFile, override: true });
        if (loadData.error) {
            throw loadData.error;
        } else {
            mockData = loadData.parsed!;
        }
    } else {
        mockData = opts.mockData || {};
    }
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
                    const parent = path.parentPath;
                    if (t.isMemberExpression(parent.node)) {
                        const { property } = parent.node;
                        if (t.isIdentifier(property)) {
                            parent.replaceWith(t.stringLiteral(mockData[property.name] || ''));
                        }
                    } else {
                        path.replaceWith(t.objectExpression(
                            Object.entries(mockData).map(([key, value]) => {
                                return t.objectProperty(t.stringLiteral(key), t.stringLiteral(value));
                            })
                        ));
                    }
                }
            }
        }
    }
}

export default plugin;