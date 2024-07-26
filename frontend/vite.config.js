import {defineConfig} from 'vite'
import react from '@vitejs/plugin-react-swc'

// https://vitejs.dev/config/
export default defineConfig({
    plugins: [react()],
    base: '/static',
    build: {
        outDir: './dist',
    },
    server: {
        // Create a proxy endpoint to the backend to avoid cross-origin (CORS) issues
        proxy: {
            '/sessions': {
                target: 'http://localhost:5000',
                changeOrigin: true
            },
            '/photos': {
                target: 'http://localhost:5000',
                changeOrigin: true
            },
            '/labels': {
                target: 'http://localhost:5000',
                changeOrigin: true
            },
        },
    },
})
