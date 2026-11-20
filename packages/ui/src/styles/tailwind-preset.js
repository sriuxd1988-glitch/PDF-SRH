/** @type {import('tailwindcss').Config} */
module.exports = {
  theme: {
    extend: {
      colors: {
        primary: {
          50: 'var(--primary-50)',
          100: 'var(--primary-100)',
          200: 'var(--primary-200)',
          300: 'var(--primary-300)',
          400: 'var(--primary-400)',
          500: 'var(--primary-500)',
          600: 'var(--primary-600)',
          700: 'var(--primary-700)',
          800: 'var(--primary-800)',
          900: 'var(--primary-900)',
        },
        secondary: 'var(--secondary)',
        ink: 'var(--ink)',
        surface: 'var(--card)',
        canvas: 'var(--bg)',
        muted: 'var(--muted)',
        line: 'var(--line)',
        lime: 'var(--lime)',
        cyan: 'var(--cyan)',
        yellow: 'var(--yellow)',
        ok: 'var(--ok)',
        danger: 'var(--no)',
      },
      fontFamily: {
        heading: ['var(--font-heading)', 'sans-serif'],
        sans: ['var(--font-body)', 'sans-serif'],
        mono: ['var(--font-mono)', 'monospace'],
      },
      borderRadius: {
        pill: 'var(--radius-pill)',
        card: 'var(--radius-lg)',
      },
      boxShadow: {
        nuvexa: 'var(--shadow)',
      },
    },
  },
};
