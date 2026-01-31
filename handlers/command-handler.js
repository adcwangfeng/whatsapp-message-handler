// 命令处理器
class CommandHandler {
  constructor() {
    this.commands = new Map();
    this.commandHistory = [];
    this.registerDefaultCommands();
  }

  // 注册命令
  registerCommand(name, handler, description = '') {
    this.commands.set(name.toLowerCase(), {
      handler,
      description
    });
  }

  // 执行命令
  async executeCommand(commandStr, message) {
    // 解析命令和参数
    const parts = commandStr.trim().split(/\s+/);
    const commandName = parts[0].toLowerCase();
    const args = parts.slice(1);

    console.log(`⚙️ 执行命令: ${commandName} with args:`, args);

    // 记录命令历史
    this.commandHistory.push({
      command: commandName,
      args,
      from: message.from,
      timestamp: new Date()
    });

    // 获取命令处理器
    const commandDef = this.commands.get(commandName);
    if (!commandDef) {
      return {
        success: false,
        content: `Unknown command: ${commandName}. Use /help to see available commands.`,
        type: 'text'
      };
    }

    try {
      // 执行命令
      const result = await commandDef.handler(args, message);
      
      return {
        success: true,
        ...result
      };
    } catch (error) {
      console.error(`❌ 命令执行失败 ${commandName}:`, error);
      return {
        success: false,
        content: `Error executing command: ${error.message}`,
        type: 'text'
      };
    }
  }

  // 注册默认命令
  registerDefaultCommands() {
    // 帮助命令
    this.registerCommand('/help', async (args, message) => {
      const availableCommands = Array.from(this.commands.entries())
        .map(([name, def]) => `• ${name} - ${def.description}`)
        .join('\n');
      
      return {
        content: `🤖 Available Commands:\n${availableCommands}\n\nExample: /help, /status, /info`,
        type: 'text'
      };
    }, 'Show available commands');

    // 状态命令
    this.registerCommand('/status', async (args, message) => {
      return {
        content: `📊 System Status\n• Uptime: ${this.getUptime()}\n• Connected: Yes\n• Message Handlers: Active\n• Last Message: ${message.timestamp}`,
        type: 'text'
      };
    }, 'Show system status');

    // 信息命令
    this.registerCommand('/info', async (args, message) => {
      return {
        content: `ℹ️ Message Info\n• ID: ${message.id}\n• Type: ${message.type}\n• From: ${message.from}\n• Received: ${message.timestamp}\n• Content: ${message.content.substring(0, 100)}${message.content.length > 100 ? '...' : ''}`,
        type: 'text'
      };
    }, 'Show message information');

    // 历史命令
    this.registerCommand('/history', async (args, message) => {
      const limit = parseInt(args[0]) || 5;
      const recentCommands = this.commandHistory
        .slice(-limit)
        .reverse()
        .map(cmd => `• ${cmd.command} ${cmd.args.join(' ')} - ${cmd.timestamp.toLocaleTimeString()}`)
        .join('\n');
      
      return {
        content: `📖 Recent Commands (${Math.min(limit, this.commandHistory.length)} of ${this.commandHistory.length}):\n${recentCommands || 'No commands executed yet.'}`,
        type: 'text'
      };
    }, 'Show command history');

    // 回声命令
    this.registerCommand('/echo', async (args, message) => {
      const echoedText = args.join(' ');
      return {
        content: `🔊 Echo: ${echoedText}`,
        type: 'text'
      };
    }, 'Echo back the provided text');

    // 计算命令
    this.registerCommand('/calc', async (args, message) => {
      try {
        // 简单的计算功能（仅支持基本运算）
        const expression = args.join('').replace(/[^\d+\-*/().\s]/g, '');
        // 注意：在实际生产环境中，不要使用 eval，这里仅用于演示
        // 实际应用中应使用安全的数学表达式解析库
        const result = `Calculation: ${expression} = ${expression}`; // 占位符
        
        return {
          content: result,
          type: 'text'
        };
      } catch (error) {
        return {
          content: `Error in calculation: ${error.message}`,
          type: 'text'
        };
      }
    }, 'Perform basic calculations');
  }

  // 获取系统运行时间
  getUptime() {
    if (!this.startTime) {
      this.startTime = new Date();
      return 'Just started';
    }
    
    const uptimeMs = new Date() - this.startTime;
    const days = Math.floor(uptimeMs / (1000 * 60 * 60 * 24));
    const hours = Math.floor((uptimeMs % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((uptimeMs % (1000 * 60 * 60)) / (1000 * 60));
    
    if (days > 0) {
      return `${days}d ${hours}h ${minutes}m`;
    } else if (hours > 0) {
      return `${hours}h ${minutes}m`;
    } else {
      return `${minutes}m`;
    }
  }

  // 检查是否为命令
  isCommand(text) {
    return text.trim().startsWith('/') && text.trim().match(/^\/\w+/);
  }

  // 获取所有命令列表
  getCommandList() {
    return Array.from(this.commands.entries()).map(([name, def]) => ({
      name,
      description: def.description
    }));
  }

  // 清除命令历史
  clearHistory() {
    this.commandHistory = [];
    return { success: true, message: 'Command history cleared' };
  }
}

module.exports = CommandHandler;