// Vercel 部署诊断脚本
const https = require('https');

const tests = [
  {
    name: '静态文件服务',
    url: 'https://wanguojuexingv3-7lnv.vercel.app/',
    method: 'GET'
  },
  {
    name: '简单API端点',
    url: 'https://wanguojuexingv3-7lnv.vercel.app/api/test-simple',
    method: 'GET'
  },
  {
    name: '健康检查',
    url: 'https://wanguojuexingv3-7lnv.vercel.app/api/health',
    method: 'GET'
  }
];

console.log('🔍 Vercel 部署诊断开始...');
console.log('='.repeat(60));

function testEndpoint(test) {
  return new Promise((resolve) => {
    const options = {
      method: test.method,
      timeout: 10000,
      headers: {
        'User-Agent': 'Diagnostic-Script/1.0'
      }
    };

    const req = https.request(test.url, options, (res) => {
      let data = '';
      res.on('data', (chunk) => {
        data += chunk;
      });
      res.on('end', () => {
        console.log(`✅ ${test.name}:`);
        console.log(`   状态码: ${res.statusCode}`);
        console.log(`   响应头: ${JSON.stringify(res.headers, null, 2).substring(0, 100)}...`);
        
        try {
          const json = JSON.parse(data);
          console.log(`   响应数据: ${JSON.stringify(json, null, 2).substring(0, 200)}...`);
        } catch {
          console.log(`   响应内容: ${data.substring(0, 200)}...`);
        }
        
        console.log('');
        resolve({ success: true, statusCode: res.statusCode });
      });
    });

    req.on('error', (error) => {
      console.log(`❌ ${test.name}:`);
      console.log(`   错误: ${error.message}`);
      console.log(`   可能原因: ${getErrorReason(error)}`);
      console.log('');
      resolve({ success: false, error: error.message });
    });

    req.on('timeout', () => {
      console.log(`❌ ${test.name}:`);
      console.log(`   错误: 请求超时 (10秒)`);
      console.log(`   可能原因: 服务器未启动或网络问题`);
      console.log('');
      req.destroy();
      resolve({ success: false, error: 'timeout' });
    });

    req.end();
  });
}

function getErrorReason(error) {
  if (error.code === 'ENOTFOUND') {
    return '域名解析失败，Vercel项目可能不存在或已删除';
  }
  if (error.code === 'ECONNREFUSED') {
    return '连接被拒绝，服务器未运行或端口错误';
  }
  if (error.code === 'ETIMEDOUT') {
    return '连接超时，服务器可能宕机或网络问题';
  }
  return '未知错误，请检查Vercel部署状态';
}

async function runDiagnostics() {
  console.log('📊 测试目标: wanguojuexingv3-7lnv.vercel.app');
  console.log('');
  
  const results = [];
  for (const test of tests) {
    results.push(await testEndpoint(test));
  }
  
  console.log('='.repeat(60));
  console.log('📋 诊断总结:');
  
  const successfulTests = results.filter(r => r.success).length;
  console.log(`✅ 成功测试: ${successfulTests}/${tests.length}`);
  
  if (successfulTests === 0) {
    console.log('🚨 所有测试失败，可能原因:');
    console.log('   1. Vercel项目未部署或部署失败');
    console.log('   2. 域名配置错误');
    console.log('   3. 项目已被删除');
    console.log('');
    console.log('💡 建议解决方案:');
    console.log('   • 访问 https://vercel.com 检查项目状态');
    console.log('   • 查看部署日志中的具体错误');
    console.log('   • 考虑切换到 Render.com (已有完整配置)');
  } else if (successfulTests === tests.length) {
    console.log('🎉 所有测试成功！API服务器运行正常');
    console.log('');
    console.log('💡 如果前端仍显示"Failed to fetch":');
    console.log('   • 检查浏览器控制台的具体错误信息');
    console.log('   • 确保前端API地址配置正确');
    console.log('   • 检查CORS配置是否允许前端域名');
  } else {
    console.log('⚠️  部分测试失败，可能原因:');
    console.log('   • API服务器启动但某些端点有问题');
    console.log('   • 环境变量配置不正确');
    console.log('   • 依赖安装失败');
    console.log('');
    console.log('💡 建议:');
    console.log('   • 检查Vercel环境变量设置');
    console.log('   • 查看Serverless Function日志');
    console.log('   • 确保DEEPSEEK_API_KEY已正确设置');
  }
  
  console.log('');
  console.log('🛠️ 快速修复方案:');
  console.log('   1. 切换到 Render.com (推荐)');
  console.log('      - 访问 https://render.com');
  console.log('      - 导入GitHub仓库 wanguojuexingv3');
  console.log('      - 使用现有 render.yaml 配置');
  console.log('      - 设置 DEEPSEEK_API_KEY 环境变量');
  console.log('');
  console.log('   2. 检查Vercel配置:');
  console.log('      - 确保 vercel.json 配置正确');
  console.log('      - 检查 api/index.js 语法');
  console.log('      - 确认 package.json 依赖正确');
  console.log('');
  console.log('   3. 本地测试验证:');
  console.log('      - 在本地运行 node rok-ai-server-enhanced.js');
  console.log('      - 测试 http://localhost:3001/api/health');
  console.log('      - 确认代码在本地可以正常运行');
}

runDiagnostics().catch(console.error);