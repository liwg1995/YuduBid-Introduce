# 禹都AI解决方案助手介绍页

这是「禹都AI解决方案助手」的产品介绍与下载页面，面向项目管理、技术标书、公文写作、论文导师、软件著作和国家专利等本地 AI 工作台场景。

页面基于 Vite、React 和 TypeScript 构建，包含动态产品首屏、功能介绍、界面展示和下载区。下载区会在浏览器端请求 GitHub 最新 Release，并自动匹配 Windows 与 macOS 安装包。

## 在线仓库

```text
git@github.com:liwg1995/YuduBid-Introduce.git
```

## 本地运行

安装依赖：

```bash
npm install
```

启动开发服务：

```bash
npm run dev
```

默认访问：

```text
http://127.0.0.1:5173/
```

## 构建

```bash
npm run build
```

构建产物输出到：

```text
dist/
```

本地预览构建产物：

```bash
npm run preview
```

## 下载链接逻辑

页面运行时会请求：

```text
https://api.github.com/repos/liwg1995/YuduBid/releases/latest
```

然后从 Release assets 中匹配：

- Windows: 文件名以 `.exe` 结尾并包含 `win`
- macOS Apple 芯片: 文件名以 `.dmg` 结尾并包含 `arm64`
- macOS Intel: 文件名以 `.dmg` 结尾并包含 `x64`

如果请求 GitHub API 失败，页面会回退到内置的 fallback release 下载信息。

## 部署

这是静态站点，推荐部署到 EdgeOne Pages、Vercel、Netlify 或任意静态资源服务。

EdgeOne Pages 推荐配置：

```text
安装命令：npm install
构建命令：npm run build
输出目录：dist
分支：main
```

也可以直接上传 `dist/` 目录中的静态产物。

## 项目结构

```text
src/main.tsx      页面逻辑、交互、场景数据和下载数据获取
src/styles.css    全局样式和响应式布局
public/assets/    源静态资源与产品截图
dist/             构建后的可部署静态产物
```

## 视觉效果

背景使用 Canvas 绘制粒子场和动态球体效果。球体、粒子密度、星尘发散和色彩会随滚动进度变化，同时支持 `prefers-reduced-motion` 降低动态效果。
