import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./lib/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        canvas: "#eef3f7",
        ink: "#1d2530",
        mist: "#edf3f8",
        line: "#cad5e1",
        accent: {
          DEFAULT: "#2f5d8c",
          soft: "#dbe8f4",
          deep: "#213f60",
        },
        sand: "#dfe7e1",
      },
      boxShadow: {
        soft: "0 28px 70px -40px rgba(30, 45, 73, 0.28)",
      },
      fontFamily: {
        sans: ["var(--font-sans)"],
        display: ["var(--font-display)"],
      },
    },
  },
  plugins: [],
};

export default config;
