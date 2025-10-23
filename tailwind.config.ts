import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        junot: {
          navy: {
            dark: '#0A1628',
            DEFAULT: '#132035',
            light: '#1a2d47',
          },
          gold: {
            dark: '#B8941F',
            DEFAULT: '#D4AF37',
            light: '#E5C158',
          },
          blue: {
            muted: '#8896ab',
            light: '#c5d0de',
          },
          border: {
            primary: '#2a3f5f',
            secondary: '#1f3147',
          }
        },
        modern: {
          bg: {
            primary: '#0A1628',
            secondary: '#132035',
            tertiary: '#1a2d47',
          },
          border: {
            primary: '#2a3f5f',
            secondary: '#1f3147',
          },
          text: {
            primary: '#ffffff',
            secondary: '#c5d0de',
            tertiary: '#8896ab',
          },
          accent: {
            primary: '#D4AF37',
            hover: '#E5C158',
          },
          success: '#22c55e',
          error: '#ef4444',
          warning: '#f59e0b',
        }
      },
      animation: {
        'fade-in': 'fadeIn 0.5s ease-in-out',
        'slide-up': 'slideUp 0.3s ease-out',
        'shimmer': 'shimmer 2s infinite',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { transform: 'translateY(10px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        shimmer: {
          '0%': { backgroundPosition: '-1000px 0' },
          '100%': { backgroundPosition: '1000px 0' },
        },
      },
      fontFamily: {
        'serif': ['Georgia', 'Cambria', 'Times New Roman', 'serif'],
        'sans': ['Inter', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
};

export default config;
