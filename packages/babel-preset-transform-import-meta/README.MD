# babel-preset-transform-import-meta

## 作用

解决运行 `jest` 单元测试时，无法获取 `vite` 挂载的 `import.meta.env`、`import.meta.glob`、`import.meta.globEager` 问题，因为 `vite` 并没有运行

## 使用

```js
module.exports = {
    "presets": [
        // 使用方式1, 直接引入
        "babel-preset-transform-import-meta",
        // 使用方式2, 传入配置
        [
            "babel-preset-transform-import-meta",
            {
                env: {
                    // config
                },
                glob: {
                    // config
                }
            }
        ]
        // 使用方式3, 关闭某些功能
        [
            "babel-preset-transform-import-meta",
            {
                env: false,
                glob: false
            }
        ]
    ]
}
```
