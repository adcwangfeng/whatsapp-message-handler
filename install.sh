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

# 创建必要的目录
echo "📁 创建目录结构..."
mkdir -p /Users/wangfeng/.openclaw/skills/whatsapp-message-handler/handlers

# 检查并创建package.json（如果不存在）
if [ ! -f "package.json" ]; then
    echo "📦 创建package.json..."
    cat > package.json << EOF
{
  "name": "whatsapp-message-handler",
  "version": "1.0.0",
  "description": "WhatsApp multi-module message processing skill",
  "main": "index.js",
  "scripts": {
    "start": "node index.js",
    "test": "echo \"No tests specified\" && exit 0"
  },
  "keywords": ["whatsapp", "messaging", "automation", "openclaw", "skills"],
  "author": "OpenClaw",
  "license": "MIT",
  "dependencies": {}
}
EOF
fi

# 安装依赖
echo "📦 安装依赖..."
npm install

# 验证安装
echo "🔍 验证系统功能..."
node -e "
try {
  const WhatsAppMessageHandler = require('./index.js');
  const handler = new WhatsAppMessageHandler();
  console.log('✅ WhatsApp消息处理技能验证通过');
  console.log('💡 技能已准备就绪，可以处理WhatsApp消息');
} catch (error) {
  console.error('❌ 验证失败:', error.message);
  process.exit(1);
}
"

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
echo ""
echo "💡 使用方法："
echo "   1. 系统将自动集成到OpenClaw"
echo "   2. 可通过API调用处理WhatsApp消息"
echo "   3. 支持多种消息类型和命令"
echo ""
echo "🚀 技能已准备就绪，可以开始处理WhatsApp消息！"