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
          50: "#EFF6FF", 100: "#DBEAFE", 200: "#BFDBFE", 300: "#93C5FD",
          400: "#60A5FA", 500: "#3B82F6", 600: "#2563EB", 700: "#1D4ED8",
          800: "#1E40AF", 900: "#1E3A8A"
        },
        navy: { 50: "#F0F4FF", 100: "#D6E0F0", 700: "#284D80", 800: "#20426E", 900: "#1B3A6B" }
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
