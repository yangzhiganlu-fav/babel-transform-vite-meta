# babel-plugin-transform-import-meta-env

## 作用

解决运行 `jest` 单元测试时，无法获取 `vite` 挂载的 `import.meta.env` 问题，因为 `vite` 并没有运行

## 使用

```js
module.exports = {
    "plugins": [
        // usage1
        "babel-plugin-transform-import-meta-env",
        // usage2
        [
            "babel-plugin-transform-import-meta-env",
            {
                mockData: {
                    VIE_XXX: ''
                }
            }
        ],
        // usage3
        [
            "babel-plugin-transform-import-meta-env",
            {
                envFile: 'absolute path to .env file'
            }
        ],
        // usage4
        [
            "babel-plugin-transform-import-meta-env",
            {
                envFile: {
                    files: [
                        'absolute path to .env file1',
                        'absolute path to .env file2',
                    ]
                }
            }
        ],
        // usage5 override 设置为 true，后续的 .env 文件会覆盖前面的 .env 文件的同名变量
        [
            "babel-plugin-transform-import-meta-env",
            {
                envFile: {
                    files: [
                        'absolute path to .env file1',
                        'absolute path to .env file2',
                    ],
                    override: true
                }
            }
        ]
    ]
}
```
