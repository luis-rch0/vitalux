import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: "class",
  content: ["./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        brand: {
          50: "#effbf5",
          100: "#d8f5e5",
          200: "#b5e9cc",
          300: "#82d3a6",
          500: "#4cad78",
          600: "#37865d",
          700: "#286646",
          900: "#183d2c",
        },
      },
      boxShadow: { soft: "0 10px 28px rgba(24, 61, 44, 0.10)" },
    },
  },
  plugins: [],
};

export default config;
