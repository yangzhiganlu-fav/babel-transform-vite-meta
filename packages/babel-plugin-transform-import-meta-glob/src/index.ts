import babelCore, { PluginObj, NodePath } from '@babel/core';
import fastGlob from 'fast-glob';
import { dirname, resolve } from 'path';
import { createHash } from 'crypto';

const getUniqueString = (input: string) => {
    const hash = createHash('sha256').update(input).digest('hex');
    const letters = 'abcdefghijklmnopqrstuvwxyz';
    let result = '';
    for (let i = 0; i < 10; i++) {
        const hexValue = parseInt(hash[i], 16);
        const letterIndex = hexValue % 26;
        result += letters[letterIndex];
    }
    return result;
};

export interface PluginOpts {
    eager?: boolean;
    [key: string]: unknown;
}

const plugin = ({ types: t }: typeof babelCore): PluginObj => {
    const asts = {
        glob: (paths: string[], cwd: string) => {
            return t.expressionStatement(
                t.newExpression(
                    t.identifier('Promise'),
                    [
                        t.arrowFunctionExpression(
                            [t.identifier('resolve')],
                            t.blockStatement([
                                t.expressionStatement(
                                    t.callExpression(
                                        t.identifier('resolve'),
                                        [
                                            t.objectExpression(
                                                paths.map((path) =>
                                                    t.objectProperty(
                                                        t.stringLiteral(path),
                                                        t.arrowFunctionExpression(
                                                            [],
                                                            t.callExpression(
                                                                t.import(),
                                                                [t.stringLiteral(resolve(cwd, path))]
                                                            )
                                                        )
                                                    )
                                                )
                                            )
                                        ]
                                    )
                                )
                            ])
                        )
                    ]
                )
            );
        },
        globEager: (paths: string[], cwd: string) => {
            return paths.map((path) => {
                const moduleName = `mod_${getUniqueString(path)}`;
                return {
                    path,
                    name: moduleName,
                    importAst: t.importDeclaration(
                        [t.importNamespaceSpecifier(t.identifier(moduleName))],
                        t.stringLiteral(resolve(cwd, path))
                    )
                };
            });
        }
    };

    const getGlobPathObjectFromAst = (patternAsts: babelCore.types.CallExpression['arguments'][number], cwd: string) => {
        const result: string[] = [];
        if (t.isStringLiteral(patternAsts)) {
            result.push(...fastGlob.globSync(patternAsts.value, { cwd, dot: true }));
        } else if (t.isArrayExpression(patternAsts)) {
            patternAsts.elements.forEach((pattern) => {
                if (t.isStringLiteral(pattern)) {
                    result.push(...fastGlob.globSync(pattern.value, { cwd, dot: true }));
                } else {
                    throw new Error('Invalid pattern');
                }
            });
        }
        result.forEach((path, index) => {
            if (!path.startsWith('.')) {
                result[index] = `./${path}`;
            }
        });
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
        name: 'babel-plugin-transform-import-meta-glob',
        visitor: {
            CallExpression(path, state) {
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
                    if (node.callee.property.name === 'globEager' || opts?.eager) {
                        const program = path.findParent((p) => p.isProgram()) as NodePath<babelCore.types.Program>;
                        const imports = asts.globEager(pathList, cwd);
                        path.replaceWith(t.objectExpression(
                            imports.map(({ path, name, importAst }) => {
                                const isSameImportExist = program.node.body.some((node) => {
                                    return t.isImportDeclaration(node) && node.source.value === importAst.source.value;
                                });
                                if (!isSameImportExist) {
                                    program.node.body.unshift(importAst);
                                }
                                return t.objectProperty(
                                    t.stringLiteral(path),
                                    t.identifier(name)
                                );
                            })
                        ));
                    } else {
                        path.replaceWith(asts.glob(pathList, cwd));
                    }
                }
            }
        },
    };
};

export default plugin;