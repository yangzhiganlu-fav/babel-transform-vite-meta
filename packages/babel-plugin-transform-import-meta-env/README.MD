# babel-plugin-transform-import-meta-env

## 作用

解决运行 `jest` 单元测试时，无法获取 `vite` 挂载的 `import.meta.env` 问题，因为 `vite` 并没有运行

## 使用

```js
module.exports = {
    "plugins": [
        // useage1
        "babel-plugin-transform-import-meta-env",
        // useage2
        [
            "babel-plugin-transform-import-meta-env",
            {
                mockData: {
                    VIE_XXX: ''
                }
            }
        ],
        // useage3
        [
            "babel-plugin-transform-import-meta-env",
            {
                envFile: 'absolute path to .env file'
            }
        ]
    ]
}
```
