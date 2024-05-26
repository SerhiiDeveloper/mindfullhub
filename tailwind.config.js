/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      transitionProperty: {
        height: "height",
      },
      animation: {
        breath: "breath 10s linear infinite",
      },
      keyframes: {
        breath: {
          "0%, 100%": { transform: "scale(0.3)", opacity: "0.9" },
          "50%": { transform: "scale(1)", opacity: "0.35" },
        },
      },
    },
  },
  plugins: [],
};
