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
        ink: "#102A43",
        brand: {
          50: "#ECFDFB",
          100: "#D1FAF4",
          200: "#A7F3E9",
          300: "#6EE7D7",
          400: "#2DD4BF",
          500: "#14B8A6",
          600: "#0F9488",
          700: "#0F766E",
          800: "#115E59",
          900: "#134E4A"
        },
        navy: {
          50: "#EEF4FB",
          100: "#D9E7F5",
          700: "#1E4D78",
          800: "#173B5D",
          900: "#102A43"
        }
      },
      boxShadow: {
        soft: "0 12px 34px rgba(16,42,67,.08)"
      },
      borderRadius: {
        "2xl": "1.25rem"
      }
    }
  },
  plugins: []
};

export default config;
