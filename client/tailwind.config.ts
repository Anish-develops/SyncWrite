import type { Config } from 'tailwindcss';

export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  darkMode: ['class', '[data-theme="dark"]'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['"Instrument Sans"', 'system-ui', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'ui-monospace', 'monospace'],
      },
      colors: {
        surface: {
          ground: 'var(--surface-ground)',
          raised: 'var(--surface-raised)',
          overlay: 'var(--surface-overlay)',
          sunken: 'var(--surface-sunken)',
        },
        editor: {
          bg: 'var(--editor-bg)',
          gutter: 'var(--editor-gutter)',
          linehl: 'var(--editor-line-hl)',
        },
        terminal: {
          bg: 'var(--terminal-bg)',
        },
        text: {
          primary: 'var(--text-primary)',
          secondary: 'var(--text-secondary)',
          tertiary: 'var(--text-tertiary)',
          inverse: 'var(--text-inverse)',
        },
        accent: {
          DEFAULT: 'var(--accent-primary)',
          hover: 'var(--accent-primary-hover)',
          secondary: 'var(--accent-secondary)',
        },
        semantic: {
          success: 'var(--success)',
          successBg: 'var(--success-bg)',
          warning: 'var(--warning)',
          warningBg: 'var(--warning-bg)',
          error: 'var(--error)',
          errorBg: 'var(--error-bg)',
          info: 'var(--info)',
          infoBg: 'var(--info-bg)',
        },
        border: {
          DEFAULT: 'var(--border-default)',
          strong: 'var(--border-strong)',
          focus: 'var(--border-focus)',
        },
      },
      borderRadius: {
        sm: '2px',
        DEFAULT: '4px',
        md: '6px',
      },
    },
  },
  plugins: [],
} satisfies Config;
