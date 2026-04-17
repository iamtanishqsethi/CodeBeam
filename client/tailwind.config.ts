import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./hooks/**/*.{ts,tsx}",
    "./lib/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      borderRadius: {
        sharp: "var(--radius-sharp)",
        soft: "var(--radius-soft)",
        pill: "var(--radius-pill)",
      },
      colors: {
        tile: "var(--tile-bg)",
        "control-bar": "var(--control-bar-bg)",
        "speaking-ring": "var(--speaking-ring)",
        "muted-overlay": "var(--muted-overlay)",
      },
      transitionDuration: {
        fast: "150ms",
        base: "250ms",
        slow: "400ms",
      },
    },
  },
};

export default config;
