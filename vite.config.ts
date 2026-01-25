
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { resolve } from 'path';

export default defineConfig({
  base: '/newcode/',
  plugins: [react()],
  root: 'src/react-app',
  build: {
    outDir: resolve(__dirname, '../dist'),
    emptyOutDir: true,
  },
});
