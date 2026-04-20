module.exports = {
  apps: [{
    name: 'rok-ai-server',
    script: 'rok-ai-server-enhanced.js',
    instances: 'max',  // 使用所有CPU核心
    exec_mode: 'cluster',  // 集群模式
    autorestart: true,
    watch: false,
    max_memory_restart: '512M',
    env: {
      NODE_ENV: 'development',
      PORT: 3001,
      LOG_LEVEL: 'debug'
    },
    env_production: {
      NODE_ENV: 'production',
      PORT: 3001,
      LOG_LEVEL: 'info'
    },
    error_file: './logs/err.log',
    out_file: './logs/out.log',
    log_file: './logs/combined.log',
    time: true,
    // 高级配置
    max_restarts: 10,
    min_uptime: '10s',
    kill_timeout: 5000,
    listen_timeout: 3000,
    // 健康检查
    health_check: {
      url: 'https://wanguojuexingv3-7lnv.vercel.app/api/health',
      interval: 30000,  // 30秒
      timeout: 5000
    }
  }]
};