# babel-preset-transform-import-meta

## 作用

解决运行 `jest` 单元测试时，无法获取 `vite` 挂载的 `import.meta.env` 问题，因为 `vite` 并没有运行

## 使用

```js
module.exports = {
    "presets": [
        // useage1
        "babel-preset-transform-import-meta",
        // useage2, use plugin config
        [
            "babel-preset-transform-import-meta",
            {
                env: {
                    // config
                }
            }
        ]
        // useage3, close plugin
        [
            "babel-preset-transform-import-meta",
            {
                env: false
            }
        ]
    ]
}
```
