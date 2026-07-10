module.exports = {
  apps: [
    {
      name: 'astrology-backend',
      script: './server.js',
      instances: 1,
      autorestart: true,
      watch: false,
      max_memory_restart: '1G',
      env: {
        NODE_ENV: 'development',
      },
      env_production: {
        NODE_ENV: 'production',
        // Do NOT set PORT here — Hostinger/Render inject PORT automatically
      },
    },
  ],
};
