/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        bg: "#051912",
        emerald: "#082746",
        teal: "#1D4ED8",
        mint: "#7DD3FC",
        ink: "#F9FAFB",
        muted: "#CBD5E1",
        card: "#082746",
      },
      fontFamily: {
        display: ["'Fraunces'", "serif"],
        body: ["'Inter'", "sans-serif"],
      },
      borderColor: {
        hairline: "rgba(255,255,255,0.10)",
      },
    },
  },
  plugins: [],
};
