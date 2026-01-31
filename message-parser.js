// 消息解析器
class MessageParser {
  constructor() {
    this.supportedTypes = ['text', 'image', 'document', 'audio', 'video', 'location', 'contact', 'sticker'];
  }

  // 解析接收到的消息
  parseMessage(rawMessage) {
    const parsedMessage = {
      id: rawMessage.id,
      from: rawMessage.from,
      type: rawMessage.type || 'text',
      content: rawMessage.content || '',
      timestamp: rawMessage.timestamp || new Date(),
      mediaUrl: rawMessage.mediaUrl || null,
      metadata: {}
    };

    // 根据消息类型进行特定处理
    switch (parsedMessage.type) {
      case 'text':
        parsedMessage.metadata = this.parseTextContent(parsedMessage.content);
        break;
      case 'image':
        parsedMessage.metadata = this.parseMediaContent(rawMessage.mediaUrl, 'image');
        break;
      case 'document':
        parsedMessage.metadata = this.parseMediaContent(rawMessage.mediaUrl, 'document');
        break;
      case 'location':
        parsedMessage.metadata = this.parseLocationContent(rawMessage.content);
        break;
      case 'contact':
        parsedMessage.metadata = this.parseContactContent(rawMessage.content);
        break;
      default:
        parsedMessage.metadata = { raw: rawMessage };
    }

    return parsedMessage;
  }

  // 解析文本内容
  parseTextContent(content) {
    const metadata = {
      wordCount: content.split(/\s+/).length,
      charCount: content.length,
      mentions: this.extractMentions(content),
      hashtags: this.extractHashtags(content),
      urls: this.extractUrls(content),
      commands: this.extractCommands(content),
      sentiment: this.estimateSentiment(content)
    };

    return metadata;
  }

  // 提取@提及
  extractMentions(content) {
    const regex = /@\w+/g;
    return content.match(regex) || [];
  }

  // 提取#话题
  extractHashtags(content) {
    const regex = /#\w+/g;
    return content.match(regex) || [];
  }

  // 提取URL
  extractUrls(content) {
    const regex = /(https?:\/\/[^\s]+)/g;
    return content.match(regex) || [];
  }

  // 提取命令（以/开头）
  extractCommands(content) {
    const regex = /\/\w+/g;
    return content.match(regex) || [];
  }

  // 估计情感倾向（简单实现）
  estimateSentiment(content) {
    const positiveWords = ['good', 'great', 'excellent', 'amazing', 'love', 'like', 'happy', 'thank', 'thanks', 'awesome'];
    const negativeWords = ['bad', 'terrible', 'awful', 'hate', 'dislike', 'sad', 'angry', 'annoying', 'worst'];

    const lowerContent = content.toLowerCase();
    const posCount = positiveWords.filter(word => lowerContent.includes(word)).length;
    const negCount = negativeWords.filter(word => lowerContent.includes(word)).length;

    if (posCount > negCount) return 'positive';
    if (negCount > posCount) return 'negative';
    return 'neutral';
  }

  // 解析媒体内容
  parseMediaContent(mediaUrl, mediaType) {
    return {
      url: mediaUrl,
      type: mediaType,
      size: 'unknown', // 在实际实现中会获取实际大小
      dimensions: null,
      mimeType: null,
      caption: null
    };
  }

  // 解析位置内容
  parseLocationContent(content) {
    // 在实际实现中会解析地理位置信息
    return {
      latitude: null,
      longitude: null,
      address: content,
      accuracy: null
    };
  }

  // 解析联系人内容
  parseContactContent(content) {
    // 在实际实现中会解析联系人信息
    return {
      name: content,
      phone: null,
      email: null
    };
  }

  // 验证消息类型是否支持
  isValidMessageType(type) {
    return this.supportedTypes.includes(type);
  }

  // 格式化回复消息
  formatReply(replyContent, options = {}) {
    const formattedReply = {
      content: replyContent,
      type: options.type || 'text',
      metadata: {
        timestamp: new Date(),
        priority: options.priority || 'normal',
        channel: 'whatsapp'
      },
      options: {
        ...options
      }
    };

    return formattedReply;
  }
}

module.exports = MessageParser;