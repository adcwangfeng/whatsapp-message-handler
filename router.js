// 消息路由器
class MessageRouter {
  constructor() {
    this.routes = new Map();
    this.middlewares = [];
    this.handlers = new Map();
  }

  // 注册中间件
  use(middleware) {
    this.middlewares.push(middleware);
  }

  // 注册路由处理器
  addRoute(pattern, handler) {
    this.routes.set(pattern, handler);
  }

  // 注册消息处理器
  registerHandler(type, handler) {
    this.handlers.set(type, handler);
  }

  // 处理消息
  async handleMessage(message) {
    console.log(`📡 路由处理消息: ${message.id}, 类型: ${message.type}`);

    // 应用中间件
    let processedMessage = { ...message };
    for (const middleware of this.middlewares) {
      processedMessage = await middleware(processedMessage);
      if (!processedMessage) {
        console.log('🚫 中间件终止消息处理');
        return null;
      }
    }

    // 根据消息类型选择处理器
    const handler = this.handlers.get(processedMessage.type) || this.getDefaultHandler();
    
    if (!handler) {
      console.warn(`⚠️  未找到处理器: ${processedMessage.type}`);
      return null;
    }

    try {
      const result = await handler(processedMessage);
      console.log(`✅ 消息处理完成: ${processedMessage.id}`);
      return result;
    } catch (error) {
      console.error(`❌ 消息处理失败: ${processedMessage.id}`, error);
      return {
        error: true,
        message: `处理消息时出错: ${error.message}`,
        originalMessage: processedMessage
      };
    }
  }

  // 注册默认处理器
  getDefaultHandler() {
    return async (message) => {
      console.log(`📝 使用默认处理器处理消息: ${message.type}`);
      
      // 默认处理逻辑
      const response = {
        to: message.from,
        content: this.generateDefaultResponse(message),
        type: 'text',
        originalMessageId: message.id
      };

      return response;
    };
  }

  // 生成默认回复
  generateDefaultResponse(message) {
    const greetings = ['hi', 'hello', 'hey', '你好', '您好'];
    const farewells = ['bye', 'goodbye', 'see you', '再见', '拜拜'];
    const thanks = ['thank', 'thanks', 'thank you', '谢谢'];

    const contentLower = message.content.toLowerCase();

    if (greetings.some(g => contentLower.includes(g))) {
      return 'Hello! I received your message. How can I help you?';
    } else if (farewells.some(f => contentLower.includes(f))) {
      return 'Goodbye! Feel free to contact me anytime.';
    } else if (thanks.some(t => contentLower.includes(t))) {
      return 'You\'re welcome! Is there anything else I can assist you with?';
    } else if (message.type === 'image') {
      return 'I received your image. Thank you!';
    } else if (message.type === 'document') {
      return 'I received your document. I\'ll review it soon.';
    } else if (message.type === 'location') {
      return 'Thank you for sharing your location.';
    } else {
      return `I received your ${message.type} message. Content: ${message.content.substring(0, 50)}${message.content.length > 50 ? '...' : ''}`;
    }
  }

  // 注册常见消息处理器
  registerCommonHandlers() {
    // 文本消息处理器
    this.registerHandler('text', async (message) => {
      console.log(`📝 处理文本消息: ${message.content.substring(0, 30)}...`);
      
      // 检查是否包含命令
      if (message.metadata.commands.length > 0) {
        return await this.handleCommand(message);
      }
      
      // 检查是否包含URL
      if (message.metadata.urls.length > 0) {
        return await this.handleUrl(message);
      }
      
      // 检查情绪并回应
      if (message.metadata.sentiment === 'positive') {
        return {
          to: message.from,
          content: `Thank you for your positive message! I'm glad to hear that. Original: "${message.content}"`,
          type: 'text',
          originalMessageId: message.id
        };
      } else if (message.metadata.sentiment === 'negative') {
        return {
          to: message.from,
          content: `I'm sorry to hear that. How can I help improve the situation? Original: "${message.content}"`,
          type: 'text',
          originalMessageId: message.id
        };
      }
      
      // 默认文本处理
      return {
        to: message.from,
        content: `I received your message: "${message.content}". How can I assist you?`,
        type: 'text',
        originalMessageId: message.id
      };
    });

    // 图片消息处理器
    this.registerHandler('image', async (message) => {
      console.log(`🖼️ 处理图片消息: ${message.mediaUrl}`);
      
      return {
        to: message.from,
        content: `I received your image. Image details: ${JSON.stringify(message.metadata, null, 2)}`,
        type: 'text',
        originalMessageId: message.id
      };
    });

    // 文档消息处理器
    this.registerHandler('document', async (message) => {
      console.log(`📄 处理文档消息: ${message.mediaUrl}`);
      
      return {
        to: message.from,
        content: `I received your document. Document details: ${JSON.stringify(message.metadata, null, 2)}`,
        type: 'text',
        originalMessageId: message.id
      };
    });

    // 位置消息处理器
    this.registerHandler('location', async (message) => {
      console.log(`📍 处理位置消息: ${message.content}`);
      
      return {
        to: message.from,
        content: `Thanks for sharing your location: ${message.content}`,
        type: 'text',
        originalMessageId: message.id
      };
    });

    // 联系人消息处理器
    this.registerHandler('contact', async (message) => {
      console.log(`👤 处理联系人消息: ${message.content}`);
      
      return {
        to: message.from,
        content: `I received contact information: ${JSON.stringify(message.metadata, null, 2)}`,
        type: 'text',
        originalMessageId: message.id
      };
    });
  }

  // 处理命令
  async handleCommand(message) {
    const command = message.metadata.commands[0];
    
    switch (command) {
      case '/help':
        return {
          to: message.from,
          content: 'Available commands: /help, /status, /info',
          type: 'text',
          originalMessageId: message.id
        };
      case '/status':
        return {
          to: message.from,
          content: 'System status: Online and processing messages',
          type: 'text',
          originalMessageId: message.id
        };
      case '/info':
        return {
          to: message.from,
          content: `Message Info: Type=${message.type}, From=${message.from}, Time=${message.timestamp}`,
          type: 'text',
          originalMessageId: message.id
        };
      default:
        return {
          to: message.from,
          content: `Unknown command: ${command}. Try /help for available commands.`,
          type: 'text',
          originalMessageId: message.id
        };
    }
  }

  // 处理URL
  async handleUrl(message) {
    const urls = message.metadata.urls;
    return {
      to: message.from,
      content: `I detected ${urls.length} URL(s) in your message. URLs: ${urls.join(', ')}`,
      type: 'text',
      originalMessageId: message.id
    };
  }
}

module.exports = MessageRouter;