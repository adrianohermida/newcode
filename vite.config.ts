import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  base: '/newcode/', // Caminho do repositório para GitHub Pages
  plugins: [react()],
  build: {
    outDir: 'dist',
    emptyOutDir: true,
  },
});
