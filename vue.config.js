const { defineConfig } = require("@vue/cli-service");
module.exports = defineConfig({
  transpileDependencies: true,
  devServer: {
    port: 5000,
    allowedHosts: "all",
    proxy: {
      '/api': {
        target: 'http://localhost:3001',
        changeOrigin: true
      }
    },
    client: {
      webSocketURL: "auto://0.0.0.0:0/ws",
    },
    historyApiFallback: true
  },
});
