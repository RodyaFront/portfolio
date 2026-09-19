import type { Config } from 'tailwindcss'

export default {
  content: [],
  theme: {
    extend: {
      colors: {
        paper: {
          DEFAULT: '#f7f4ef',
          soft: '#efeae2',
        },
        // Do not name a color `base`: it collides with Tailwind `text-base` (font-size).
        elevate: 'var(--bg-elevate)',
        ink: {
          DEFAULT: '#1a1a1a',
          mute: '#5c5c5c',
          faint: '#8a8a8a',
        },
        accent: {
          DEFAULT: '#1a56db',
          hover: '#1347b8',
          visited: '#5b3d8f',
        },
      },
      fontFamily: {
        sans: [
          'system-ui',
          '-apple-system',
          'Segoe UI',
          'Roboto',
          'Helvetica Neue',
          'Arial',
          'sans-serif',
        ],
      },
      maxWidth: {
        page: 'var(--page-max)',
        hero: 'var(--hero-max)',
      },
      borderRadius: {
        DEFAULT: '0.5rem',
      },
    },
  },
  plugins: [],
} satisfies Config
