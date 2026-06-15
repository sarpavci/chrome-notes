import type { Config } from "tailwindcss";

export default {
  content: ["./entrypoints/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        linear: {
          canvas: "#0f1011",
          elevated: "#191a1b",
          "text-primary": "#f7f8f8",
          "text-secondary": "#d0d6e0",
          "text-muted": "#8a8f98",
          accent: "#7170ff",
          "accent-brand": "#5e6ad2",
          destructive: "#eb5757",
        },
      },
      fontFamily: {
        inter: ["Inter Variable", "Inter", "system-ui", "sans-serif"],
      },
    },
  },
  plugins: [],
} satisfies Config;
