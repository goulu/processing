import { defineConfig } from 'vite';

export default defineConfig({
  base: './',
  build: {
    rollupOptions: {
      input: {
        main: './index.html',
        galaxy: './src/Galaxy/index.html',
        nbody: './src/NBody/index.html',
        randomTiling: './src/RandomTiling/index.html',
        sitemap: './src/Sitemap/index.html',
        tspart: './src/TSPart/index.html'
      }
    }
  }
});
