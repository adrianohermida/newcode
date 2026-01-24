import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  base: '/newcode/',
  plugins: [react()],
  root: 'src/react-app',
  build: {
    outDir: '../../dist',
    emptyOutDir: true,
    rollupOptions: {
      input: 'index.html',
    },
  },
});
