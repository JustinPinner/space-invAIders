import { defineConfig } from 'vite';
import { resolve } from 'path';

export default defineConfig({
    resolve: {
        alias: {
            '@': resolve(__dirname, 'src'),
        },
    },
    build: {
        target: 'esnext',
        outDir: 'dist',
        rollupOptions: {
            input: {
                main: resolve(__dirname, 'public/index.html'),
            },
        },
    },
    optimizeDeps: {
        include: ['phaser'],
    },
    // For GitHub Pages deployment
    base: process.env.NODE_ENV === 'production' ? '/space-invaders/' : '/',
});
