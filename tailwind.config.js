// /** @type {import('tailwindcss').Config} */
// module.exports = {
//   content: [],
//   theme: {
//     extend: {},
//   },
//   plugins: [],
// }

/** @type {import('tailwindcss').Config} */
const colors = require("tailwindcss/colors")

module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    // 👇 instead of extend, fully override the color palette
    colors: {
      transparent: "transparent",
      current: "currentColor",
      white: "#ffffff",
      black: "#000000",

      // Safe Tailwind colors (hex/rgb, not oklch)
      gray: colors.gray,
      slate: colors.slate,
      red: colors.red,
      green: colors.green,
      blue: colors.blue,
      indigo: colors.indigo,
      yellow: colors.yellow,
      purple: colors.purple,
      pink: colors.pink,

      // your custom roles
      background: "#ffffff",
      foreground: "#111827",
      primary: "#4f46e5",     // indigo-600
      secondary: "#64748b",   // slate-500
      muted: "#f1f5f9",       // slate-100
      destructive: "#ef4444", // red-500
    },
    extend: {
      fontFamily: {
        sans: ["ui-sans-serif", "system-ui", "sans-serif"],
        mono: ["ui-monospace", "monospace"],
      },
    },
  },
  plugins: [],
}
