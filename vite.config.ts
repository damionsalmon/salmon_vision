import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

export default defineConfig({
  plugins: [react(), tailwindcss()],
  // strictPort so Electron's fixed dev-server URL (electron/main.cjs) can
  // never silently point at the wrong port if 5173 is already taken.
  server: { port: 5173, strictPort: true, open: true }
});
