import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  // 设置 base 为相对路径，这样无论部署在 GitHub Pages 的根目录还是子目录下都能正常运行
  // base: './',
  server: {
    port: 5173,
    open: true,
    host: true // 允许通过 IP 地址访问
  }
});
