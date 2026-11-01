import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        ink: "#30392d",
        paper: "#fcfbf6",
        accent: "#476c4d",
        sub: "#6b845b",
        gold: "#c4924a",
        ok: "#4fa378",
        ng: "#d44f4f",
        blush: "#f0f2e7",
        moss: "#e7ecdf",
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
