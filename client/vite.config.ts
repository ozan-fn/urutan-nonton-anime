import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
    plugins: [react()],
    appType: 'mpa',
    build: {
        outDir: '../api/dist/public'
    },
    server: {
        proxy: {
            '/api/myanimelist': 'http://localhost:3001'
        }
    }
})
