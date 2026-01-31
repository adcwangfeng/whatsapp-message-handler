// WhatsApp消息处理技能测试
const WhatsAppMessageHandler = require('./index.js');

async function testWhatsAppSkill() {
  console.log('🧪 开始测试WhatsApp消息处理技能\n');
  
  try {
    // 创建处理器实例
    const handler = new WhatsAppMessageHandler();
    console.log('✅ 1. 技能实例创建成功');
    
    // 测试消息解析
    const sampleMessage = {
      id: 'test_msg_1',
      from: '+1234567890',
      type: 'text',
      content: 'Hello, this is a test message with @mention and #hashtag',
      timestamp: new Date()
    };
    
    console.log('\n📋 2. 测试消息解析...');
    const parsed = handler.parser.parseMessage(sampleMessage);
    console.log('   解析结果:', {
      id: parsed.id,
      type: parsed.type,
      wordCount: parsed.metadata.wordCount,
      mentions: parsed.metadata.mentions,
      hashtags: parsed.metadata.hashtags
    });
    console.log('✅ 消息解析成功');
    
    // 测试路由
    console.log('\n📋 3. 测试消息路由...');
    const routeResult = await handler.router.handleMessage(parsed);
    console.log('✅ 消息路由成功');
    
    // 测试回复构建
    console.log('\n📋 4. 测试回复构建...');
    const response = handler.responseBuilder.buildSmartResponse(parsed);
    console.log('   回复内容:', response.content.substring(0, 60) + '...');
    console.log('✅ 回复构建成功');
    
    // 测试命令处理
    console.log('\n📋 5. 测试命令处理...');
    const commandMsg = {
      id: 'cmd_msg_1',
      from: '+1234567890',
      type: 'text',
      content: '/help',
      timestamp: new Date()
    };
    
    const parsedCmd = handler.parser.parseMessage(commandMsg);
    const cmdResult = await handler.router.handleMessage(parsedCmd);
    console.log('   命令处理结果:', typeof cmdResult.content === 'string' ? cmdResult.content.substring(0, 60) + '...' : 'Handled');
    console.log('✅ 命令处理成功');
    
    // 测试图片消息
    console.log('\n📋 6. 测试图片消息处理...');
    const imageMsg = {
      id: 'img_msg_1',
      from: '+1234567890',
      type: 'image',
      content: 'Check out this image',
      mediaUrl: 'https://example.com/test.jpg',
      timestamp: new Date()
    };
    
    const parsedImage = handler.parser.parseMessage(imageMsg);
    const imageResult = await handler.router.handleMessage(parsedImage);
    console.log('✅ 图片消息处理成功');
    
    // 测试多种消息类型
    console.log('\n📋 7. 测试多种消息类型...');
    const messageTypes = [
      { type: 'document', content: 'Document received', filename: 'report.pdf' },
      { type: 'location', latitude: 40.7128, longitude: -74.0060, address: 'New York, NY' },
      { type: 'contact', contactName: 'John Doe', contactPhone: '+1234567890' },
      { type: 'audio', content: 'Audio message', duration: 30 },
      { type: 'video', content: 'Video message', duration: 120 }
    ];
    
    for (let i = 0; i < messageTypes.length; i++) {
      const msg = {
        id: `multi_msg_${i+1}`,
        from: '+1234567890',
        timestamp: new Date(),
        ...messageTypes[i]
      };
      
      const parsedMsg = handler.parser.parseMessage(msg);
      const result = await handler.router.handleMessage(parsedMsg);
      console.log(`   ✅ ${messageTypes[i].type} 消息处理成功`);
    }
    
    console.log('\n🎉 所有测试通过！');
    console.log('📱 WhatsApp消息处理技能功能完整');
    
    // 显示系统状态
    const status = handler.getStatus();
    console.log('\n📊 系统状态:');
    console.log('   - 连接状态:', status.connector.isConnected);
    console.log('   - 处理器数量:', status.handlers);
    console.log('   - 模板数量:', status.templates);
    
    return true;
    
  } catch (error) {
    console.error('❌ 测试失败:', error);
    console.error('详细错误:', error.stack);
    return false;
  }
}

// 运行测试
testWhatsAppSkill().then(success => {
  if (success) {
    console.log('\n✅ 测试完成 - 所有功能正常');
  } else {
    console.log('\n❌ 测试完成 - 存在问题');
    process.exit(1);
  }
});