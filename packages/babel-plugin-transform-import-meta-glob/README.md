# babel-plugin-transform-import-meta-glob

## 作用

解决运行 `jest` 单元测试时，无法获取 `vite` 挂载的 `import.meta.glob`、`import.meta.globEager` 问题，因为 `vite` 并没有运行

> 该插件暂时只支持 `import.meta.glob`、`import.meta.globEager`的基础使用，不支持除 `{eager: true}` 之外的其他配置
等待后续工作清闲下来更新

## 使用

```js
module.exports = {
    "plugins": ["babel-plugin-transform-import-meta-glob"]
}
```
