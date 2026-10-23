import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: "class",
  content: ["./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      fontFamily: { display: ["Georgia", "Cambria", "Times New Roman", "serif"] },
      colors: {
        brand: {
          50: "#f0f5f1",
          100: "#e6eee8",
          200: "#c6d9cc",
          300: "#a3c5b0",
          500: "#397b62",
          600: "#28664f",
          700: "#20513f",
          900: "#173f35",
        },
      },
      boxShadow: { soft: "0 4px 24px rgba(24, 61, 44, 0.045)" },
    },
  },
  plugins: [],
};

export default config;
