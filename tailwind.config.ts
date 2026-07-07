import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./app/**/*.{ts,tsx}", "./lib/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        ink: "#1a1330",
        saffron: "#e08b2f",
        cream: "#faf6ee"
      }
    }
  },
  plugins: []
};
export default config;
