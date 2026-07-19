const express = require("express");
const { createProxyMiddleware } = require("http-proxy-middleware");
const os = require("os");

const app = express();
const PORT = 8080;

// Helper to get local network IPv4 address
function getLocalIpAddress() {
  const interfaces = os.networkInterfaces();
  for (const name of Object.keys(interfaces)) {
    for (const net of interfaces[name]) {
      // Handle both string 'IPv4' (Node 18+) and number 4 (older Node)
      if ((net.family === "IPv4" || net.family === 4) && !net.internal) {
        return net.address;
      }
    }
  }
  return "127.0.0.1";
}

const IP = getLocalIpAddress();

// Vite App Proxy (có bao gồm WebSocket HMR)
app.use(
  createProxyMiddleware({
    pathFilter: "/shareme/tool",
    target: "http://127.0.0.1:5173",
    changeOrigin: true,
    ws: true,
    logLevel: "silent",
  }),
);

// Docusaurus App Proxy (chứa cả WebSocket HMR)
app.use(
  createProxyMiddleware({
    target: "http://127.0.0.1:3000",
    changeOrigin: true,
    ws: true,
    logLevel: "silent",
  }),
);

app.listen(PORT, "0.0.0.0", () => {
  console.log(`\n======================================================`);
  console.log(`🚀 Development Proxy đang chạy tại:`);
  console.log(`- Local:   http://localhost:${PORT}/shareme`);
  console.log(`- Network: http://${IP}:${PORT}/shareme`);
  console.log(`======================================================\n`);
});
