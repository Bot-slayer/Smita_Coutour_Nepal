
/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],

  theme: {
    extend: {
      colors: {
        /*
         * Dynamic website colors.
         *
         * These values are controlled by:
         * Admin > Appearance
         */

        ivory: "rgb(var(--website-background-rgb) / <alpha-value>)",

        charcoal: "rgb(var(--website-primary-rgb) / <alpha-value>)",

        taupe: "rgb(var(--website-text-rgb) / <alpha-value>)",

        gold: "rgb(var(--website-accent-rgb) / <alpha-value>)",

        border: "rgb(var(--website-border-rgb) / <alpha-value>)",

        "light-taupe":
          "rgb(var(--website-light-taupe-rgb) / <alpha-value>)",
      },

      /*
       * Dynamic fonts.
       *
       * These are controlled by:
       * Admin > Appearance
       */

      fontFamily: {
        serif: [
          "var(--website-heading-font)",
          "Georgia",
          "serif",
        ],

        sans: [
          "var(--website-body-font)",
          "Inter",
          "system-ui",
          "sans-serif",
        ],
      },

      fontSize: {
        "display-xl": [
          "4.5rem",
          {
            lineHeight: "1.1",
            letterSpacing: "-0.02em",
          },
        ],

        "display-lg": [
          "3.5rem",
          {
            lineHeight: "1.1",
            letterSpacing: "-0.02em",
          },
        ],

        "display-md": [
          "2.5rem",
          {
            lineHeight: "1.15",
            letterSpacing: "-0.01em",
          },
        ],

        "display-sm": [
          "2rem",
          {
            lineHeight: "1.2",
            letterSpacing: "-0.01em",
          },
        ],
      },

      letterSpacing: {
        "widest-xl": "0.2em",
        "widest-lg": "0.15em",
      },

      spacing: {
        "18": "4.5rem",
        "22": "5.5rem",
      },

      maxWidth: {
        "8xl": "88rem",
        "9xl": "96rem",
      },

      animation: {
        "fade-in": "fadeIn 0.6s ease-in-out",
        "slide-up": "slideUp 0.5s ease-out",
        "slide-in-right": "slideInRight 0.35s ease-out",
      },

      keyframes: {
        fadeIn: {
          "0%": {
            opacity: "0",
          },
          "100%": {
            opacity: "1",
          },
        },

        slideUp: {
          "0%": {
            opacity: "0",
            transform: "translateY(20px)",
          },
          "100%": {
            opacity: "1",
            transform: "translateY(0)",
          },
        },

        slideInRight: {
          "0%": {
            transform: "translateX(100%)",
          },
          "100%": {
            transform: "translateX(0)",
          },
        },
      },

      backgroundImage: {
        noise:
          "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.03'/%3E%3C/svg%3E\")",
      },
    },
  },

  plugins: [],
};

