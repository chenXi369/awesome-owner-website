@echo off
REM 依赖安装脚本 - Windows版本

echo 🔍 检测包管理器...

REM 检查 pnpm 是否存在
where pnpm >nul 2>&1
if %errorlevel% equ 0 (
    echo ✅ 检测到 pnpm，使用 pnpm 安装依赖
    pnpm install
    if %errorlevel% equ 0 (
        echo 🎉 pnpm 依赖安装完成！
        exit /b 0
    ) else (
        echo ❌ pnpm 安装失败，尝试使用 npm
    )
)

REM 检查 npm 是否存在
where npm >nul 2>&1
if %errorlevel% equ 0 (
    echo ✅ 使用 npm 安装依赖
    npm install
    if %errorlevel% equ 0 (
        echo 🎉 npm 依赖安装完成！
        exit /b 0
    ) else (
        echo ❌ 依赖安装失败
        exit /b 1
    )
) else (
    echo ❌ 未找到可用的包管理器 (npm 或 pnpm)
    echo 📝 请确保已安装 Node.js 和 npm
    exit /b 1
)