/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        bg: "rgb(var(--color-base) / <alpha-value>)",
        emerald: "rgb(var(--color-deep) / <alpha-value>)",
        teal: "rgb(var(--color-royal) / <alpha-value>)",
        mint: "rgb(var(--color-ice) / <alpha-value>)",
        ink: "rgb(var(--color-light) / <alpha-value>)",
        muted: "rgb(var(--color-muted) / <alpha-value>)",
        card: "rgb(var(--color-deep) / <alpha-value>)",
      },
      fontFamily: {
        display: ["'Fraunces'", "serif"],
        heading: ["'Google Sans Flex'", "sans-serif"],
        body: ["'Inter'", "sans-serif"],
      },
      borderColor: {
        hairline: "rgb(var(--color-light) / 0.10)",
      },
    },
  },
  plugins: [],
};
