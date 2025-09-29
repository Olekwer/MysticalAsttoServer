// PM2 configuration for production deployment
module.exports = {
  apps: [{
    name: 'mystical-astro-api',
    script: 'dist/main.js',
    instances: 'max', // or number of instances
    exec_mode: 'cluster',
    env: {
      NODE_ENV: 'production',
      APP_PORT: 3010,
    },
    env_production: {
      NODE_ENV: 'production',
      APP_PORT: 3010,
    },
    // Restart settings
    max_memory_restart: '1G',
    restart_delay: 4000,
    
    // Logs
    log_file: './logs/combined.log',
    out_file: './logs/out.log',
    error_file: './logs/error.log',
    log_date_format: 'YYYY-MM-DD HH:mm Z',
    
    // Advanced settings
    watch: false,
    ignore_watch: ['node_modules', 'logs'],
    max_restarts: 10,
    min_uptime: '10s',
  }]
};
