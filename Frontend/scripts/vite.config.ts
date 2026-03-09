import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";
import tailwindcss from "tailwindcss";
import autoprefixer from "autoprefixer";

const DEV_PORT = Number(process.env.PORT || 5000);

export default defineConfig({
  plugins: [
    react(),
  ],
  resolve: {
    alias: {
      "@": path.resolve(import.meta.dirname, "..", "src"),
      "@shared": path.resolve(import.meta.dirname, "..", "shared"),
    },
  },
  root: path.resolve(import.meta.dirname, ".."),
  build: {
    outDir: path.resolve(import.meta.dirname, "..", "dist/public"),
    emptyOutDir: true,
  },
  css: {
    postcss: {
      plugins: [
        tailwindcss({
          config: path.resolve(import.meta.dirname, "..", "tailwind.config.ts"),
        }) as any,
        autoprefixer(),
      ],
    },
  },
  server: {
    hmr: {
      path: "/vite-hmr",
      clientPort: DEV_PORT,
      port: DEV_PORT,
      host: "localhost",
      protocol: "ws",
    },
    fs: {
      strict: true,
      deny: ["**/.*"],
    },
  },
});
