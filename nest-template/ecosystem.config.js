module.exports = {
  apps: [
    {
      name: 'nest-template',
      port: '3000',
      script: './dist/main.js',
      instances: 'max', // 使用集群模式
      exec_mode: 'cluster', // 集群模式
      autorestart: true, // 自动重启
      watch: false, // 关闭文件监听
      kill_timeout: 10000, // 延长优雅关闭超时时间（单位：毫秒）
      env: {
        NODE_ENV: 'production', // 环境变量
        PORT: process.env.APP_PORT, // 端口号
      }
    },
  ],
};
