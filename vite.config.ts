import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    port: 8000,
    host: '',
    strictPort: true, // Ensure Vite uses exactly port 3000
  },
});
