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
        canvas: "#f3efe7",
        ink: "#1f2937",
        mist: "#f8f5ef",
        line: "#d8d2c8",
        accent: {
          DEFAULT: "#1f6b63",
          soft: "#d4e8e1",
          deep: "#164f49",
        },
        sand: "#ece5d8",
      },
      boxShadow: {
        soft: "0 20px 45px -30px rgba(31, 41, 55, 0.28)",
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
