import babelCore, { ConfigItem } from '@babel/core';
import envPlugin from 'babel-plugin-transform-import-meta-env';
import type { PluginOpts as EnvPluginOpts } from 'babel-plugin-transform-import-meta-env';
import globPlugin from 'babel-plugin-transform-import-meta-glob';

export interface PresetOptions {
    env?: boolean | EnvPluginOpts
    glob?: boolean
}

const defaultOpts: PresetOptions = {
    env: true,
    glob: true,
};

const preset = (_: typeof babelCore, opts: PresetOptions = defaultOpts): { plugins: ConfigItem[] } => {
    const plugins: ConfigItem[] = [];

    if (opts.env === true || opts.env === undefined) {
        plugins.push(_.createConfigItem(envPlugin));
    } else if (typeof opts.env === 'object') {
        plugins.push(_.createConfigItem([envPlugin, opts.env]));
    }

    if (opts.glob === true || opts.glob === undefined) {
        plugins.push(_.createConfigItem(globPlugin));
    }

    return {
        plugins,
    };
};

export default preset;