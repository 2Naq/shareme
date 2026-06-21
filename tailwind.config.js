/** @type {import('tailwindcss').Config} */
module.exports = {
  corePlugins: {
    preflight: false,
  },
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
    "./docs/**/*.{md,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        crypto: {
          bg: '#020617',
          primary: '#0F172A',
          secondary: '#1E293B',
          cta: '#22C55E',
          text: '#F8FAFC',
          hover: '#166534',
        }
      }
    },
  },
  plugins: [],
}
