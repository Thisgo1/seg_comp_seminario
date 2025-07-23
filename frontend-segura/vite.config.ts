    import { defineConfig } from 'vite';
    import react from '@vitejs/plugin-react';
    import tailwindcss from '@tailwindcss/vite'
    import path from 'path'; // Importar 'path'

    // https://vitejs.dev/config/
    export default defineConfig({
      plugins: [react(), tailwindcss()],
      resolve: {
        alias: {
          // Configura o alias para @/ para apontar para a pasta src
          '@': path.resolve(__dirname, './src'),
          // Você também pode ser mais específico se preferir:
          // '@/components': path.resolve(__dirname, './src/components'),
          // '@/lib': path.resolve(__dirname, './src/lib'),
        },
      },
    });
