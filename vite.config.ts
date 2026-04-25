import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { fileURLToPath, URL } from 'node:url';

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      'las-core-sdk': fileURLToPath(
        new URL('../las-core-sdk/src/index.ts', import.meta.url),
      ),
    },
  },
});
