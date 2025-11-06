#!/usr/bin/env node

/**
 * 依赖安装脚本
 * 自动检测可用的包管理器并安装依赖
 */

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

// 检查命令是否存在
function commandExists(command) {
  try {
    if (process.platform === 'win32') {
      execSync(`where ${command}`, { stdio: 'ignore' });
    } else {
      execSync(`which ${command}`, { stdio: 'ignore' });
    }
    return true;
  } catch (error) {
    return false;
  }
}

// 安装依赖
function installDependencies() {
  console.log('🔍 检测包管理器...');
  
  let packageManager = 'npm';
  let installCommand = 'npm install';
  
  if (commandExists('pnpm')) {
    packageManager = 'pnpm';
    installCommand = 'pnpm install';
    console.log('✅ 检测到 pnpm，使用 pnpm 安装依赖');
  } else if (commandExists('yarn')) {
    packageManager = 'yarn';
    installCommand = 'yarn install';
    console.log('✅ 检测到 yarn，使用 yarn 安装依赖');
  } else {
    console.log('✅ 使用默认的 npm 安装依赖');
  }
  
  console.log(`📦 使用 ${packageManager} 安装依赖...`);
  
  try {
    execSync(installCommand, { stdio: 'inherit', shell: true });
    console.log('🎉 依赖安装完成！');
  } catch (error) {
    console.error('❌ 依赖安装失败:', error.message);
    process.exit(1);
  }
}

// 主函数
if (require.main === module) {
  installDependencies();
}

module.exports = { installDependencies };