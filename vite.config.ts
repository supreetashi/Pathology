import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  base: "/pathology/", //  frontend_url
  plugins: [react()],
});
