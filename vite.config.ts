import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  define: {
    "process": {
      "env":{},
      "browser":true,
    },
  },
  resolve: {
    alias: {
      path: "path-browserify",
      stream: "stream-browserify",
      zlib: "zlib-browserify",
      buffer: "buffer/"
    },
  },
});
