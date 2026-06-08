# 开拓者：正义之怒 Wiki

《开拓者：正义之怒》(Pathfinder: Wrath of the Righteous) 中文百科 — 职业、种族、专长、法术、Build 规划一站式查询。

## 本地开发

此站点为纯静态 HTML，使用任意 HTTP 服务器即可预览：

```bash
# Python
python -m http.server 8000

# Node.js
npx serve .
```

然后打开 `http://localhost:8000`。

## 项目结构

```
/
├── index.html              # 首页
├── wiki/                   # 百科页面
│   ├── classes.html
│   ├── races.html
│   ├── feats.html
│   ├── spells.html
│   └── mythic-paths.html
├── builder/                # Build 构建器
│   └── index.html
├── builds/                 # Build 展示
│   ├── index.html
│   └── my.html
├── data/                   # JSON 数据文件
│   ├── classes.json
│   ├── races.json
│   ├── feats.json
│   └── mythic-paths.json
├── js/                     # JavaScript 模块
│   ├── constants.js
│   ├── data-loader.js
│   ├── calculator.js
│   ├── builder.js
│   ├── builder-ui.js
│   ├── export.js
│   ├── wiki.js
│   ├── builds.js
│   └── search.js
├── css/
│   └── style.css
└── assets/
```

## 贡献

欢迎通过提交 Issue 或 Pull Request 参与贡献。

数据文件位于 `data/` 目录，遵循 PRD 中定义的 JSON schema 格式。
