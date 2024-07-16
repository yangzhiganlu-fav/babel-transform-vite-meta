import babelCore, { NodePath, PluginObj } from '@babel/core';
import { glob } from 'fast-glob';
import { dirname } from 'path';

export interface PluginOpts {
    eager?: boolean;
    [key: string]: boolean | object | string | undefined;
}

const plugin = ({ types: t }: typeof babelCore): PluginObj => {
    const asts = {
        glob: (pathList: string[], options?: PluginOpts) => {
            if (options?.eager) {
                return t.objectExpression(
                    pathList.map((path) =>
                        t.objectProperty(t.stringLiteral(path), t.callExpression(t.identifier('require'), [t.stringLiteral(path)]))
                    )
                );
            } else {
                return t.objectExpression(
                    pathList.map((path) =>
                        t.objectProperty(t.stringLiteral(path), t.arrowFunctionExpression([], t.callExpression(t.identifier('import'), [t.stringLiteral(path)]))
                        )
                    ));
            }
        },
        globEager: (pathList: string[]) => {
            return t.objectExpression(
                pathList.map((path) =>
                    t.objectProperty(t.stringLiteral(path), t.callExpression(t.identifier('require'), [t.stringLiteral(path)]))
                )
            );
        }
    };

    const getGlobPathObjectFromAst = (patternAsts: babelCore.types.CallExpression['arguments'][number], cwd: string) => {
        const result: string[] = [];
        if (t.isStringLiteral(patternAsts)) {
            result.push(...glob.sync(patternAsts.value, { cwd, dot: true }));
        } else if (t.isArrayExpression(patternAsts)) {
            patternAsts.elements.forEach((pattern) => {
                if (t.isStringLiteral(pattern)) {
                    result.push(...glob.sync(pattern.value, { cwd, dot: true }));
                } else {
                    throw new Error('Invalid pattern');
                }
            });
        }
        return result;
    };

    const getOptsFromAst = (optsAsts?: babelCore.types.CallExpression['arguments'][number]) => {
        let opts: PluginOpts | undefined;
        if (optsAsts) {
            opts = (optsAsts as babelCore.types.ObjectExpression).properties.reduce((acc, curr) => {
                if (
                    t.isObjectProperty(curr) &&
                    t.isIdentifier(curr.key) &&
                    t.isBooleanLiteral(curr.value)
                ) {
                    acc[curr.key.name] = curr.value.value;
                }
                return acc;
            }, {} as PluginOpts);
        }
        return opts;
    };

    return {
        visitor: {
            CallExpression(path: NodePath<babelCore.types.CallExpression>, state) {
                const { node } = path;
                if (
                    t.isMemberExpression(node.callee) &&
                    t.isMetaProperty(node.callee.object) &&
                    node.callee.object.meta.name === 'import' &&
                    node.callee.object.property.name === 'meta' &&
                    t.isIdentifier(node.callee.property) &&
                    ['glob', 'globEager'].includes(node.callee.property.name)
                ) {
                    const cwd = dirname(state.file.opts.filename!);
                    const patternAsts = node.arguments[0];
                    const pathList = getGlobPathObjectFromAst(patternAsts, cwd);
                    const optsAsts = node.arguments[1];
                    const opts = getOptsFromAst(optsAsts);
                    if (node.callee.property.name === 'glob') {
                        path.replaceWith(opts ? asts.glob(pathList, opts) : asts.glob(pathList));
                    } else {
                        path.replaceWith(asts.globEager(pathList));
                    }
                }
            }
        },
    };
};

export default plugin;