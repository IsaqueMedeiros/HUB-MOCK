import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        hubspot: {
          50: '#fff5f2',
          100: '#ffe8e1',
          200: '#ffd4c9',
          300: '#ffb5a3',
          400: '#ff8a6d',
          500: '#ff5722',
          600: '#f4511e',
          700: '#e64a19',
          800: '#d84315',
          900: '#bf360c',
        },
        journey: {
          prospeccao: '#3b82f6',
          onboarding: '#f59e0b',
          relacionamento: '#10b981',
          bg: '#f8fafc',
          border: '#e2e8f0'
        }
      },
      animation: {
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'bounce-light': 'bounce 2s infinite',
      }
    },
  },
  plugins: [],
};

export default config;