import { defineConfig } from "wxt";
import path from "path";

export default defineConfig({
  modules: ["@wxt-dev/module-react"],
  manifest: {
    name: "Chrome Notes",
    description: "Quick notes in your browser",
    permissions: ["storage", "sidePanel"],
    side_panel: {
      default_path: "sidepanel.html",
    },
    // version and manifest_version are managed by WXT
    icons: {
      16: "icon/16.png",
      32: "icon/32.png",
      48: "icon/48.png",
      128: "icon/128.png",
    },
    action: {
      default_title: "Chrome Notes",
      default_icon: {
        16: "icon/16.png",
        32: "icon/32.png",
        48: "icon/48.png",
        128: "icon/128.png",
      },
    },
    commands: {
      // Ctrl+Shift+N is reserved by Chrome (incognito window) — using Ctrl+Shift+Y instead
      _execute_action: {
        suggested_key: {
          default: "Ctrl+Shift+Y",
          mac: "Command+Shift+Y",
        },
        description: "Open Chrome Notes",
      },
    },
    minimum_chrome_version: "116",
    homepage_url: "https://github.com/sarpavci/chrome-notes",
  },
  vite: () => ({
    resolve: {
      alias: {
        "@": path.resolve(__dirname, "."),
      },
    },
  }),
});
