import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        ink: "var(--ink)",
        panel: "var(--panel)",
        "panel-2": "var(--panel-2)",
        line: "var(--line)",
        em: "var(--em)",
        "em-deep": "var(--em-deep)",
        vio: "var(--vio)",
        text: "var(--text)",
        muted: "var(--muted)",
      },
      fontFamily: {
        space: ["var(--font-space-grotesk)", "sans-serif"],
        manrope: ["var(--font-manrope)", "sans-serif"],
      },
    },
  },
  plugins: [],
};

export default config;
