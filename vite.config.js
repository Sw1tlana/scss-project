import imagemin from "imagemin";
import imageminWebp from "imagemin-webp";
import path from "path";
import { defineConfig } from "vite";
import glob from "fast-glob";
import { fileURLToPath } from "url";
import { ViteImageOptimizer } from "vite-plugin-image-optimizer";
import { viteStaticCopy } from 'vite-plugin-static-copy'; // ✅ Додаємо плагін

export default defineConfig({
  base: '/scss-project/',
  plugins: [
    ViteImageOptimizer({
      png: { quality: 86 },
      jpeg: { quality: 86 },
      jpg: { quality: 86 },
    }),
    {
      ...imagemin(["./src/img/**/*.{jpg,png,jpeg}"], {
        destination: "./src/img/webp/",
        plugins: [imageminWebp({ quality: 86 })],
      }),
      apply: "serve",
    },
    viteStaticCopy({ 
      targets: [
        {
          src: 'src/img/icons.svg', 
          dest: 'assets'            
        },
        {
          src: 'src/fonts/*.woff*', 
          dest: 'assets'           
        }
      ]
    }),
  ],
  build: {
    minify: false,
    rollupOptions: {
      input: Object.fromEntries(
        glob
          .sync(["./*.html", "./pages/**/*.html"])
          .map((file) => [
            path.relative(__dirname, file.slice(0, file.length - path.extname(file).length)),
            fileURLToPath(new URL(file, import.meta.url)),
          ])
      ),
      output: {
        assetFileNames: ({ name }) => {
          if (/\.(woff2?|ttf|eot|svg)$/.test(name ?? '')) {
            return 'assets/[name][extname]'; 
          }
          return 'assets/[name]-[hash][extname]';
        },
      },
    },
  },
});
