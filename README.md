# babel-transform-vite-meta

## 简介

此项目旨在为 `Jest` 测试环境提供 `vite` 的 `import.meta` 支持

> 目前支持
>
> - `import.meta.env`
> - `import.meta.glob` 和 `import.meta.globEager` 的基础使用和 `{ eager: true }` 选项

> 后续计划
>
> - `import.meta.hot` 的支持
> - `import.meta.glob` 和 `import.meta.globEager` 的其他参数

## 安装

```bash
pnpm add babel-preset-transform-import-meta -D
```

## 使用

### 基础使用

```json
{
  "presets": ["babel-preset-transform-import-meta"]
}
```

### 配置选项

配置选项详情见对应 `plugin` 文档

[babel-plugin-transform-import-meta-env](https://github.com/yangzhiganlu-fav/babel-transform-vite-meta/tree/master/packages/babel-plugin-transform-import-meta-env#readme)

[babel-plugin-transform-import-meta-glob](https://github.com/yangzhiganlu-fav/babel-transform-vite-meta/tree/master/packages/babel-plugin-transform-import-meta-glob#readme)

```json
{
  "presets": [
    [
      "babel-preset-transform-import-meta",
      {
        "env": {
          // env plugin options
        },
        "glob": {
          // glob plugin options
        }
      }
    ]
  ]
}
```

### 自定义关闭开启

```json
{
  "presets": [
    [
      "babel-preset-transform-import-meta",
      {
        "env": false,
        "glob": true
      }
    ]
  ]
}
```
