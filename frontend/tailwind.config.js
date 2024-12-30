/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"], // Paths to your files
  theme: {
    extend: {},
  },
  plugins: [require("tailwind-scrollbar")],
};
