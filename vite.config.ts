import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
    plugins: [react()],
    resolve: {
        alias: {
            '@': '/src',
        },
    },
    define: {
        'global': 'globalThis',
        'process.env': {},
        // PouchDB precisa disso
        'Buffer': ['buffer', 'Buffer'],
    },
    server: {
        port: 3000,
        strictPort: true,
    },
    optimizeDeps: {
        // Forçar inclusão desses pacotes
        include: ['pouchdb-browser', 'pouchdb-find'],
        esbuildOptions: {
            // Permitir require em módulos ES
            define: {
                global: 'globalThis',
            },
        },
    },
    build: {
        outDir: 'dist',
        sourcemap: true,
        commonjsOptions: {
            transformMixedEsModules: true,
        },
    },
})
