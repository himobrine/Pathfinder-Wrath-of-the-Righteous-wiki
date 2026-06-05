# 贡献指南

感谢您有兴趣为开拓者：正义之怒 Wiki 做出贡献！

## 贡献步骤

1. **Fork 本仓库**，并基于 main 分支创建您的功能分支。
2. **编辑或新增 Markdown 文件**，遵循站点的内容和格式规范。
3. **如果修改 BD 制作工具的职业数据**，编辑 `docs/javascripts/classData.js`。
4. **提交 Pull Request**，在描述中清晰说明更改内容。

## 内容规范

- 专有名词首次出现时附上英文原名，例如"世界之伤 (Worldwound)"。
- 剧透内容使用 `??? warning "剧透警告"` 折叠块包裹。
- 页面结构保持统一，层级清晰。

## 本地测试

```bash
pip install -r requirements.txt
mkdocs serve
```

确保修改后站点能正常构建并且无报错。
