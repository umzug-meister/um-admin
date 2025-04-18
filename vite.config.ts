import react from '@vitejs/plugin-react';

import { defineConfig } from 'vite';
import loadVersion from 'vite-plugin-package-version';

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
    plugins: [react(), loadVersion()],
  };
});
