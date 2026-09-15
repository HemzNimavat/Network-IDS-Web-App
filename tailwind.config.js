/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,jsx}",
    "./components/**/*.{js,jsx}",
  ],
  theme: {
    extend: {
      colors: {
        bg: "#0B1220",
        panel: "#121B2E",
        line: "#24314A",
        ink: "#DCE4F0",
        muted: "#7C8AA6",
        safe: "#37D6B0",
        alert: "#FF7A59",
        signal: "#5EA8FF",
      },
      fontFamily: {
        display: ["var(--font-display)", "sans-serif"],
        body: ["var(--font-body)", "sans-serif"],
        mono: ["var(--font-mono)", "monospace"],
      },
    },
  },
  plugins: [],
};
