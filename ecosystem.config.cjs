module.exports = {
  apps: [
    {
      name: 'syncwrite',
      script: 'server/dist/index.js',
      cwd: './',
      instances: 1, // Single instance preserves in-memory Yjs documents & terminal sessions
      autorestart: true,
      watch: false,
      max_memory_restart: '1G',
      env: {
        NODE_ENV: 'production',
        PORT: 3001,
      },
    },
  ],
};
