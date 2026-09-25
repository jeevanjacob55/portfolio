/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        bg: "#050A08",
        emerald: "#047857",
        teal: "#0D9488",
        mint: "#6EE7B7",
        ink: "#F8FAFC",
        muted: "#A1A1AA",
        card: "#09090B",
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
