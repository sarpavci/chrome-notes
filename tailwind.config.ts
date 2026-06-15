import type { Config } from "tailwindcss";

export default {
  content: ["./entrypoints/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        canvas: "#0f1011",
        elevated: "#191a1b",
        primary: "#f7f8f8",
        secondary: "#d0d6e0",
        muted: "#8a8f98",
        accent: "#7170ff",
        "accent-brand": "#5e6ad2",
        destructive: "#eb5757",
      },
      borderRadius: {
        popup: "12px",
      },
      fontFamily: {
        sans: ['"Inter Variable"', "Inter", "system-ui", "sans-serif"],
      },
    },
  },
  plugins: [],
} satisfies Config;
