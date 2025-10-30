@echo off
:: 部署到 GitHub Pages 的批处理脚本
:: 使用方法: 双击 deploy.bat 或在命令行中运行 deploy.bat

echo 开始部署到 GitHub Pages...

:: 检查是否安装了必要的工具
where git >nul 2>&1
if %errorlevel% neq 0 (
    echo 错误: 未找到 git 命令，请确保已安装 Git
    pause
    exit /b 1
)

where npm >nul 2>&1
if %errorlevel% neq 0 (
    echo 错误: 未找到 npm 命令，请确保已安装 Node.js
    pause
    exit /b 1
)

:: 设置变量
set DIST_DIR=dist
for /f "tokens=*" %%i in ('git remote get-url origin') do set REPO_URL=%%i
set BRANCH=main

:: 检查当前分支
for /f "tokens=*" %%i in ('git branch --show-current') do set CURRENT_BRANCH=%%i
if not "%CURRENT_BRANCH%"=="%BRANCH%" (
    echo 警告: 当前不在 %BRANCH% 分支上，是否继续部署? (y/N)
    set /p response=
    if /i not "%response%"=="y" if /i not "%response%"=="yes" (
        echo 部署已取消
        pause
        exit /b 0
    )
)

:: 拉取最新代码
echo 正在拉取最新代码...
git pull origin %BRANCH%
if %errorlevel% neq 0 (
    echo 错误: 无法从远程仓库拉取代码
    pause
    exit /b 1
)

:: 安装依赖
echo 正在安装依赖...
npm ci
if %errorlevel% neq 0 (
    echo 错误: 依赖安装失败
    pause
    exit /b 1
)

:: 构建项目
echo 正在构建项目...
npm run build
if %errorlevel% neq 0 (
    echo 错误: 项目构建失败
    pause
    exit /b 1
)

:: 检查构建是否成功
if not exist "%DIST_DIR%" (
    echo 错误: 构建失败或 dist 目录不存在
    pause
    exit /b 1
)

if not exist "%DIST_DIR%\*" (
    echo 错误: 构建失败或 dist 目录为空
    pause
    exit /b 1
)

echo 构建成功完成

:: 添加所有更改到 git
echo 正在提交代码更改...
git add .

:: 检查是否有更改需要提交
git diff-index --quiet HEAD --
if %errorlevel% neq 0 (
    echo 检测到代码更改，正在提交...
    for /f "tokens=2 delims==." %%a in ('wmic OS Get localdatetime /value') do set "dt=%%a"
    set "YY=%dt:~0,4%" & set "MM=%dt:~4,2%" & set "DD=%dt:~6,2%"
    set "HH=%dt:~8,2%" & set "Min=%dt:~10,2%" & set "Sec=%dt:~12,2%"
    set "datestamp=%YY%-%MM%-%DD% %HH%:%Min%:%Sec%"
    git commit -m "更新: 自动部署到 GitHub Pages (%datestamp%)"
    echo 正在推送到 GitHub...
    git push origin %BRANCH%
    if %errorlevel% neq 0 (
        echo 错误: 无法推送到远程仓库
        pause
        exit /b 1
    )
) else (
    echo 没有检测到代码更改
)

echo.
echo 部署完成！GitHub Actions 将自动部署到 GitHub Pages
echo 请访问 https://chenxi369.github.io/website-owner-website/ 查看部署结果
echo.

pause