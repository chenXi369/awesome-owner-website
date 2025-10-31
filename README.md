# website-owner

This template should help get you started developing with Vue 3 in Vite.

## Recommended IDE Setup

[VS Code](https://code.visualstudio.com/) + [Vue (Official)](https://marketplace.visualstudio.com/items?itemName=Vue.volar) (and disable Vetur).

## Recommended Browser Setup

- Chromium-based browsers (Chrome, Edge, Brave, etc.):
  - [Vue.js devtools](https://chromewebstore.google.com/detail/vuejs-devtools/nhdogjmejiglipccpnnnanhbledajbpd) 
  - [Turn on Custom Object Formatter in Chrome DevTools](http://bit.ly/object-formatters)
- Firefox:
  - [Vue.js devtools](https://addons.mozilla.org/en-US/firefox/addon/vue-js-devtools/)
  - [Turn on Custom Object Formatter in Firefox DevTools](https://fxdx.dev/firefox-devtools-custom-object-formatters/)

## Type Support for `.vue` Imports in TS

TypeScript cannot handle type information for `.vue` imports by default, so we replace the `tsc` CLI with `vue-tsc` for type checking. In editors, we need [Volar](https://marketplace.visualstudio.com/items?itemName=Vue.volar) to make the TypeScript language service aware of `.vue` types.

## Customize configuration

See [Vite Configuration Reference](https://vite.dev/config/).

## Project Setup

```sh
npm install
```

### Compile and Hot-Reload for Development

```sh
npm run dev
```

### Type-Check, Compile and Minify for Production

```sh
npm run build
```

### Lint with [ESLint](https://eslint.org/)

```sh
npm run lint
```

## GitHub Pages 部署

项目已配置 GitHub Actions 自动部署到 GitHub Pages。

### 设置步骤：

1. **在 GitHub 仓库设置中启用 Pages**
   - 进入仓库的 Settings → Pages
   - Source 选择 "GitHub Actions"

2. **推送代码到 main 分支**
   - 每次推送到 main 分支时，GitHub Actions 会自动构建并部署

3. **访问网站**
   - 部署完成后，网站将可通过 `https://[你的用户名].github.io/website-owner-website/` 访问

### 手动触发部署：

在 GitHub 仓库的 Actions 标签页中，可以手动运行 "Deploy to GitHub Pages" workflow。
