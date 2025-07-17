import { tanstackStart } from '@tanstack/react-start/plugin/vite'
import { defineConfig } from 'vite'
import tsConfigPaths from 'vite-tsconfig-paths'

const proxyPathRegex = /^\/proxy\/pulse/

export default defineConfig({
  server: {
    port: 3000,
    proxy: {
      '/proxy/pulse': {
        target: process.env.VITE_PUBLIC_POSTHOG_HOST,
        changeOrigin: true,
        rewrite: (path) => path.replace(proxyPathRegex, ''),
      },
    },
  },
  plugins: [
    tsConfigPaths({
      projects: ['./tsconfig.json'],
    }),
    tanstackStart({ target: 'netlify' }),
  ],
})
