/** @type {import('tailwindcss').Config} */
module.exports = {
  presets: [require("nativewind/preset")], // ✅ MUST ADD THIS

  content: [
    "./App.{js,jsx,ts,tsx}",
    "./src/**/*.{js,jsx,ts,tsx}"
  ],

  theme: {
    extend: {},
  },

  plugins: [],
};