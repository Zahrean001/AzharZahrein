/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}'],
  theme: {
    extend: {
      colors: {
        ink: '#0c0c0c',
        paper: '#f4f1ea',
        'paper-warm': '#ede9e0',
        'paper-line': '#dcd6cb',
        mineral: '#234433',
        'mineral-light': '#2e5a44',
      },
      fontFamily: {
        display: ['Oswald', 'sans-serif'],
        condensed: ['Anton', 'sans-serif'],
        body: ['Archivo', 'sans-serif'],
      },
    },
  },
  plugins: [],
};
