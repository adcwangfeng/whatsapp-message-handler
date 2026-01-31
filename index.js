// WhatsApp消息处理技能主入口
const WhatsAppConnector = require('./whatsapp-connector.js');
const MessageParser = require('./message-parser.js');
const MessageRouter = require('./router.js');
const ResponseBuilder = require('./response-builder.js');
const CommandHandler = require('./handlers/command-handler.js');

class WhatsAppMessageHandler {
  constructor(config = {}) {
    this.config = {
      // 默认配置
      autoConnect: true,
      messageProcessing: true,
      responseGeneration: true,
      logging: true,
      ...config
    };

    // 初始化各个组件
    this.connector = new WhatsAppConnector(this.config.connector || {});
    this.parser = new MessageParser();
    this.router = new MessageRouter();
    this.responseBuilder = new ResponseBuilder();
    this.commandHandler = new CommandHandler();

    // 注册内置处理器
    this.router.registerCommonHandlers();
    this.responseBuilder.registerBuiltInTemplates();

    // 设置消息处理器
    this.setupMessageHandling();

    console.log('🤖 WhatsApp消息处理技能已初始化');
  }

  // 设置消息处理流程
  setupMessageHandling() {
    // 设置消息路由
    this.router.use(async (message) => {
      if (this.config.logging) {
        console.log(`📥 接收到消息: ${message.id} from ${message.from}`);
      }
      return message;
    });

    // 注册文本消息处理器
    this.router.registerHandler('text', async (message) => {
      // 检查是否为命令
      if (this.commandHandler.isCommand(message.content)) {
        return await this.commandHandler.executeCommand(message.content, message);
      }

      // 使用路由器处理
      return await this.router.getDefaultHandler()(message);
    });
  }

  // 连接到WhatsApp
  async connect() {
    console.log('🔌 正在连接到WhatsApp...');
    const result = await this.connector.connect();
    
    if (result.success) {
      console.log('✅ WhatsApp连接成功');
      
      // 如果启用了自动消息处理，开始监听
      if (this.config.messageProcessing) {
        this.startListening();
      }
    }
    
    return result;
  }

  // 开始监听消息
  async startListening() {
    console.log('👂 开始监听WhatsApp消息...');
    
    // 模拟持续监听
    this.listenInterval = setInterval(async () => {
      try {
        // 检查连接状态
        if (!this.connector.isConnected) {
          console.log('⚠️  WhatsApp连接已断开，尝试重连...');
          await this.connector.connect();
          return;
        }

        // 接收消息
        const rawMessage = await this.connector.receiveMessage();
        if (!rawMessage) {
          return;
        }

        console.log(`📩 收到新消息: ${rawMessage.type} from ${rawMessage.from}`);

        // 解析消息
        const parsedMessage = this.parser.parseMessage(rawMessage);
        
        // 处理消息
        const routeResult = await this.router.handleMessage(parsedMessage);
        
        if (routeResult && routeResult.to) {
          // 构建回复
          const response = this.responseBuilder.buildSmartResponse(parsedMessage);
          
          // 发送回复
          const sendResult = await this.connector.sendMessage(
            response.to, 
            response.content, 
            response.options
          );
          
          console.log(`📤 已发送回复到: ${response.to}`);
        }
      } catch (error) {
        console.error('❌ 消息处理错误:', error);
      }
    }, 5000); // 每5秒检查一次新消息
  }

  // 停止监听
  stopListening() {
    if (this.listenInterval) {
      clearInterval(this.listenInterval);
      console.log('🛑 停止监听消息');
    }
  }

  // 发送消息
  async sendMessage(to, content, options = {}) {
    return await this.connector.sendMessage(to, content, options);
  }

  // 处理单条消息（外部调用接口）
  async processMessage(rawMessage) {
    try {
      // 解析消息
      const parsedMessage = this.parser.parseMessage(rawMessage);
      
      // 路由处理
      const routeResult = await this.router.handleMessage(parsedMessage);
      
      // 如果有回复，发送回复
      if (routeResult && routeResult.to) {
        const sendResult = await this.connector.sendMessage(
          routeResult.to,
          routeResult.content,
          routeResult.options
        );
        
        return {
          success: true,
          processed: true,
          sendResult,
          originalMessage: parsedMessage
        };
      }
      
      return {
        success: true,
        processed: true,
        originalMessage: parsedMessage,
        hasReply: false
      };
    } catch (error) {
      console.error('❌ 消息处理失败:', error);
      return {
        success: false,
        error: error.message,
        originalMessage: rawMessage
      };
    }
  }

  // 获取系统状态
  getStatus() {
    return {
      connector: this.connector.getStatus(),
      config: this.config,
      handlers: this.router.handlers.size,
      templates: this.responseBuilder.templates.size,
      commandHistory: this.commandHandler.commandHistory.length,
      timestamp: new Date()
    };
  }

  // 关闭系统
  async shutdown() {
    console.log('🛑 正在关闭WhatsApp消息处理系统...');
    
    this.stopListening();
    
    if (this.connector.isConnected) {
      await this.connector.disconnect();
    }
    
    console.log('✅ 系统已关闭');
  }

  // 获取统计信息
  getStats() {
    return {
      totalMessagesProcessed: this.getTotalProcessedMessages(),
      uptime: this.getUptime(),
      connected: this.connector.isConnected,
      messageQueueLength: 0 // 实际实现中会跟踪队列
    };
  }

  // 获取已处理消息总数（模拟）
  getTotalProcessedMessages() {
    // 在实际实现中，这会跟踪已处理的消息数量
    return Math.floor(Math.random() * 1000);
  }

  // 获取运行时间
  getUptime() {
    if (!this.startTime) {
      this.startTime = new Date();
    }
    return new Date() - this.startTime;
  }
}

// 导出主类
module.exports = WhatsAppMessageHandler;

// 如果直接运行此文件，则启动系统
if (require.main === module) {
  console.log("📱 WhatsApp消息处理技能");
  console.log("💡 系统功能:");
  console.log("   - 接收多种类型的消息（文本、图片、文档等）");
  console.log("   - 智能解析和路由消息");
  console.log("   - 生成适当的回复");
  console.log("   - 支持命令处理");
  console.log("   - 消息历史记录");
  
  // 创建实例并连接
  const handler = new WhatsAppMessageHandler();
  
  console.log('\n🚀 系统已准备就绪，可通过API调用处理WhatsApp消息');
}