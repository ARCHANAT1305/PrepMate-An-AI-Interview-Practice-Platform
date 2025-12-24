/**
 * Tailwind config for Prepmate mini project
 * Registers `tailwindcss-animate` plugin instead of using @plugin in CSS.
 */
module.exports = {
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './pages/**/*.{js,ts,jsx,tsx,mdx}'
  ],
  theme: {
    extend: {},
  },
  plugins: [
    // animation utilities
    require('tailwindcss-animate')
  ],
}
