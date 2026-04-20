// 本地测试脚本
const http = require('http');

const options = {
  hostname: 'localhost',
  port: 3001,
  path: '/api/health',
  method: 'GET',
  timeout: 5000
};

console.log('🔧 测试本地服务器...');

const req = http.request(options, (res) => {
  console.log(`✅ 状态码: ${res.statusCode}`);
  
  let data = '';
  res.on('data', (chunk) => {
    data += chunk;
  });
  
  res.on('end', () => {
    try {
      const json = JSON.parse(data);
      console.log('✅ 响应数据:', JSON.stringify(json, null, 2));
      console.log('✅ 本地服务器运行正常！');
      process.exit(0);
    } catch (e) {
      console.log('❌ JSON解析失败:', e.message);
      console.log('原始响应:', data.substring(0, 200));
      process.exit(1);
    }
  });
});

req.on('error', (e) => {
  console.error('❌ 请求失败:', e.message);
  console.log('💡 提示: 请先运行 "node rok-ai-server-enhanced.js" 启动服务器');
  process.exit(1);
});

req.on('timeout', () => {
  console.error('❌ 请求超时 (5秒)');
  req.destroy();
  process.exit(1);
});

req.end();