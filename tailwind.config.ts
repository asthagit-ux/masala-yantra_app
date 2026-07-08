import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./app/**/*.{ts,tsx}", "./lib/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        ink: "#1a1330",
        saffron: "#e08b2f",
        cream: "#faf6ee",
        astronavy: "#00163A",
        astrogold: "#9A7026",
        astroyellow: "#FFD700",
        astrosand: "#EEEBE6",
        astrolight: "#F5F1E9"
      },
      fontFamily: {
        serif: ["var(--font-playfair)", "serif"],
        sans: ["var(--font-montserrat)", "sans-serif"],
        lato: ["var(--font-lato)", "sans-serif"]
      }
    }
  },
  plugins: []
};
export default config;

