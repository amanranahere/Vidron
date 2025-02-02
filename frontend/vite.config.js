import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vitejs.dev/config/
export default defineConfig({
  server: {
    proxy: {
      "/api": process.env.VITE_REACT_APP_BACKEND_BASEURL,
    },
  },
  plugins: [react()],
});
