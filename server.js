const express = require('express');
const { createProxyMiddleware } = require('http-proxy-middleware');

const app = express();
const PORT = 8080;

// Vite App Proxy (có bao gồm WebSocket HMR)
app.use(
  createProxyMiddleware({
    pathFilter: '/shareme/tool',
    target: 'http://localhost:5173',
    changeOrigin: true,
    ws: true,
    logLevel: 'silent'
  })
);

// Docusaurus App Proxy (chứa cả WebSocket HMR)
app.use(
  createProxyMiddleware({
    target: 'http://localhost:3000',
    changeOrigin: true,
    ws: true,
    logLevel: 'silent'
  })
);

app.listen(PORT, () => {
  console.log(`\n======================================================`);
  console.log(`🚀 Development Proxy đang chạy tại: http://localhost:${PORT}/shareme`);
  console.log(`======================================================\n`);
});
