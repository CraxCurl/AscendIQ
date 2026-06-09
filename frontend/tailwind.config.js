/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,tsx,jsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: "#6366f1",
        secondary: "#a855f7",
        accent: "#f43f5e",
        background: "#0f172a",
        surface: "#1e293b",
      },
    },
  },
  plugins: [],
}
