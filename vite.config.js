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
  build: {
    // Enable source maps for production debugging
    sourcemap: false,
    // Optimize chunk size warnings
    chunkSizeWarningLimit: 1000,
    // Target modern browsers for better optimization
    target: 'es2015',
    rollupOptions: {
      output: {
        // Manual chunk splitting strategy - optimized for performance
        manualChunks: (id) => {
          // React core - critical for initial load
          if (id.includes('node_modules/react') ||
            id.includes('node_modules/react-dom') ||
            id.includes('node_modules/react-router-dom')) {
            return 'react-vendor';
          }

          // Material-UI core - split by usage
          if (id.includes('@mui/material')) {
            return 'mui-core';
          }

          // Material-UI icons - separate chunk (lazy loaded)
          if (id.includes('@mui/icons-material')) {
            return 'mui-icons';
          }

          // Firebase - separate chunk
          if (id.includes('firebase')) {
            return 'firebase';
          }

          // Notistack - separate chunk
          if (id.includes('notistack')) {
            return 'notistack';
          }

          // Other node_modules
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
        drop_console: true, // Remove console.logs in production
        drop_debugger: true,
        pure_funcs: ['console.log', 'console.info'], // Remove specific console methods
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

