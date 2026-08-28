# vue-lesson 目录结构

```
vue-lesson
├── packages
│   ├── reactivity
│   │   ├── src
│   │   │   └── index.ts
│   │   └── package.json
│   └── shared
│       ├── src
│       │   └── index.ts
│       └── package.json
├── scripts
│   └── dev.js
├── package.json
├── pnpm-lock.yaml
├── pnpm-workspace.yaml
├── tsconfig.json
└── README.md
```
### 安装依赖
```
<!-- 安装打包依赖，方便学习源码时调试 -->
pnpm install esbuild
<!-- 安装Node.js 命令行参数解析库 -->
pnpm install minimist
<!-- 安装ts编译依赖 -->
pnpm install typescript
```