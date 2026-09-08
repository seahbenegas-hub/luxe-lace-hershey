import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        ink: "#221E1A",
        paper: "#F3EEE4",
        "paper-deep": "#EAE2D2",
        wine: "#6B2233",
        "wine-soft": "#8B3B4E",
        brass: "#A9863F",
        stone: "#8A7F72",
        primary: {
          50: "#F3EEE4",
          100: "#EAE2D2",
          200: "#D8C9B1",
          300: "#BFA77A",
          400: "#8B3B4E",
          500: "#7A2D40",
          600: "#6B2233",
          700: "#581C2A",
          800: "#431521",
          900: "#321017",
        },
        secondary: {
          50: "#F3EEE4",
          100: "#EEE7DA",
          200: "#EAE2D2",
          300: "#D8CFC0",
          400: "#A99E90",
          500: "#8A7F72",
          600: "#756A5E",
          700: "#514940",
          800: "#342E28",
          900: "#221E1A",
        }
      },
      fontFamily: {
        sans: ["Inter", "system-ui", "sans-serif"],
      },
    },
  },
  plugins: [],
};

export default config;
