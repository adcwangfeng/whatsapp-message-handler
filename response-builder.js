// 回复构建器
class ResponseBuilder {
  constructor() {
    this.templates = new Map();
    this.contextStore = new Map();
  }

  // 注册回复模板
  registerTemplate(name, templateFunction) {
    this.templates.set(name, templateFunction);
  }

  // 构建回复
  buildResponse(message, responseType = 'default', context = {}) {
    console.log(`🏗️  构建回复: ${responseType} for message ${message.id}`);
    
    // 获取模板
    const templateFn = this.templates.get(responseType) || this.getDefaultTemplate();
    
    // 合并上下文
    const fullContext = {
      message,
      timestamp: new Date(),
      ...context
    };

    // 执行模板函数
    const response = templateFn(fullContext);
    
    // 标准化回复格式
    return this.normalizeResponse(response, message.from);
  }

  // 默认模板
  getDefaultTemplate() {
    return (context) => {
      const { message } = context;
      return {
        content: `Received your ${message.type} message. Content preview: "${message.content.substring(0, 50)}${message.content.length > 50 ? '...' : ''}"`,
        type: 'text',
        metadata: {
          originalMessageId: message.id,
          responseTo: message.from
        }
      };
    };
  }

  // 简单文本回复模板
  getSimpleTextTemplate() {
    return (context) => {
      const { message, customText } = context;
      return {
        content: customText || `I received your message: "${message.content}"`,
        type: 'text',
        metadata: {
          originalMessageId: message.id
        }
      };
    };
  }

  // 问候回复模板
  getGreetingTemplate() {
    return (context) => {
      const { message } = context;
      const hour = new Date().getHours();
      let greeting = 'Good day';

      if (hour < 12) greeting = 'Good morning';
      else if (hour < 18) greeting = 'Good afternoon';
      else greeting = 'Good evening';

      return {
        content: `${greeting}! I received your message: "${message.content}". How can I assist you today?`,
        type: 'text',
        metadata: {
          originalMessageId: message.id
        }
      };
    };
  }

  // 帮助回复模板
  getHelpTemplate() {
    return (context) => {
      return {
        content: `🤖 WhatsApp Message Handler Help\n\nAvailable features:\n• Text message processing\n• Image recognition\n• Document handling\n• Location services\n• Command execution (/help, /status, /info)\n\nHow can I assist you?`,
        type: 'text',
        metadata: {
          originalMessageId: context.message.id
        }
      };
    };
  }

  // 错误回复模板
  getErrorTemplate() {
    return (context) => {
      const { error, message } = context;
      return {
        content: `⚠️ An error occurred while processing your message: ${error.message}\n\nOriginal message: "${message.content}"`,
        type: 'text',
        metadata: {
          originalMessageId: message.id,
          isError: true
        }
      };
    };
  }

  // 多媒体回复模板
  getMediaTemplate() {
    return (context) => {
      const { message } = context;
      if (message.type === 'image') {
        return {
          content: `🖼️ I received your image. Image analysis: ${JSON.stringify(message.metadata, null, 2)}`,
          type: 'text',
          metadata: {
            originalMessageId: message.id,
            mediaType: 'image'
          }
        };
      } else if (message.type === 'document') {
        return {
          content: `📄 I received your document. Document details: ${JSON.stringify(message.metadata, null, 2)}`,
          type: 'text',
          metadata: {
            originalMessageId: message.id,
            mediaType: 'document'
          }
        };
      }
      return this.getDefaultTemplate()(context);
    };
  }

  // 注册所有内置模板
  registerBuiltInTemplates() {
    this.registerTemplate('default', this.getDefaultTemplate());
    this.registerTemplate('simple', this.getSimpleTextTemplate());
    this.registerTemplate('greeting', this.getGreetingTemplate());
    this.registerTemplate('help', this.getHelpTemplate());
    this.registerTemplate('error', this.getErrorTemplate());
    this.registerTemplate('media', this.getMediaTemplate());
  }

  // 标准化回复格式
  normalizeResponse(response, recipient) {
    if (typeof response === 'string') {
      return {
        to: recipient,
        content: response,
        type: 'text'
      };
    }

    return {
      to: response.to || recipient,
      content: response.content,
      type: response.type || 'text',
      metadata: response.metadata || {},
      options: response.options || {}
    };
  }

  // 根据消息内容智能选择回复类型
  buildSmartResponse(message) {
    const content = message.content.toLowerCase();
    
    // 检查是否为问候
    if (this.isGreeting(content)) {
      return this.buildResponse(message, 'greeting');
    }
    
    // 检查是否为帮助请求
    if (this.isHelpRequest(content)) {
      return this.buildResponse(message, 'help');
    }
    
    // 检查是否为媒体内容
    if (['image', 'document', 'audio', 'video'].includes(message.type)) {
      return this.buildResponse(message, 'media');
    }
    
    // 默认回复
    return this.buildResponse(message, 'default');
  }

  // 检查是否为问候
  isGreeting(content) {
    const greetings = ['hi', 'hello', 'hey', 'good morning', 'good afternoon', 'good evening', '你好', '您好', '早上好', '下午好', '晚上好'];
    return greetings.some(g => content.includes(g));
  }

  // 检查是否为帮助请求
  isHelpRequest(content) {
    const helpPhrases = ['help', 'help me', 'what can you do', 'how to', 'command', 'commands', '功能', '帮助', '能做什么'];
    return helpPhrases.some(h => content.includes(h));
  }

  // 存储消息上下文
  setContext(messageId, context) {
    this.contextStore.set(messageId, context);
  }

  // 获取消息上下文
  getContext(messageId) {
    return this.contextStore.get(messageId);
  }

  // 清理上下文
  clearContext(messageId) {
    this.contextStore.delete(messageId);
  }
}

module.exports = ResponseBuilder;