// Vercel Serverless Function 入口点
// 包装 Express 应用以在 Serverless 环境中运行

console.log('🚀 Vercel Serverless Function 启动中...');

// 导入 Express 应用
const app = require('../rok-ai-server-enhanced.js');

// Vercel 特定配置
console.log('🔧 环境变量检查:');
console.log(`   NODE_ENV: ${process.env.NODE_ENV || '未设置'}`);
console.log(`   VERCEL: ${process.env.VERCEL ? '是' : '否'}`);
console.log(`   VERCEL_ENV: ${process.env.VERCEL_ENV || '未设置'}`);
console.log(`   VERCEL_URL: ${process.env.VERCEL_URL || '未设置'}`);
console.log(`   VERCEL_GIT_COMMIT_REF: ${process.env.VERCEL_GIT_COMMIT_REF || '未设置'}`);

// 确保在 Vercel 环境中允许所有来源（如果需要，可以在此覆盖 CORS 设置）
if (process.env.VERCEL) {
  console.log('🔧 Vercel 环境检测到，已启用生产模式');
  // 这里可以添加 Vercel 特定的配置
  // 例如：自动添加 Vercel 域名到允许的来源
}

// 导出 Express 应用作为 Serverless Function
// Vercel 的 Node.js runtime 期望一个接收 (req, res) 的函数
module.exports = (req, res) => {
  console.log(`📥 请求: ${req.method} ${req.url}`);
  
  // 添加一些 Vercel 特定的请求头（可选）
  res.setHeader('X-Powered-By', 'Vercel + Express');
  res.setHeader('Server', 'Vercel');
  
  // 将请求传递给 Express 应用
  return app(req, res);
};