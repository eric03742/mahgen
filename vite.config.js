import { resolve } from 'path'
import { defineConfig } from 'vite';
import dts from 'vite-plugin-dts'

export default defineConfig({
    plugins: [dts({
        outputDir: resolve(__dirname, 'dist/types'),
        copyDtsFiles: false,
    })],
    build: {
        lib: {
            entry: resolve(__dirname, 'src/index.ts'),
            name: 'Mahgen',
            fileName: 'index'
        },
        rollupOptions: {
            external: ['jimp/browser/lib/jimp'],
            output: {
                globals: {
                    'jimp/browser/lib/jimp': 'Jimp'
                }
            }
        }
    }
});
