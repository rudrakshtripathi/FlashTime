/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        'terminal-black': '#0a0a0a',
        'terminal-dark': '#1a1a1a',
        'cyber-green': '#00ff88',
        'cyber-blue': '#00d9ff',
        'cyber-purple': '#8b5cf6',
      },
      fontFamily: {
        'mono': ['JetBrains Mono', 'monospace'],
      },
      animation: {
        'fade-in': 'fadeIn 0.5s ease-out',
        'slide-up': 'slideUp 0.6s ease-out',
        'scale-in': 'scaleIn 0.3s ease-out',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0', transform: 'translateY(10px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        slideUp: {
          '0%': { opacity: '0', transform: 'translateY(30px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        scaleIn: {
          '0%': { opacity: '0', transform: 'scale(0.9)' },
          '100%': { opacity: '1', transform: 'scale(1)' },
        },
      },
      backgroundImage: {
        'cyber-gradient': 'linear-gradient(45deg, #8b5cf6, #00d9ff)',
        'terminal-gradient': 'linear-gradient(135deg, #0a0a0a, #1a1a1a)',
      },
      boxShadow: {
        'cyber': '0 0 20px rgba(139, 92, 246, 0.3)',
        'cyber-blue': '0 0 20px rgba(0, 217, 255, 0.3)',
        'cyber-green': '0 0 20px rgba(0, 255, 136, 0.3)',
      },
    },
  },
  plugins: [],
  safelist: [
    'text-cyber-blue',
    'text-cyber-purple',
    'text-cyber-green',
    'text-orange-400',
    'bg-cyber-blue/20',
    'bg-cyber-purple/20',
    'bg-cyber-green/20',
    'bg-orange-400/20',
  ],
};