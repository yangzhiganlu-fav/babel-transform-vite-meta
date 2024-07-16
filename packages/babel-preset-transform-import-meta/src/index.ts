import babelCore, { ConfigItem } from '@babel/core';
import envPlugin from 'babel-plugin-transform-import-meta-env'
import type { PluginOpts as EnvPluginOpts } from 'babel-plugin-transform-import-meta-env'

export interface PresetOptions {
    env?: boolean | EnvPluginOpts
}

const preset = (_: typeof babelCore, opts: PresetOptions): { plugins: ConfigItem[] } => {
    const plugins: ConfigItem[] = [];

    if (opts.env === true || opts.env === undefined) {
        plugins.push(_.createConfigItem(envPlugin));
    } else if (typeof opts.env === 'object') {
        plugins.push(_.createConfigItem([envPlugin, opts.env]));
    }

    return {
        plugins,
    };
}

export default preset;