import react from '@vitejs/plugin-react';

import { defineConfig } from 'vite';

function getVersion() {
  const now = new Date();
  const y = now.getFullYear();
  const m = String(now.getMonth() + 1).padStart(2, '0');
  const d = String(now.getDate()).padStart(2, '0');
  const hh = String(now.getHours()).padStart(2, '0');
  const mm = String(now.getMinutes()).padStart(2, '0');
  const ss = String(now.getSeconds()).padStart(2, '0');
  return `${y}${m}${d}-${hh}${mm}${ss}`;
}

export default defineConfig(({ mode }) => {
  return {
    base: mode === 'development' ? '/' : '/wp-content/plugins/um-configurator/app-dist/rcAdmin/',
    server: {
      proxy: {
        '/wp-json': {
          target: 'http://localhost:8080/',
          changeOrigin: true,
          secure: false,
        },
      },
    },
    build: {
      sourcemap: true,
      rollupOptions: {
        output: {
          dir: 'build',
          entryFileNames: 'main.[hash].js',
          assetFileNames(chunkInfo) {
            if (chunkInfo.name === 'index.css') {
              return 'main.[hash].css';
            }
            return 'assets/' + chunkInfo.name;
          },
        },
      },
    },
    define: {
      __APP_VERSION__: JSON.stringify(process.env.VITE_APP_VERSION || getVersion()),
    },
    plugins: [react()],
  };
});
