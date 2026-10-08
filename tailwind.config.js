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
        sans: ["'Google Sans Flex'", "'Google Sans'", "Arial", "sans-serif"],
        display: ["'Google Sans Flex'", "'Google Sans'", "Arial", "sans-serif"],
        heading: ["'Google Sans Flex'", "'Google Sans'", "Arial", "sans-serif"],
        body: ["'Google Sans Flex'", "'Google Sans'", "Arial", "sans-serif"],
      },
      borderColor: {
        hairline: "rgb(var(--color-light) / 0.10)",
      },
    },
  },
  plugins: [],
};
