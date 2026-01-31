# WhatsApp消息处理技能

专门处理WhatsApp多模块消息的接收和响应系统，支持文本、图片、文件等多种消息类型的处理。

## 功能特性

### 消息处理
- **多类型支持**: 文本、图片、文档、音频、视频、位置、联系人等
- **智能解析**: 自动提取提及、标签、链接、命令等元素
- **情感分析**: 简单的情感倾向分析
- **智能路由**: 根据消息类型和内容智能分发

### 响应系统
- **个性化回复**: 基于时间和内容的个性化回复
- **命令处理**: 内置/help、/status、/info、/history、/echo等命令
- **错误处理**: 完善的错误处理和重试机制

### 集成能力
- **模块化设计**: 可扩展的消息处理模块
- **事件驱动**: 基于事件的消息处理架构
- **安全过滤**: 内容安全检查和过滤机制

## 安装

### 使用npx安装
```bash
npx skills add https://github.com/adcwangfeng/whatsapp-message-handler
```

### 手动安装
```bash
git clone https://github.com/adcwangfeng/whatsapp-message-handler.git
cd whatsapp-message-handler
npm install
```

## 配置

此技能需要配置WhatsApp Web连接。请确保您已设置好WhatsApp Web认证。

## 使用方法

### 基础用法
```javascript
const whatsappHandler = require('openclaw-whatsapp-message-handler');

// 初始化处理器
const handler = new whatsappHandler();

// 处理消息
handler.processMessage(incomingMessage)
  .then(response => {
    // 发送回复
    handler.sendMessage(response);
  });
```

### 命令支持
- `/help` - 显示帮助信息
- `/status` - 显示系统状态
- `/info` - 显示系统信息
- `/history` - 显示消息历史
- `/echo [message]` - 回显消息

## 文件结构

```
whatsapp-message-handler/
├── index.js                 # 主入口文件
├── whatsapp-connector.js    # WhatsApp连接器
├── message-parser.js        # 消息解析器
├── router.js               # 消息路由器
├── response-builder.js     # 回复构建器
├── handlers/              # 消息处理模块
│   └── command-handler.js # 命令处理器
├── config.json            # 配置文件
├── test.js                # 测试文件
├── install.sh             # 安装脚本
├── SKILL.md               # 技能描述
├── REFERENCE.md           # 详细技术参考
├── README.md              # 项目文档
└── package.json           # npm包配置
```

## 示例

### 处理文本消息
```
用户: "你好，我想了解一下你们的产品"
系统: "您好！很高兴为您介绍我们的产品..."
```

### 处理命令
```
用户: "/help"
系统: "可用命令: /help, /status, /info"
```

## 安全考虑

- 所有敏感数据本地存储
- 消息内容加密传输
- 遵循数据保护法规
- 内容安全过滤机制

## 贡献

欢迎贡献！请提交Pull Request或开Issue。

## 许可证

MIT License