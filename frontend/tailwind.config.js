/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'primary': '#FFD700',
        'secondary': '#6366F1',
        'accent': '#10B981',
        'soft-pink': '#FDF4FF',
        'soft-blue': '#EFF6FF',
        'soft-yellow': '#FFFBEB',
        'soft-green': '#F0FDF4',
        'bright-orange': '#FB923C',
        'deep-purple': '#7C3AED',
        'blackBG': '#FAFAFA',
        'Favorite': '#EF4444'
      },
      fontFamily: {
        'primary' : ["Montserrat", "sans-serif"],
        'secondary' : ["Nunito Sans", "sans-serif"]
      },
      backgroundImage: {
        'gradient-primary': 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        'gradient-warm': 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
        'gradient-fresh': 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
        'gradient-sunny': 'linear-gradient(135deg, #FFD700 0%, #FFA500 100%)',
      },
      boxShadow: {
        'soft': '0 2px 15px rgba(0,0,0,0.08)',
        'hover': '0 10px 40px rgba(0,0,0,0.15)',
        'glow': '0 0 20px rgba(99, 102, 241, 0.3)',
      }
    },
  },
  plugins: [],
}

