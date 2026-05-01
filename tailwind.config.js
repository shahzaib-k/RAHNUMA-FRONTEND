module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      animation: {
        twinkle: 'twinkle 4.5s infinite ease-in-out',
        'twinkle-slow': 'twinkle 7s infinite ease-in-out',
        'twinkle-fast': 'twinkle 3.2s infinite ease-in-out',
      },
      keyframes: {
        twinkle: {
          '0%, 100%': { opacity: '0.65', transform: 'scale(1)' },
          '50%': { opacity: '1', transform: 'scale(1.12)' },
        },
      },
    },
  },
  plugins: [],
}
