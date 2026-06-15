import { defineConfig } from "wxt";
import path from "path";

export default defineConfig({
  extensionApi: "chrome",
  modules: ["@wxt-dev/module-react"],
  manifest: {
    name: "Chrome Notes",
    description: "Quick notes in your browser",
    permissions: ["storage", "sidePanel"],
    side_panel: {
      default_path: "sidepanel.html",
    },
  },
  vite: () => ({
    resolve: {
      alias: {
        "@": path.resolve(__dirname, "."),
      },
    },
  }),
});
