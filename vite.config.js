import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { visualizer } from 'rollup-plugin-visualizer'
import viteCompression from 'vite-plugin-compression'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    // Gzip compression
    viteCompression({
      algorithm: 'gzip',
      ext: '.gz',
    }),
    // Brotli compression
    viteCompression({
      algorithm: 'brotliCompress',
      ext: '.br',
    }),
    // Bundle analyzer - generates stats.html
    visualizer({
      open: false,
      gzipSize: true,
      brotliSize: true,
      filename: 'dist/stats.html',
    }),
  ],
  resolve: {
    alias: {
      '@': '/src',
      '@shared': '/src/shared',
      '@features': '/src/features',
      '@core': '/src/core',
    },
  },
  build: {
    // Disable inlining of small assets to avoid MIME type issues
    assetsInlineLimit: 0,
    // Enable source maps for production debugging
    sourcemap: false,
    // Optimize chunk size warnings
    chunkSizeWarningLimit: 1000,
    // Target modern browsers for better optimization
    target: 'es2015',
    rollupOptions: {
      output: {
        // Manual chunk splitting strategy - consolidated into a single vendor chunk for stability
        manualChunks: (id) => {
          if (id.includes('node_modules')) {
            return 'vendor';
          }
        },
        // Optimize chunk file names
        chunkFileNames: 'assets/js/[name]-[hash].js',
        entryFileNames: 'assets/js/[name]-[hash].js',
        assetFileNames: 'assets/[ext]/[name]-[hash].[ext]',
      },
    },
    // Minification settings
    minify: 'terser',
    terserOptions: {
      compress: {
        // Temporarily disabled for production debugging
        // drop_console: true, // Remove console.logs in production
        drop_debugger: true,
        // pure_funcs: ['console.log', 'console.info'], // Remove specific console methods
      },
    },
  },
  // Optimize dependencies
  optimizeDeps: {
    include: [
      'react',
      'react-dom',
      'react-router-dom',
      '@mui/material',
      '@emotion/react',
      '@emotion/styled'
    ],
  },
  // Server configuration for development
  server: {
    // Enable HTTP/2 for better performance
    https: false,
    // Optimize HMR
    hmr: {
      overlay: true,
    },
  },
})

