import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
    plugins: [react()],
    base: '/subtracker/',
    server: {
        port: 3000,
        strictPort: true,
    },
    build: {
        outDir: 'dist',
        assetsDir: 'assets',
    }
})
