module.exports = {
  apps: [
    {
      name: 'secure-admin',
      script: 'npm',
      args: 'start',
      env: {
        NODE_ENV: 'production',
        PORT: 3000,
      },
    },
  ],
};
