module.exports = {
  apps: [
    {
      name: 'eventos-web',
      script: 'npx',
      args: 'astro dev --host 0.0.0.0 --port 3000',
      cwd: '/home/user/webapp/apps/web',
      env: {
        NODE_ENV: 'development',
      },
      watch: false,
      instances: 1,
      exec_mode: 'fork',
    },
  ],
}
