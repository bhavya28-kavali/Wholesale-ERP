import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';

export default ({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '');
  const apiUrl = env.VITE_API_URL;
  const backendUrl = env.VITE_BACKEND_URL;
  const devPort = Number(env.VITE_DEV_SERVER_PORT);
  const proxyTarget = backendUrl || (apiUrl?.replace(/\/api\/?$/, ''));

  return defineConfig({
    plugins: [react(), tailwindcss()],
    server: {
      port: devPort || 5173,
      proxy: proxyTarget
        ? {
            '/api': {
              target: proxyTarget,
              changeOrigin: true,
            },
            '/socket.io': {
              target: proxyTarget,
              changeOrigin: true,
              ws: true,
            },
          }
        : undefined,
    },
  });
};
