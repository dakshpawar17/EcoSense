/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        brand: {
          50: "#f0fdf4",
          100: "#dcfce7",
          200: "#bbf7d0",
          300: "#86efac",
          400: "#4ade80",
          500: "#22c55e",
          600: "#16a34a",
          700: "#15803d",
          800: "#166534",
          900: "#14532d",
          950: "#052e16",
        },
        emerald: {
          400: "#34d399",
          500: "#10b981",
          600: "#059669",
        },
        dark: {
          bg: "#0B132B",
          card: "#1C2541",
          border: "#2A365C",
          text: "#E0E1DD",
        },
      },
      fontFamily: {
        sans: ["Outfit", "Inter", "sans-serif"],
      },
      boxShadow: {
        glass: "0 8px 32px 0 rgba(0, 0, 0, 0.12)",
        glow: "0 0 20px rgba(34, 197, 94, 0.3)",
      },
    },
  },
  plugins: [],
};
