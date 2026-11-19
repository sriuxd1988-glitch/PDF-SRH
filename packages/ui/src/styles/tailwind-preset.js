/** @type {import('tailwindcss').Config} */
module.exports = {
  theme: {
    extend: {
      colors: {
        primary: {
          500: 'var(--primary-500)',
          700: 'var(--primary-700)',
          50: 'var(--primary-50)',
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
