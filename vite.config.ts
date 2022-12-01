import { defineConfig, Plugin } from "vite"
import react from "@vitejs/plugin-react"
import { devMiddleware, previewMiddleware } from "./ssr";

const ssrPlugin = (): Plugin => {
  return {
    name: "ssr",
    async configureServer(server) {
      devMiddleware(server);
    },
    async configurePreviewServer(server) {
      previewMiddleware(server);
    }
  }
}

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react(), ssrPlugin()]
});
