import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";

/** The backend from `bun run start` / `bun run dev:backend` (src/main.ts, PORT defaults to 8080). */
const backend = process.env.BACKEND_URL ?? "http://localhost:8080";

export default defineConfig({
  plugins: [vue()],
  server: {
    port: 5173,
    // The backend serves its endpoints under /api; the dev server forwards those requests
    // unchanged and serves the pages itself.
    proxy: { "/api": backend },
  },
});
