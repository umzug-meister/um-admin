import react from '@vitejs/plugin-react';

import { defineConfig } from 'vite';
import loadVersion from 'vite-plugin-package-version';

export default defineConfig(({ mode }) => {
  return {
    base: mode === 'development' ? '/' : '/wp-content/plugins/um-configurator/app-dist/rcAdmin/',
    server: {
      proxy: {
        '/wp-json': {
          target: 'http://localhost/wp',
          changeOrigin: true,
          secure: false,
        },
      },
    },
    build: {
      rollupOptions: {
        output: {
          dir: 'build',
        },
      },
    },
    plugins: [react(), loadVersion()],
  };
});
