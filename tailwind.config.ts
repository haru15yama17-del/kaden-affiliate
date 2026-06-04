import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        ink: "#2d2420",
        paper: "#fdf9f5",
        accent: "#c45c78",
        sub: "#6a9e7f",
        gold: "#c4924a",
        ok: "#4fa378",
        ng: "#d44f4f",
        blush: "#fef1f4",
        moss: "#e8f0e9",
      },
      fontFamily: {
        sans: ["var(--font-sans)", "system-ui", "sans-serif"],
        serif: ["var(--font-serif)", "serif"],
      },
      boxShadow: {
        card: "0 1px 4px 0 rgba(0,0,0,0.06), 0 2px 8px 0 rgba(0,0,0,0.04)",
        "card-hover": "0 4px 20px 0 rgba(196,92,120,0.14)",
        cta: "0 4px 14px 0 rgba(196,92,120,0.32)",
        "sticky-top": "0 -4px 16px 0 rgba(0,0,0,0.08)",
      },
    },
  },
  plugins: [],
};
export default config;
