import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vitejs.dev/config/
export default defineConfig({
  server: {
    proxy: {
      "/api": "https://vidron-backend.vercel.app/api/v1",
    },
  },
  plugins: [react()],
});
