module.exports = {
    apps : [{
      name: "My App",
      script: "npm run start",
      instances: "1",
      max_memory_restart: "256M",
      env: {
        NODE_ENV: "development"
      },
      env_production: {
        NODE_ENV: "production"
      },
    }]
}