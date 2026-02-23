import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

const isCapacitor = process.env.CAPACITOR === 'true'

export default defineConfig({
    plugins: [react()],
    base: isCapacitor ? './' : '/subtracker/',
    server: {
        port: 3000,
        strictPort: true,
    },
    build: {
        outDir: 'dist',
        assetsDir: 'assets',
    },
    define: {
        'import.meta.env.CAPACITOR': JSON.stringify(isCapacitor),
    },
})
