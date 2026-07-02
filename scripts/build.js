const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('--- Đang Build Docusaurus (Docs) ---');
execSync('npm run build -w apps/docs', { stdio: 'inherit' });

console.log('--- Đang Build Vite (Tools) ---');
execSync('npm run build -w apps/tools', { stdio: 'inherit' });

console.log('--- Copy kết quả Vite vào thư mục Build của Docusaurus ---');
const viteDistPath = path.join(__dirname, '../apps/tools/dist');
const docusaurusBuildPath = path.join(__dirname, '../apps/docs/build');
const targetPath = path.join(docusaurusBuildPath, 'tool');

// Hàm copy thư mục
function copyDirectory(src, dest) {
  if (!fs.existsSync(dest)) {
    fs.mkdirSync(dest, { recursive: true });
  }
  const entries = fs.readdirSync(src, { withFileTypes: true });

  for (let entry of entries) {
    const srcPath = path.join(src, entry.name);
    const destPath = path.join(dest, entry.name);

    if (entry.isDirectory()) {
      copyDirectory(srcPath, destPath);
    } else {
      fs.copyFileSync(srcPath, destPath);
    }
  }
}

if (fs.existsSync(viteDistPath)) {
  copyDirectory(viteDistPath, targetPath);
  console.log(`Đã copy thành công Vite (Tools) vào ${targetPath}`);
} else {
  console.error(`Không tìm thấy thư mục ${viteDistPath}, build Vite thất bại?`);
}

console.log('--- Build All Success ---');
