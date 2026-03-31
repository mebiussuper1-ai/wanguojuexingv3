const http = require('http');

const data = JSON.stringify({
    idea: {
        title: '测试创意标题',
        description: '测试描述',
        platform: '抖音/快手',
        style: '史诗战争',
        targetAudience: '年轻玩家',
        tags: ['测试', '战争'],
        characters: ['凯撒', '曹操']
    },
    requirement: '万国觉醒凯撒与曹操的跨时空对决',
    count: 1
});

const options = {
    hostname: 'localhost',
    port: 3002,
    path: '/api/generate-batch-scripts',
    method: 'POST',
    headers: {
        'Content-Type': 'application/json',
        'Content-Length': data.length
    },
    timeout: 15000 // 15秒超时
};

const req = http.request(options, (res) => {
    console.log(`状态码: ${res.statusCode}`);
    
    let responseData = '';
    res.on('data', (chunk) => {
        responseData += chunk;
    });
    
    res.on('end', () => {
        try {
            const parsed = JSON.parse(responseData);
            console.log('响应数据:', JSON.stringify(parsed, null, 2));
            if (parsed.success) {
                console.log('✅ API测试成功！');
                process.exit(0);
            } else {
                console.log('❌ API返回失败:', parsed.error);
                process.exit(1);
            }
        } catch (e) {
            console.log('❌ 响应解析失败:', e.message);
            console.log('原始响应:', responseData.substring(0, 500));
            process.exit(1);
        }
    });
});

req.on('error', (e) => {
    console.error('❌ 请求失败:', e.message);
    process.exit(1);
});

req.on('timeout', () => {
    console.error('❌ 请求超时 (15秒)');
    req.destroy();
    process.exit(1);
});

req.write(data);
req.end();

console.log('发送测试请求到API...');