#!/bin/bash

# WhatsApp消息处理技能安装脚本
echo "🔧 安装WhatsApp消息处理技能..."

# 检查Node.js环境
echo "📋 检查Node.js环境..."
if ! [ -x "$(command -v node)" ]; then
  echo "❌ 错误: node 未安装" >&2
  exit 1
else
  echo "✅ Node.js 已安装: $(node --version)"
fi

# 检查npm
if ! [ -x "$(command -v npm)" ]; then
  echo "❌ 错误: npm 未安装" >&2
  exit 1
else
  echo "✅ npm 已安装: $(npm --version)"
fi

# 创建必要的目录
echo "📁 创建目录结构..."
mkdir -p /Users/wangfeng/.openclaw/skills/whatsapp-message-handler/handlers

# 检查并创建package.json（如果不存在）
if [ ! -f "package.json" ]; then
    echo "📦 创建package.json..."
    cat > package.json << EOF
{
  "name": "openclaw-whatsapp-message-handler",
  "version": "1.0.0",
  "description": "OpenClaw skill for handling WhatsApp multi-module messages with support for various message types",
  "main": "index.js",
  "scripts": {
    "start": "node index.js",
    "test": "node test.js"
  },
  "keywords": [
    "openclaw",
    "whatsapp",
    "messaging",
    "automation",
    "integration"
  ],
  "author": "OpenClaw User",
  "license": "MIT",
  "dependencies": {
    "express": "^4.18.0",
    "axios": "^1.0.0"
  },
  "repository": {
    "type": "git",
    "url": "https://github.com/adcwangfeng/whatsapp-message-handler.git"
  },
  "bugs": {
    "url": "https://github.com/adcwangfeng/whatsapp-message-handler/issues"
  },
  "homepage": "https://github.com/adcwangfeng/whatsapp-message-handler#readme"
}
EOF
fi

# 安装依赖
echo "📦 安装依赖..."
npm install

# 验证安装
echo "🔍 验证系统功能..."
node test.js
if [ $? -eq 0 ]; then
    echo "✅ WhatsApp消息处理技能验证通过"
else
    echo "❌ 系统验证失败，请检查配置"
    exit 1
fi

# 设置权限
echo "🔒 设置文件权限..."
chmod +x install.sh

echo ""
echo "🎉 WhatsApp消息处理技能安装完成！"
echo ""
echo "📚 系统功能："
echo "   - 多类型消息处理（文本、图片、文档等）"
echo "   - 智能消息路由"
echo "   - 自动回复生成"
echo "   - 命令处理系统"
echo "   - 消息历史记录"
echo "   - 安全内容过滤"
echo ""
echo "💡 使用方法："
echo "   1. 系统将自动集成到OpenClaw"
echo "   2. 可通过API调用处理WhatsApp消息"
echo "   3. 支持多种消息类型和命令"
echo "   4. 包含内容安全检查机制"
echo ""
echo "🚀 技能已准备就绪，可以开始处理WhatsApp消息！"