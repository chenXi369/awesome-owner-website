#!/bin/bash

# 部署到 GitHub Pages 的脚本
# 使用方法: ./deploy.sh 或 bash deploy.sh

# 设置变量
DIST_DIR="dist"
REPO_URL=$(git remote get-url origin)
BRANCH="main"

echo "开始部署到 GitHub Pages..."

# 检查是否安装了必要的工具
if ! command -v git &> /dev/null; then
    echo "错误: 未找到 git 命令，请确保已安装 Git"
    exit 1
fi

if ! command -v npm &> /dev/null; then
    echo "错误: 未找到 npm 命令，请确保已安装 Node.js"
    exit 1
fi

# 检查当前分支
CURRENT_BRANCH=$(git branch --show-current)
if [ "$CURRENT_BRANCH" != "$BRANCH" ]; then
    echo "警告: 当前不在 $BRANCH 分支上，是否继续部署? (y/N)"
    read -r response
    if [[ ! "$response" =~ ^([yY][eE][sS]|[yY])$ ]]; then
        echo "部署已取消"
        exit 0
    fi
fi

# 拉取最新代码
echo "正在拉取最新代码..."
git pull origin "$BRANCH"
if [ $? -ne 0 ]; then
    echo "错误: 无法从远程仓库拉取代码"
    exit 1
fi

# 安装依赖
echo "正在安装依赖..."
npm ci
if [ $? -ne 0 ]; then
    echo "错误: 依赖安装失败"
    exit 1
fi

# 构建项目
echo "正在构建项目..."
npm run build
if [ $? -ne 0 ]; then
    echo "错误: 项目构建失败"
    exit 1
fi

# 检查构建是否成功
if [ ! -d "$DIST_DIR" ] || [ -z "$(ls -A "$DIST_DIR")" ]; then
    echo "错误: 构建失败或 dist 目录为空"
    exit 1
fi

echo "构建成功完成"

# 添加所有更改到 git
echo "正在提交代码更改..."
git add .

# 检查是否有更改需要提交
if ! git diff-index --quiet HEAD --; then
    echo "检测到代码更改，正在提交..."
    TIMESTAMP=$(date '+%Y-%m-%d %H:%M:%S')
    git commit -m "更新: 自动部署到 GitHub Pages ($TIMESTAMP)"
    echo "正在推送到 GitHub..."
    git push origin "$BRANCH"
    if [ $? -ne 0 ]; then
        echo "错误: 无法推送到远程仓库"
        exit 1
    fi
else
    echo "没有检测到代码更改"
fi

echo ""
echo "部署完成！GitHub Actions 将自动部署到 GitHub Pages"
echo "请访问 https://chenxi369.github.io/website-owner-website/ 查看部署结果"
echo ""