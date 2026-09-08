# vue-lesson 目录结构

```
vue-lesson
├── packages
│   ├── reactivity
│   │   └── package.json
│   └── shared
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
<!-- 将本地target2依赖模块添加到target1依赖模块package.json的dependencies中 -->
pnpm --filter @vue3/target1 add @vue3/target2 --workspace
```

### 删除node_modules
```
rm -rf node_modules pnpm-lock.yaml
```