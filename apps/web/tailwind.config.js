/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    '../../packages/ui/src/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  presets: [require('../../packages/ui/src/styles/tailwind-preset.js')],
  theme: {
    extend: {},
  },
  plugins: [],
};
