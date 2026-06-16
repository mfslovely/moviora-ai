import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./lib/**/*.{js,ts,jsx,tsx,mdx}"
  ],
  theme: {
    extend: {
      colors: {
        ink: "#090b10",
        graphite: "#151922",
        ember: "#e55812",
        saffron: "#ffb000",
        mint: "#45d6a5"
      },
      boxShadow: {
        glow: "0 24px 80px rgba(229, 88, 18, 0.18)"
      }
    }
  },
  plugins: []
};

export default config;
